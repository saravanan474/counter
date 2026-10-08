import { useMemo, useState } from "react";
import StudentForm from "../components/StudentForm";
import PercentBar from "../components/PercentBar";
import EmptyState from "../components/EmptyState";
import { DEPARTMENTS } from "../data/sampleData";
import { getStudentStats } from "../utils/attendance";

export default function Students({
  students,
  records,
  threshold,
  addStudent,
  updateStudent,
  deleteStudent,
}) {
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students
      .filter((s) => dept === "All" || s.department === dept)
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q)
      )
      .sort((a, b) => a.rollNo.localeCompare(b.rollNo));
  }, [students, query, dept]);

  const handleDelete = (s) => {
    if (
      window.confirm(
        `Delete ${s.name}? Their attendance records will also be removed.`
      )
    ) {
      deleteStudent(s.id);
      if (editing && editing.id === s.id) setEditing(null);
    }
  };

  return (
    <>
      <h1>Students</h1>

      <StudentForm
        students={students}
        editing={editing}
        onAdd={addStudent}
        onUpdate={(id, changes) => {
          updateStudent(id, changes);
          setEditing(null);
        }}
        onCancel={() => setEditing(null)}
      />

      <section className="card" aria-labelledby="list-title">
        <div className="toolbar">
          <h2 id="list-title">Class list ({visible.length})</h2>
          <div className="toolbar__controls">
            <input
              type="search"
              placeholder="Search name or roll number"
              aria-label="Search students"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              aria-label="Filter by department"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            >
              <option value="All">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState title={students.length === 0 ? "No students added" : "No match"}>
            <p>
              {students.length === 0
                ? "Use the form above to add the first student."
                : "Try a different name, roll number or department."}
            </p>
          </EmptyState>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Roll no.</th>
                  <th>Name</th>
                  <th>Dept / Sec</th>
                  <th>Email</th>
                  <th>Attendance</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s) => {
                  const stats = getStudentStats(s.id, records);
                  return (
                    <tr key={s.id}>
                      <td>{s.rollNo}</td>
                      <td>{s.name}</td>
                      <td>{s.department} / {s.section}</td>
                      <td>{s.email}</td>
                      <td>
                        <PercentBar percentage={stats.percentage} threshold={threshold} />
                      </td>
                      <td className="actions">
                        <button
                          type="button"
                          className="btn btn--small"
                          onClick={() => {
                            setEditing(s);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn--small btn--danger"
                          onClick={() => handleDelete(s)}
                        >
                          Delete
                        </button>
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
