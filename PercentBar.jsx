import { isLow } from "../utils/attendance";

// Progress bar + number. A tick shows where the minimum requirement sits.
export default function PercentBar({ percentage, threshold }) {
  if (percentage === null) {
    return <span className="muted">No data</span>;
  }
  const low = isLow(percentage, threshold);
  return (
    <div className="percent">
      <div
        className="percent__track"
        role="img"
        aria-label={`${percentage}% attendance, minimum ${threshold}%`}
      >
        <div
          className={`percent__fill ${low ? "percent__fill--low" : ""}`}
          style={{ width: `${percentage}%` }}
        />
        <span className="percent__tick" style={{ left: `${threshold}%` }} />
      </div>
      <span className={`percent__num ${low ? "text-low" : ""}`}>
        {percentage}%
      </span>
    </div>
  );
}
