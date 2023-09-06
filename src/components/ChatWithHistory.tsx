import { useState } from "react";
import { callAPI, mockApi, sampleQuestions } from "./Chat";

type Message = {
  id: number;
  timeStamp: Date;
  sender: "human" | "bot";
  content?: string;
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

export const ChatWithHistory: React.FC = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [res, setRes] = useState<null | string>(null);
  const [err, setErr] = useState<null | string>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const onSubmit = async (submittedQuery: string | null) => {
    if (!submittedQuery) {
      return;
    }
    setErr(null);
    setRes(null);
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

    const addToRes = (chunk: string) => {
      !streaming && setStreaming(true);
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

    try {
      await callAPI(submittedQuery, addToRes, gatherHistory(messages));
      // await mockApi(submittedQuery, addToRes);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErr(err.message);
      }
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  return (
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
                <div className="chat-header">
                  Me
                  <time className="text-xs opacity-50 mx-2">
                    {message.timeStamp.toLocaleTimeString()}
                  </time>
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
              <div className="chat-header">
                Gippity
                <time className="text-xs opacity-50 mx-2">
                  {message.timeStamp.toLocaleTimeString()}
                </time>
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
          placeholder="Send a message to gippity"
          className="input input-bordered w-5/6 max-w my-4 mx-2"
          disabled={loading || streaming}
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit(query);
            }
          }}
        />
        <button
          disabled={loading || streaming}
          className="btn btn-outline w-1/6 max-w my-4"
          onClick={() => onSubmit(query)}
        >
          Submit
        </button>
      </div>
      <button
        disabled={loading || streaming || messages.length === 0}
        className="btn btn-outline btn-info mx-2"
        onClick={() => {
          navigator.clipboard.writeText(gatherHistory(messages));
        }}
      >
        Copy
      </button>
      <button
        disabled={loading || streaming || messages.length === 0}
        className="btn btn-outline btn-error"
        onClick={() => setMessages([])}
      >
        Clear History
      </button>
    </div>
  );
};
