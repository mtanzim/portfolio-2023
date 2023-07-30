import { useState } from "react";

async function callAPI(question: string): Promise<unknown> {
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

  return fetch(
    "https://personal-portfolio-chat-worker.mtanzim.workers.dev",
    requestOptions
  ).then((response) => response.json());
}

export const Chat: React.FC<{}> = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<null | string>(null);
  const [err, setErr] = useState<null | string>(null);

  const onSubmit = async () => {
    setErr(null);
    setRes(null);
    if (!query) {
      return;
    }
    setLoading(true);

    try {
      const apiRes = (await callAPI(query)) as string;
      setRes(apiRes);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErr(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <input
          type="text"
          placeholder="Ask your question here"
          className="input input-bordered input-primary w-full max-w-lg"
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          disabled={!!loading}
          onClick={onSubmit}
          className="ml-4 btn btn-primary"
        >
          Ask away
        </button>
      </div>
      {query && (
        <div className="mockup-code mt-8">
          <pre data-prefix=">">
            <code>gippity ask {query}</code>
          </pre>
          {loading && (
            <pre data-prefix=">" className="text-warning">
              <code>calling the gippity, this can take a while...</code>
            </pre>
          )}
          {res && (
            <>
              <pre data-prefix=">" className="text-info">
                gippity gave the following answer:
              </pre>
              <div className="m-8">
                <code>{res}</code>
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
