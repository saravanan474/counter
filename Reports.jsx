import { useMemo, useState } from "react";
import PercentBar from "../components/PercentBar";
import EmptyState from "../components/EmptyState";
import { classesNeeded, getStudentStats, isLow } from "../utils/attendance";
import { validateThreshold } from "../utils/validation";

export default function Reports({ students, records, threshold, setThreshold }) {
  const [thresholdInput, setThresholdInput] = useState(String(threshold));
  const [thresholdError, setThresholdError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("lowest");

  const applyThreshold = (e) => {
    e.preventDefault();
    const err = validateThreshold(thresholdInput);
    setThresholdError(err);
    if (!err) setThreshold(Number(thresholdInput));
  };

  const rows = useMemo(
    () =>
      students.map((s) => {
        const stats = getStudentStats(s.id, records);
        return {
          student: s,
          ...stats,
          needed: classesNeeded(stats.attended, stats.total, threshold),
        };
      }),
    [students, records, threshold]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter(
        (r) =>
          !q ||
          r.student.name.toLowerCase().includes(q) ||
          r.student.rollNo.toLowerCase().includes(q)
      )
      .filter((r) => {
        if (filter === "low") return isLow(r.percentage, threshold);
        if (filter === "safe") return r.percentage !== null && !isLow(r.percentage, threshold);
        if (filter === "nodata") return r.percentage === null;
        return true;
      })
      .sort((a, b) => {
        if (sort === "name") return a.student.name.localeCompare(b.student.name);
        if (sort === "roll") return a.student.rollNo.localeCompare(b.student.rollNo);
        const pa = a.percentage ?? 101;
        const pb = b.percentage ?? 101;
        return sort === "highest" ? pb - pa : pa - pb;
      });
  }, [rows, query, filter, sort, threshold]);

  const lowCount = rows.filter((r) => isLow(r.percentage, threshold)).length;

  const exportCsv = () => {
    const header = ["Roll no", "Name", "Department", "Section", "Present", "On duty", "Absent", "Total days", "Percentage", "Status"];
    const lines = visible.map((r) => [
      r.student.rollNo,
      `"${r.student.name}"`,
      r.student.department,
      r.student.section,
      r.present,
      r.onDuty,
      r.absent,
      r.total,
      r.percentage === null ? "" : r.percentage,
      r.percentage === null ? "No data" : isLow(r.percentage, threshold) ? "Low" : "OK",
    ]);
    const csv = [header, ...lines].map((l) => l.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (students.length === 0) {
    return (
      <>
        <h1>Reports</h1>
        <EmptyState title="Nothing to report yet">
          <p>Add students and record attendance to see percentages here.</p>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <h1>Reports</h1>

      <section className="card toolbar">
        <form className="field field--inline" onSubmit={applyThreshold} noValidate>
          <label htmlFor="threshold">Minimum attendance (%)</label>
          <input
            id="threshold"
            inputMode="numeric"
            className="input-short"
            value={thresholdInput}
            onChange={(e) => setThresholdInput(e.target.value)}
            aria-invalid={Boolean(thresholdError)}
            aria-describedby={thresholdError ? "threshold-error" : undefined}
          />
          <button type="submit" className="btn">Apply</button>
        </form>
        {thresholdError && <p className="error" id="threshold-error">{thresholdError}</p>}
        <p className="muted">
          {lowCount} student{lowCount === 1 ? "" : "s"} below {threshold}%
        </p>
      </section>

      <section className="card">
        <div className="toolbar">
          <div className="toolbar__controls">
            <input
              type="search"
              placeholder="Search name or roll number"
              aria-label="Search students"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All students</option>
              <option value="low">Low attendance</option>
              <option value="safe">At or above minimum</option>
              <option value="nodata">No data yet</option>
            </select>
            <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="lowest">Lowest attendance first</option>
              <option value="highest">Highest attendance first</option>
              <option value="name">Name</option>
              <option value="roll">Roll number</option>
            </select>
          </div>
          <button type="button" className="btn" onClick={exportCsv} disabled={visible.length === 0}>
            Download CSV
          </button>
        </div>

        {visible.length === 0 ? (
          <EmptyState title="No students match these filters" />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Roll no.</th>
                  <th>Name</th>
                  <th>Present</th>
                  <th>On duty</th>
                  <th>Absent</th>
                  <th>Days</th>
                  <th>Attendance</th>
                  <th>To reach {threshold}%</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const low = isLow(r.percentage, threshold);
                  return (
                    <tr key={r.student.id} className={low ? "row--low" : ""}>
                      <td>{r.student.rollNo}</td>
                      <td>{r.student.name}</td>
                      <td>{r.present}</td>
                      <td>{r.onDuty}</td>
                      <td>{r.absent}</td>
                      <td>{r.total}</td>
                      <td><PercentBar percentage={r.percentage} threshold={threshold} /></td>
                      <td>
                        {r.percentage === null
                          ? "-"
                          : r.needed === 0
                          ? "On track"
                          : r.needed === null
                          ? "Not possible"
                          : `Attend next ${r.needed} class${r.needed > 1 ? "es" : ""}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
