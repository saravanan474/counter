import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import {
  STATUS,
  STATUS_LABEL,
  formatDate,
  todayISO,
} from "../utils/attendance";
import { validateAttendanceDate } from "../utils/validation";

const OPTIONS = [STATUS.PRESENT, STATUS.ABSENT, STATUS.ON_DUTY];

export default function MarkAttendance({ students, records, saveAttendance, deleteDay }) {
  const today = todayISO();
  const [date, setDate] = useState(today);
  const [marks, setMarks] = useState({});
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load any saved attendance whenever the date changes.
  useEffect(() => {
    setMarks(records[date] ? { ...records[date] } : {});
    setError("");
  }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = useMemo(
    () => [...students].sort((a, b) => a.rollNo.localeCompare(b.rollNo)),
    [students]
  );

  const visible = sorted.filter((s) => {
    const q = query.trim().toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q);
  });

  const counts = useMemo(() => {
    const c = { P: 0, A: 0, OD: 0 };
    sorted.forEach((s) => {
      if (marks[s.id]) c[marks[s.id]] += 1;
    });
    return { ...c, unmarked: sorted.length - c.P - c.A - c.OD };
  }, [marks, sorted]);

  const setMark = (id, status) => {
    setMarks((prev) => ({ ...prev, [id]: status }));
    setError("");
    setMessage("");
  };

  const markAll = (status) => {
    const next = {};
    sorted.forEach((s) => (next[s.id] = status));
    setMarks(next);
    setError("");
    setMessage("");
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setMessage("");
  };

  const handleSave = () => {
    const dateError = validateAttendanceDate(date, today);
    if (dateError) return setError(dateError);
    if (counts.unmarked > 0) {
      return setError(
        `${counts.unmarked} student${counts.unmarked > 1 ? "s are" : " is"} not marked yet. Mark everyone or use "Mark all present".`
      );
    }
    saveAttendance(date, marks);
    setError("");
    setMessage(`Attendance saved for ${formatDate(date)}.`);
  };

  const handleDeleteDay = (d) => {
    if (window.confirm(`Delete attendance recorded for ${formatDate(d)}?`)) {
      deleteDay(d);
      if (d === date) setMarks({});
      setMessage("");
    }
  };

  if (students.length === 0) {
    return (
      <>
        <h1>Mark attendance</h1>
        <EmptyState title="Add students first">
          <p>You need at least one student before you can mark attendance.</p>
          <Link to="/students" className="btn btn--primary">Go to Students</Link>
        </EmptyState>
      </>
    );
  }

  const savedDates = Object.keys(records).sort().reverse();
  const alreadySaved = Boolean(records[date]);

  return (
    <>
      <h1>Mark attendance</h1>

      <section className="card toolbar">
        <div className="field field--inline">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} max={today} onChange={handleDateChange} />
        </div>
        <div className="toolbar__controls">
          <input
            type="search"
            placeholder="Search name or roll number"
            aria-label="Search students"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="btn" onClick={() => markAll(STATUS.PRESENT)}>
            Mark all present
          </button>
        </div>
      </section>

      <p className="status-line" aria-live="polite">
        {alreadySaved ? "Editing saved attendance. " : ""}
        Present {counts.P} | Absent {counts.A} | On duty {counts.OD} | Not marked {counts.unmarked}
      </p>

      <section className="register" aria-label="Attendance register">
        {visible.length === 0 ? (
          <p className="muted register__empty">No student matches your search.</p>
        ) : (
          visible.map((s) => (
            <div className="register__row" key={s.id}>
              <div className="register__who">
                <span className="register__roll">{s.rollNo}</span>
                <span>{s.name}</span>
              </div>
              <div className="segmented" role="group" aria-label={`Status for ${s.name}`}>
                {OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`segmented__btn segmented__btn--${opt} ${
                      marks[s.id] === opt ? "is-selected" : ""
                    }`}
                    aria-pressed={marks[s.id] === opt}
                    onClick={() => setMark(s.id, opt)}
                  >
                    {STATUS_LABEL[opt]}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {error && <p className="error error--block" role="alert">{error}</p>}
      {message && <p className="success" role="status">{message}</p>}

      <div className="row">
        <button type="button" className="btn btn--primary" onClick={handleSave}>
          Save attendance
        </button>
      </div>

      <section className="card" aria-labelledby="saved-title">
        <h2 id="saved-title">Saved days</h2>
        {savedDates.length === 0 ? (
          <p className="muted">Nothing saved yet.</p>
        ) : (
          <ul className="plain-list">
            {savedDates.map((d) => (
              <li key={d} className="list-row">
                <span>{formatDate(d)}</span>
                <span className="actions">
                  <button type="button" className="btn btn--small" onClick={() => setDate(d)}>
                    Open
                  </button>
                  <button
                    type="button"
                    className="btn btn--small btn--danger"
                    onClick={() => handleDeleteDay(d)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
