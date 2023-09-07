import { useState } from "react";
import { callAPI, mockApi, sampleQuestions } from "./Chat";

type Message = {
  id: number;
  timeStamp: Date;
  sender: "human" | "bot";
  content: string;
};

export const ChatWithHistory: React.FC = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasHistory, setHasHistory] = useState(false);

  const isBusy = loading || streaming;

  const addMessageFromBot = (chunk: string) => {
    setMessages((cur) => {
      const last = cur.at(-1);
      if (last?.sender === "bot") {
        return cur.slice(0, -1).concat([
          {
            ...last,
            content: last.content + chunk,
          },
        ]);
      }
      return cur;
    });
  };

  const addToRes = (chunk: string) => {
    !streaming && setStreaming(true);
    addMessageFromBot(chunk);
  };

  const gatherHistory = (messages: Message[]) => {
    return messages
      .map((m) => {
        if (m.sender === "human") {
          return `question: ${m.content}`;
        }
        return `answer: ${m.content}`;
      })
      .join("\n\n");
  };

  const onSubmit = async (submittedQuery: string | null) => {
    if (!submittedQuery) {
      return;
    }

    setLoading(true);
    setQuery(null);
    setMessages((cur) =>
      cur.concat([
        {
          content: submittedQuery,
          id: cur.length,
          sender: "human",
          timeStamp: new Date(),
        },
        {
          id: cur.length,
          sender: "bot",
          content: "",
          timeStamp: new Date(),
        },
      ])
    );

    try {
      const pastMessages = hasHistory ? gatherHistory(messages) : "";
      await callAPI(submittedQuery, addToRes, pastMessages);
    } catch (err: unknown) {
      console.error(err);
      addMessageFromBot(`Something went wrong, please try again later.`);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  return (
    <>
      <div className="shadow-xl rounded-2xl bg-base-200 p-8">
        <>
          {messages.map((message, idx) => {
            if (message.sender === "human") {
              return (
                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img src="public/icons/female.png" />
                    </div>
                  </div>
                  <div className="chat-bubble">{message.content}</div>
                </div>
              );
            }
            return (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src="public/icons/robot.png" />
                  </div>
                </div>
                <div className="chat-bubble max-w-fit">
                  {message.content === "" ? (
                    <code className="animate-ping"> ... </code>
                  ) : (
                    message.content
                  )}
                  {streaming && idx === messages.length - 1 && (
                    <code className="animate-ping"> | </code>
                  )}
                </div>
                <div className="chat-footer opacity-50"></div>
              </div>
            );
          })}
        </>
        {streaming && <progress className="progress w-full"></progress>}
        <div className="flex">
          <input
            type="text"
            placeholder="Ask gippity a question"
            className="input input-bordered w-5/6 my-4"
            disabled={isBusy}
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit(query);
              }
            }}
          />
          <button
            disabled={isBusy || !query}
            className="btn btn-outline my-4 mx-2"
            onClick={() => onSubmit(query)}
          >
            Submit
          </button>
          <div className={isBusy ? "invisible dropdown" : "dropdown"}>
            <label tabIndex={0} className="btn btn-secondary btn-outline my-4">
              Sample Questions
            </label>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box"
            >
              {sampleQuestions.map((q) => (
                <li key={q}>
                  <button
                    disabled={isBusy}
                    onClick={() => {
                      setQuery(q);
                      onSubmit(q);
                    }}
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        tabIndex={0}
        className="collapse collapse-plus my-6 h-1/2 max-w-full shadow-xl rounded-2xl bg-base-200 p-8"
      >
        <input type="checkbox" />

        <div className="collapse-title text-xl font-medium">Settings</div>
        <div className="collapse-content">
          <label className="mx-2 label cursor-pointer w-2/6">
            <span className="label-text">
              Use session history for added context
            </span>
            <input
              type="checkbox"
              onClick={() => setHasHistory((cur) => !cur)}
              className="toggle"
              checked={hasHistory}
              disabled={isBusy}
            />
          </label>
          <button
            disabled={isBusy || messages.length === 0}
            className="btn btn-xs btn-outline btn-info mx-2"
            onClick={() => {
              navigator.clipboard.writeText(gatherHistory(messages));
            }}
          >
            Copy chat
          </button>
          <button
            disabled={isBusy || messages.length === 0}
            className="btn btn-xs btn-outline btn-error"
            onClick={() => setMessages([])}
          >
            Clear chat
          </button>
        </div>
      </div>
    </>
  );
};
