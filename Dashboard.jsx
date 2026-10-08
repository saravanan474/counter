import { useMemo } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import PercentBar from "../components/PercentBar";
import EmptyState from "../components/EmptyState";
import { formatDate, getStudentStats, isLow, todayISO } from "../utils/attendance";

export default function Dashboard({ students, records, threshold, loadSampleData, clearAll }) {
  const today = todayISO();

  const rows = useMemo(
    () =>
      students.map((s) => ({ student: s, ...getStudentStats(s.id, records) })),
    [students, records]
  );

  const withData = rows.filter((r) => r.percentage !== null);
  const average =
    withData.length === 0
      ? null
      : Math.round(
          (withData.reduce((sum, r) => sum + r.percentage, 0) / withData.length) * 10
        ) / 10;
  const lowRows = withData
    .filter((r) => isLow(r.percentage, threshold))
    .sort((a, b) => a.percentage - b.percentage);

  const sessions = Object.keys(records).sort().reverse();
  const todayDone = Boolean(records[today]);

  if (students.length === 0) {
    return (
      <>
        <h1>Dashboard</h1>
        <EmptyState title="No students yet">
          <p>Add students one by one, or load 12 sample students with 12 days of attendance to explore the app.</p>
          <div className="row">
            <Link to="/students" className="btn btn--primary">Add students</Link>
            <button type="button" className="btn" onClick={loadSampleData}>
              Load sample data
            </button>
          </div>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <h1>Dashboard</h1>
        <Link to="/attendance" className="btn btn--primary">
          {todayDone ? "Edit today's attendance" : "Mark today's attendance"}
        </Link>
      </div>

      <section className="stats" aria-label="Summary">
        <StatCard label="Students" value={students.length} />
        <StatCard label="Days recorded" value={sessions.length} />
        <StatCard
          label="Class average"
          value={average === null ? "-" : `${average}%`}
          tone={average !== null && average < threshold ? "low" : "good"}
        />
        <StatCard
          label="Below minimum"
          value={lowRows.length}
          hint={`Under ${threshold}%`}
          tone={lowRows.length > 0 ? "low" : "good"}
        />
      </section>

      <div className="two-col">
        <section className="card" aria-labelledby="low-title">
          <h2 id="low-title">Low attendance</h2>
          {lowRows.length === 0 ? (
            <p className="muted">
              {withData.length === 0
                ? "Record attendance to see who needs attention."
                : `Everyone is at or above ${threshold}%.`}
            </p>
          ) : (
            <ul className="plain-list">
              {lowRows.slice(0, 6).map((r) => (
                <li key={r.student.id} className="list-row">
                  <div>
                    <strong>{r.student.name}</strong>
                    <span className="muted"> {r.student.rollNo}</span>
                  </div>
                  <PercentBar percentage={r.percentage} threshold={threshold} />
                </li>
              ))}
            </ul>
          )}
          {lowRows.length > 6 && (
            <Link to="/reports" className="link">
              See all {lowRows.length} in Reports
            </Link>
          )}
        </section>

        <section className="card" aria-labelledby="recent-title">
          <h2 id="recent-title">Recent days</h2>
          {sessions.length === 0 ? (
            <p className="muted">No attendance recorded yet.</p>
          ) : (
            <ul className="plain-list">
              {sessions.slice(0, 6).map((date) => {
                const day = records[date];
                const values = Object.values(day);
                const attended = values.filter((v) => v === "P" || v === "OD").length;
                return (
                  <li key={date} className="list-row">
                    <span>{formatDate(date)}</span>
                    <span className="muted">
                      {attended} of {values.length} attended
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="row row--end">
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => {
            if (window.confirm("Delete all students and attendance records?")) clearAll();
          }}
        >
          Clear all data
        </button>
      </div>
    </>
  );
}
