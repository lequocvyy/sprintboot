type BadgeTone = "warning" | "success" | "danger" | "neutral";

function getToneClasses(tone: BadgeTone) {
  switch (tone) {
    case "warning":
      return "bg-yellow-100 text-yellow-700";
    case "success":
      return "bg-green-100 text-green-700";
    case "danger":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-1 text-xs font-medium ${getToneClasses(
        tone
      )}`}
    >
      {label}
    </span>
  );
}