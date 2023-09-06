import { useState } from "react";

async function callAPI(
  question: string,
  cb: (chunk: string) => void
): Promise<void> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    question,
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
    cb(strChunk);
  }
}

const sampleQuestions = [
  "Describe Tanzim's story towards becoming a web developer",
  "Summarize Tanzim's resume in 500 words; focus on software engineering",
  "Summarize Tanzim's contributions to Flipp, CareerFoundry and Moonfare",
  "What are some of Tanzim's hobbies? Elaborate on one of them.",
  "Where are the travel pictures from?",
];

export const Chat: React.FC<{}> = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [res, setRes] = useState<null | string>(null);
  const [err, setErr] = useState<null | string>(null);

  const onSubmit = async (submittedQuery: string | null) => {
    if (!submittedQuery) {
      return;
    }
    setErr(null);
    setRes(null);

    setLoading(true);

    const addToRes = (chunk: string) => {
      !streaming && setStreaming(true);
      setRes((cur) => (cur || "").concat(chunk));
    };

    try {
      await callAPI(submittedQuery, addToRes);
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
    <div>
      <div className="md:flex">
        <input
          type="text"
          placeholder="Ask your question here"
          className="input input-bordered input-primary w-full max-w-lg"
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          disabled={!!loading}
          onClick={() => onSubmit(query)}
          className="mt-4 md:mt-0 md:ml-4 btn btn-primary"
        >
          Ask away
        </button>
        {!loading && (
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="ml-4 btn btn-secondary">
              Sample Questions
            </label>
            <ul
              tabIndex={0}
              className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
            >
              {sampleQuestions.map((q) => (
                <li key={q}>
                  <button
                    disabled={loading}
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
        )}
      </div>
      {query && (
        <div className="mockup-code mt-8 max-w-full">
          <pre data-prefix=">">
            <code>gippity ask {query}</code>
          </pre>
          {loading && !streaming && (
            <>
              <pre data-prefix=">" className="text-warning">
                <code>Booting gippity...</code>
              </pre>
              <progress className="progress w-96 progress-info ml-8"></progress>
            </>
          )}
          {res && (
            <>
              {streaming && (
                <>
                  <pre data-prefix=">" className="text-info">
                    {streaming ? "gippity is thinking:" : ""}
                  </pre>
                  <progress className="progress w-96 progress-info ml-8"></progress>
                </>
              )}
              <div className="m-8">
                <code>{res}</code>
                {!streaming && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${query}\n\n${res}`);
                    }}
                    className="btn btn-outline btn-xs mx-2"
                  >
                    Copy
                  </button>
                )}
                {streaming && <code className="animate-ping"> | </code>}
              </div>
            </>
          )}
          {err && (
            <pre data-prefix=">" className="bg-warning text-warning-content">
              <code>{err}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
