import "./StatusLabel.css";

type Status = "available" | "locked" | "completed" | "pending" | "active";

const DOT: Record<Status, string> = {
  available: "●",
  active: "●",
  locked: "■",
  completed: "✓",
  pending: "…",
};

export default function StatusLabel({ status, label }: { status: Status; label?: string }) {
  return (
    <span className={`status-label status-label--${status}`}>
      <span className="status-label__dot">{DOT[status]}</span>
      {label ?? status.toUpperCase()}
    </span>
  );
}
