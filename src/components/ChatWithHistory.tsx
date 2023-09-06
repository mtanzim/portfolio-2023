import { useState } from "react";
import { callAPI, sampleQuestions } from "./Chat";

type Message = {
  id: number;
  timeStamp: string;
  sender: "human" | "bot";
  content: string;
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
            <img src="public/icons/robot.png" />
          </div>
        </div>
        <div className="chat-header">
          Gippity
          <time className="text-xs opacity-50 mx-2">12:45</time>
        </div>
        <div className="chat-bubble">You were the Chosen One!</div>
        <div className="chat-footer opacity-50">Delivered</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src="public/icons/female.png" />
          </div>
        </div>
        <div className="chat-header">
          Me
          <time className="text-xs opacity-50 mx-2">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div>
      <input type="text" placeholder="Send a message to gippity" className="input input-bordered w-full max-w my-4" />
    </div>
  );
};
