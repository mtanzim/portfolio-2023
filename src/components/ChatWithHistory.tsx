import { Fragment, useState } from "react";

const END_INDICATOR = "|END STREAM| Sources: ";
const SOURCE_DELIM = ",";

export async function mockApi(
  _question: string,
  cb: (chunk: string) => void,
  _history = ""
): Promise<void> {
  const lorem = "lorems ipsums ".repeat(10);
  for (const char of lorem) {
    cb(char);
    await new Promise((r) => setTimeout(r, 10));
  }
}

export async function callAPI(
  question: string,
  cb: (chunk: string) => void,
  sourcesCb: (sources: string[]) => void,
  history = ""
): Promise<void> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    question,
    chatHistory: history,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const url =
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:8787/"
      : "https://personal-portfolio-chat-worker.mtanzim.workers.dev";

  const res = await fetch(url, requestOptions);
  const reader = res.body?.getReader();
  while (reader) {
    const { done, value } = await reader?.read();
    if (done) {
      return;
    }
    const strChunk = new TextDecoder().decode(value);
    // TODO: feels hacky, investigate better ways to handle this
    if (strChunk.includes(END_INDICATOR)) {
      const beginning = strChunk.slice(0, strChunk.indexOf(END_INDICATOR));
      const sources = strChunk
        .slice(strChunk.indexOf(END_INDICATOR) + END_INDICATOR.length)
        .split(SOURCE_DELIM);
      cb(beginning);
      sourcesCb(sources);
      return;
    }
    cb(strChunk);
  }
}

export const sampleQuestions = [
  "Describe Tanzim's story towards becoming a web developer",
  "Summarize Tanzim's resume in 500 words; focus on software engineering",
  "Summarize Tanzim's contributions to Flipp, CareerFoundry and Moonfare",
  "What are some of Tanzim's hobbies? Elaborate on one of them.",
];

type Message = {
  id: number;
  timeStamp: Date;
  sender: "human" | "bot";
  content: string;
  sources?: string[];
};

const MAX_CHARS = 20_000;

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

  const addSourcesFromBot = (sources: string[]) => {
    setMessages((cur) => {
      const last = cur.at(-1);
      if (last?.sender === "bot") {
        return cur.slice(0, -1).concat([
          {
            ...last,
            sources,
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

  const addToMeta = (sources: string[]) => {
    !streaming && setStreaming(true);
    addSourcesFromBot(sources);
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

    if (gatherHistory(messages).length > MAX_CHARS) {
      setMessages([
        {
          id: 0,
          sender: "bot",
          content: "Sorry, I had to remove old messages to save space.",
          timeStamp: new Date(),
        },
        {
          content: submittedQuery,
          id: 1,
          sender: "human",
          timeStamp: new Date(),
        },
        {
          id: 2,
          sender: "bot",
          content: "",
          timeStamp: new Date(),
        },
      ]);
    } else {
      setMessages((cur) =>
        cur.concat([
          {
            content: submittedQuery,
            id: cur.length,
            sender: "human",
            timeStamp: new Date(),
          },
          {
            id: cur.length + 1,
            sender: "bot",
            content: "",
            timeStamp: new Date(),
          },
        ])
      );
    }

    try {
      const pastMessages = hasHistory ? gatherHistory(messages) : "";
      await callAPI(submittedQuery, addToRes, addToMeta, pastMessages);
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
                <div key={message.id} className="chat chat-end">
                  <div className="chat-bubble">{message.content}</div>
                </div>
              );
            }
            return (
              <Fragment key={message.id}>
                <div className="chat chat-start">
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
                {(message?.sources?.length || 0) > 0 && (
                  <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title">Sources</div>
                    <div className="collapse-content flex flex-wrap">
                      {message.sources?.map((s, idx) => (
                        <a
                          className="link link-info mr-2"
                          key={`${idx}-${s}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          href={s}
                        >
                          {s}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </>
        {isBusy && <progress className="progress w-full"></progress>}
        <div className="">
          <input
            type="text"
            placeholder="Ask gippity a question"
            className="input input-bordered w-full my-4"
            disabled={isBusy}
            value={query || ""}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit(query);
              }
            }}
          />
          <div className="dropdown ml-2">
            <label tabIndex={0} className="btn btn-secondary btn-outline my-4">
              Sample Questions
            </label>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box"
            >
              {(isBusy ? ["Currently busy..."] : sampleQuestions).map((q) => (
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
          <button
            disabled={isBusy || !query}
            className="btn btn-outline my-4 mx-2"
            onClick={() => onSubmit(query)}
          >
            Submit
          </button>
        </div>
      </div>
      <div
        tabIndex={0}
        className="collapse collapse-plus my-6 h-1/2 max-w-full shadow-xl rounded-2xl bg-base-200 p-8"
      >
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">Settings</div>
        <div className="collapse-content">
          <button
            disabled={isBusy || messages.length === 0}
            className="btn btn-xs btn-outline btn-info mr-2"
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
          <label className=" label cursor-pointer">
            <span className="label-text">
              Use session chat history to provide added context for gippity
            </span>
            <input
              type="checkbox"
              onChange={() => setHasHistory((cur) => !cur)}
              className="toggle"
              checked={hasHistory}
              disabled={isBusy}
            />
          </label>
        </div>
      </div>
    </>
  );
};
