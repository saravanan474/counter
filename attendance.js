// Status codes stored in records: { "2026-10-08": { studentId: "P" | "A" | "OD" } }
export const STATUS = {
  PRESENT: "P",
  ABSENT: "A",
  ON_DUTY: "OD",
};

export const STATUS_LABEL = {
  P: "Present",
  A: "Absent",
  OD: "On duty",
};

export const DEFAULT_THRESHOLD = 75;

// Today's date as YYYY-MM-DD in the local time zone.
export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Counts and percentage for one student. On-duty counts as attended.
export function getStudentStats(studentId, records) {
  let present = 0;
  let absent = 0;
  let onDuty = 0;

  Object.values(records).forEach((day) => {
    const status = day[studentId];
    if (status === STATUS.PRESENT) present += 1;
    else if (status === STATUS.ABSENT) absent += 1;
    else if (status === STATUS.ON_DUTY) onDuty += 1;
  });

  const total = present + absent + onDuty;
  const attended = present + onDuty;
  const percentage =
    total === 0 ? null : Math.round((attended / total) * 1000) / 10;

  return { present, absent, onDuty, total, attended, percentage };
}

// How many classes in a row the student must attend to reach the threshold.
export function classesNeeded(attended, total, threshold) {
  if (total === 0) return 0;
  if ((attended / total) * 100 >= threshold) return 0;
  if (threshold >= 100) return null; // can never be reached again
  return Math.ceil((threshold * total - 100 * attended) / (100 - threshold));
}

export function isLow(percentage, threshold) {
  return percentage !== null && percentage < threshold;
}

// Returns the last `count` weekdays before today (used for sample data).
export function previousWeekdays(count) {
  const days = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() - 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push(
        new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10)
      );
    }
  }
  return days.reverse();
}
