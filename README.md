# Student Attendance Tracker

Task 2 - Interactive JavaScript and ReactJS Application Development
Problem 1: **Student Attendance Tracker** - record student attendance, calculate
attendance percentages, and display students with low attendance.

## Features

| Requirement | Where it is implemented |
| --- | --- |
| 3+ views / routing | Dashboard, Students, Mark attendance, Reports (React Router, `HashRouter`) |
| Add / edit / delete | Students page (form + table); delete a saved attendance day |
| Search & filter | Students (search, department filter), Mark attendance (search), Reports (search, status filter, sort) |
| Calculation | Attendance % = (Present + On duty) / days recorded x 100; class average; classes needed to reach the minimum |
| Low attendance list | Dashboard panel and Reports "Low attendance" filter; minimum % is adjustable (default 75) |
| Form handling & validation | `StudentForm` (roll no. format + uniqueness, name, email, required dropdowns), attendance date (no future dates, everyone must be marked), minimum % (1-100) |
| `useState`, `useEffect` | All pages; `useEffect` loads saved attendance when the date changes and fills the edit form |
| Persistence | `useLocalStorage` custom hook saves data in the browser |
| Extra | Download report as CSV, sample data loader, responsive layout, keyboard-accessible controls |

## Run locally

```bash
npm install
npm run dev        # open the address shown, usually http://localhost:5173
npm run build      # production build in /dist
```

Needs Node.js 18 or newer.

## Project structure

```
src/
  main.jsx                 entry point, HashRouter
  App.jsx                  state (students, records, threshold) + routes
  index.css                all styling (responsive)
  components/
    Navbar.jsx  StatCard.jsx  PercentBar.jsx  EmptyState.jsx  StudentForm.jsx
  pages/
    Dashboard.jsx  Students.jsx  MarkAttendance.jsx  Reports.jsx
  hooks/useLocalStorage.js
  utils/attendance.js      percentage + classes-needed calculations, date helpers
  utils/validation.js      form validation rules
  data/sampleData.js       sample students and attendance
```

## Data model

```js
students = [{ id, rollNo, name, department, section, email }]
records  = { "2026-10-08": { [studentId]: "P" | "A" | "OD" } }
```

## Application workflow

1. Open **Dashboard**. With no data, choose *Add students* or *Load sample data*.
2. On **Students**, add each student. The form validates every field before saving. Edit or delete from the table; search by name or roll number and filter by department.
3. On **Mark attendance**, pick a date, mark each student Present, Absent or On duty (or "Mark all present" then fix exceptions), and save. Re-opening a saved date lets you edit it.
4. The app recalculates each student's percentage from all saved days.
5. The **Dashboard** and **Reports** pages show the class average and students below the minimum. Change the minimum % in Reports, filter, sort, and download a CSV.

## Publish to GitHub (mandatory submission item)

```bash
git init
git add .
git commit -m "Student Attendance Tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/student-attendance-tracker.git
git push -u origin main
```

## Suggested 7-slide presentation

1. Title, your name, roll number, problem statement
2. Problem and objectives
3. Tech used (React, Vite, React Router, JavaScript ES6, CSS3) and project structure
4. Application workflow (the five steps above)
5. Key React concepts: components, props, `useState`, `useEffect`, custom hook, routing
6. Screenshots: Dashboard, Students, Mark attendance, Reports
7. Validation, challenges, conclusion and GitHub link
