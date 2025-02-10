import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const END_INDICATOR = "|END STREAM| Sources: ";
const SOURCE_DELIM = ",";

export async function mockApi(
  _question: string,
  cb: (chunk: string) => void,
  _history = "",
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
  history = "",
  conversationId?: string,
): Promise<void> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    question,
    chatHistory: history,
    conversationId,
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

  return fetch(url, requestOptions)
    .then((res) => res.body)
    .then(async (body) => {
      const reader = body?.getReader();
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
    });
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

const CHAT_STORAGE_KEY = "ai-chat";
const CHAT_CONVO_ID_KEY = "ai-convo-key";

export const ChatWithHistory: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // NOTE: randomUUID unavailable in http
  const setNewConvoId = () => {
    const newConvoId = window?.crypto?.randomUUID();
    window?.localStorage?.setItem(CHAT_CONVO_ID_KEY, newConvoId);
    setConversationId(newConvoId);
  };

  useEffect(() => {
    const saved = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      const savedMessages = JSON.parse(saved);
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const prevConvoId = window?.localStorage?.getItem(CHAT_CONVO_ID_KEY);
    if (prevConvoId) {
      setConversationId(prevConvoId);
      return;
    }
    setNewConvoId();
  }, []);

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
        ]),
      );
    }

    try {
      const pastMessages = "";
      await callAPI(
        submittedQuery,
        addToRes,
        addToMeta,
        pastMessages,
        conversationId,
      );
    } catch (err: unknown) {
      console.error(err);
      addMessageFromBot(`Something went wrong, please try again later.`);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  return (
    <div
      className="p-8 h-[80vh] md:w-[50vw] overflow-y-auto"
      // TODO: might not work for all browsers
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="mb-6">
        <p className="text-xl">Chat with an AI</p>

        <a
          className="badge md:badge-sm badge-accent"
          href="https://cohere.com/"
          target="_blank"
        >
          Powered by Cohere
        </a>
        <p className="text-sm mt-2">
          Ask an AI questions related to this website.
        </p>
        <p className="text-sm mt-2 text-warning">
          Disclaimer: AI may produce incorrect information. Please double check
          original resources.
        </p>
      </div>
      <div>
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
        <div ref={messagesEndRef}></div>
      </div>
      {isBusy && <progress className="progress w-full"></progress>}
      <div className="mb-12">
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
        <div className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title text-md font-medium">
            Sample questions
          </div>
          <div className="collapse-content">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                className="btn btn-secondary btn-xs btn-outline m-2 cursor-pointer text-xs text-ellipsis overflow-clip ..."
                disabled={isBusy}
                onClick={() => {
                  setQuery(q);
                  onSubmit(q);
                }}
              >
                <div className="line-clamp-1">{q}</div>
              </button>
            ))}
          </div>
        </div>
        <button
          disabled={isBusy || !query}
          className="btn btn-outline btn-primary my-4 mx-2 btn-sm"
          onClick={() => onSubmit(query)}
        >
          Submit
        </button>
        <button
          disabled={isBusy || messages.length === 0}
          className="btn btn-outline btn-info mr-2 btn-sm"
          onClick={() => {
            navigator.clipboard.writeText(gatherHistory(messages));
          }}
        >
          Copy
        </button>
        <button
          disabled={isBusy || messages.length === 0}
          className="btn btn-outline btn-error btn-sm"
          onClick={() => {
            setMessages([]);
            setNewConvoId();
          }}
        >
          Clear
        </button>
      </div>

      <div className="m-2 absolute bottom-8 right-8">{children}</div>
    </div>
  );
};
