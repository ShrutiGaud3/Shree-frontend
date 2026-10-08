import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "../api/client.js";
import { STORE_NAME } from "../config/site.js";
import { Loader, Button, Breadcrumb } from "../components/ui.jsx";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShoppingBag,
  Gift,
  Gem,
  ArrowRight,
} from "lucide-react";

const SUGGESTIONS = [
  "Gift for a 5 year old under ₹1000?",
  "Silver earrings for daily festive wear?",
  "Best educational board games for family night?",
  "What is your return & replacement policy?",
];

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `Namaste! 🙏 I'm your ${STORE_NAME} Assistant. Whether you're hunting for the perfect toy gift or sparkling handcrafted jewellery, I'm here to help!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, busy]);

  const ask = async (q) => {
    const question = (q ?? input).trim();
    if (!question || busy) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text: question }]);
    setBusy(true);
    try {
      const { data } = await api.post("/chat", { question });
      setMessages((m) => [...m, { from: "bot", text: data.message }]);
    } catch (e) {
      const status = e.response?.status;
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text:
            status === 401
              ? "Please sign in to your account to chat with me! You can continue exploring our catalog in the meantime. 🧸"
              : apiError(e),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Shree AI Assistant" }]}
      />

      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-surface-card border-2 border-accent/30 shadow-md flex flex-col h-[520px] sm:h-[650px] max-h-[75vh] sm:max-h-[80vh]">
        {/* Chat Header */}
        <div className="flex items-center justify-between bg-surface p-3.5 sm:p-4 sm:px-6 border-b border-accent/20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-primary text-text shadow-xs border border-accent/30">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-text" />
              <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-accent animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm sm:text-lg text-text">
                {STORE_NAME} AI Guide
              </h1>
              <p className="text-[10px] sm:text-[11px] text-text-muted flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-600 inline-block animate-pulse" />
                Online & Ready
              </p>
            </div>
          </div>

          <Link to="/products">
            <Button variant="outline" size="sm" icon={ShoppingBag}>
              Catalog
            </Button>
          </Link>
        </div>

        {/* Suggestion Chips */}
        <div className="bg-sand-tint/50 px-4 py-2.5 border-b border-accent/15 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-bold text-text-muted">Suggestions:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                className="rounded-full bg-surface-card px-3 py-1 text-xs font-semibold text-text shadow-xs border border-accent/30 hover:bg-primary transition cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-bg/40">
          {messages.map((m, i) => {
            const isBot = m.from === "bot";
            return (
              <div
                key={i}
                className={`flex items-start gap-2.5 ${
                  isBot ? "justify-start" : "justify-end"
                }`}
              >
                {isBot && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-text border border-accent/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                    isBot
                      ? "bg-surface-card text-text border border-accent/30 rounded-tl-sm"
                      : "bg-primary text-text border border-accent/30 rounded-tr-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {!isBot && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-surface text-text border border-accent/30">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {busy && (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-text">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-surface-card px-4 py-3 border border-accent/30 shadow-xs flex items-center gap-2 text-xs font-semibold text-text-muted">
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">Shree Assistant is thinking…</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask();
          }}
          className="p-3 sm:p-4 bg-surface border-t border-accent/20 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for toy gift ideas, silver jewellery advice, or order queries…"
            className="flex-1 rounded-2xl border-2 border-accent/40 bg-surface-card px-4 py-2.5 text-xs sm:text-sm text-text placeholder:text-text-muted/70 outline-none focus:border-accent"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={busy || !input.trim()}
            icon={Send}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
