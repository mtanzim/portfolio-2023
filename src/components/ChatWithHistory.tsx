import { useState } from "react";
import { callAPI, sampleQuestions } from "./Chat";

export const ChatWithHistory: React.FC = () => {
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
    <div className="shadow-xl rounded-2xl bg-base-200 p-8">
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Obi-Wan Kenobi
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble">You were the Chosen One!</div>
        <div className="chat-footer opacity-50">Delivered</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div>
    </div>
  );
};
