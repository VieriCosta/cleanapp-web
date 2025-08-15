export default function ChatBubble({
  mine,
  text,
  date,
}: { mine?: boolean; text: string; date: string | Date }) {
  const side = mine ? "justify-end" : "justify-start";
  const bubble = mine
    ? "bg-brand text-white dark:text-gray-900 dark:bg-white"
    : "bg-gray-100 dark:bg-gray-800";
  return (
    <div className={`flex ${side}`}>
      <div className={`rounded-2xl px-3 py-2 ${bubble} max-w-[80%]`}>
        <div className="text-sm">{text}</div>
        <div className="text-[10px] opacity-70 mt-1">{new Date(date).toLocaleString()}</div>
      </div>
    </div>
  );
}
