import { useState } from "react";

export const Chat: React.FC<{}> = () => {
  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<null | string>(null);

  const onSubmit = () => {
    setLoading(true);
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
        <button onClick={onSubmit} className="ml-4 btn btn-primary">
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
              <code>
                calling the gippity, this can take a while...
              </code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
