// Client-side validation. Each function returns an object of error messages
// (empty object = valid).

export function validateStudent(values, students, editingId = null) {
  const errors = {};
  const roll = values.rollNo.trim();
  const name = values.name.trim();
  const email = values.email.trim();

  if (!roll) {
    errors.rollNo = "Enter a roll number.";
  } else if (!/^[A-Za-z0-9-]{3,15}$/.test(roll)) {
    errors.rollNo = "Use 3-15 letters, numbers or hyphens.";
  } else if (
    students.some(
      (s) =>
        s.id !== editingId && s.rollNo.toLowerCase() === roll.toLowerCase()
    )
  ) {
    errors.rollNo = "This roll number already exists.";
  }

  if (!name) {
    errors.name = "Enter the student's name.";
  } else if (name.length < 3) {
    errors.name = "Name must have at least 3 characters.";
  } else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(name)) {
    errors.name = "Name can only contain letters, spaces, . ' and -";
  }

  if (!values.department) errors.department = "Choose a department.";
  if (!values.section) errors.section = "Choose a section.";

  if (!email) {
    errors.email = "Enter an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email, e.g. name@college.edu";
  }

  return errors;
}

export function validateThreshold(value) {
  const n = Number(value);
  if (value === "" || Number.isNaN(n)) return "Enter a number.";
  if (!Number.isInteger(n)) return "Use a whole number.";
  if (n < 1 || n > 100) return "Enter a value from 1 to 100.";
  return "";
}

export function validateAttendanceDate(date, today) {
  if (!date) return "Choose a date.";
  if (date > today) return "You cannot record attendance for a future date.";
  return "";
}
