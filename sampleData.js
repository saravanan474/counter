import { previousWeekdays } from "../utils/attendance";

const people = [
  ["21CS001", "Aarav Sharma", "CSE", "F"],
  ["21CS002", "Ananya Reddy", "CSE", "F"],
  ["21CS003", "Bhavya Nair", "CSE", "F"],
  ["21CS004", "Chaitanya Rao", "CSE", "F"],
  ["21CS005", "Divya Menon", "CSE", "F"],
  ["21CS006", "Farhan Ali", "CSE", "F"],
  ["21CS007", "Gayatri Iyer", "CSE", "F"],
  ["21CS008", "Harsh Verma", "CSE", "F"],
  ["21CS009", "Ishita Das", "CSE", "F"],
  ["21CS010", "Karthik Kumar", "CSE", "F"],
  ["21CS011", "Lakshmi Prasad", "CSE", "F"],
  ["21CS012", "Manoj Singh", "CSE", "F"],
];

// How often (out of 10) each student is absent in the sample.
const absence = [0, 1, 2, 3, 5, 1, 0, 4, 6, 2, 3, 1];

export function buildSampleData() {
  const students = people.map(([rollNo, name, department, section], i) => ({
    id: `sample-${i + 1}`,
    rollNo,
    name,
    department,
    section,
    email: `${name.split(" ")[0].toLowerCase()}@college.edu`,
  }));

  const records = {};
  previousWeekdays(12).forEach((date, j) => {
    records[date] = {};
    students.forEach((s, i) => {
      const r = (i * 31 + j * 17) % 10;
      if (r < absence[i]) records[date][s.id] = "A";
      else if (r === 9 && i % 3 === 0) records[date][s.id] = "OD";
      else records[date][s.id] = "P";
    });
  });

  return { students, records };
}

export const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];
export const SECTIONS = ["A", "B", "C", "D", "E", "F"];
