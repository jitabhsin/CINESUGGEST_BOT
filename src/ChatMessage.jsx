export default function ChatMessage({ sender, text }) {
  return (
      <div className={sender === "user" ? "user-message" : "bot-message"}>
          {text}
      </div>
  );
}