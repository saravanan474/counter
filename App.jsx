import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import MarkAttendance from "./pages/MarkAttendance";
import Reports from "./pages/Reports";
import useLocalStorage from "./hooks/useLocalStorage";
import { DEFAULT_THRESHOLD } from "./utils/attendance";
import { buildSampleData } from "./data/sampleData";

export default function App() {
  const [students, setStudents] = useLocalStorage("sat-students", []);
  const [records, setRecords] = useLocalStorage("sat-records", {});
  const [threshold, setThreshold] = useLocalStorage(
    "sat-threshold",
    DEFAULT_THRESHOLD
  );

  const addStudent = (student) =>
    setStudents((prev) => [...prev, { ...student, id: crypto.randomUUID() }]);

  const updateStudent = (id, changes) =>
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setRecords((prev) => {
      const next = {};
      Object.entries(prev).forEach(([date, day]) => {
        const { [id]: _removed, ...rest } = day;
        if (Object.keys(rest).length > 0) next[date] = rest;
      });
      return next;
    });
  };

  const saveAttendance = (date, marks) =>
    setRecords((prev) => ({ ...prev, [date]: marks }));

  const deleteDay = (date) =>
    setRecords((prev) => {
      const { [date]: _removed, ...rest } = prev;
      return rest;
    });

  const loadSampleData = () => {
    const sample = buildSampleData();
    setStudents(sample.students);
    setRecords(sample.records);
  };

  const clearAll = () => {
    setStudents([]);
    setRecords({});
  };

  return (
    <div className="app">
      <Navbar />
      <main className="page">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                students={students}
                records={records}
                threshold={threshold}
                loadSampleData={loadSampleData}
                clearAll={clearAll}
              />
            }
          />
          <Route
            path="/students"
            element={
              <Students
                students={students}
                records={records}
                threshold={threshold}
                addStudent={addStudent}
                updateStudent={updateStudent}
                deleteStudent={deleteStudent}
              />
            }
          />
          <Route
            path="/attendance"
            element={
              <MarkAttendance
                students={students}
                records={records}
                saveAttendance={saveAttendance}
                deleteDay={deleteDay}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <Reports
                students={students}
                records={records}
                threshold={threshold}
                setThreshold={setThreshold}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        Student Attendance Tracker - data is saved in this browser only.
      </footer>
    </div>
  );
}
