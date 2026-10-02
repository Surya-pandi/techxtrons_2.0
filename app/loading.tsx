export default function Loading() {
  return (
    <div
      className="container loading-state"
      role="status"
      aria-label="Loading page"
    >
      <div className="loading-line" />
      <div className="loading-block" />
      <div className="loading-line" />
      <span>Loading the experience…</span>
    </div>
  );
}
