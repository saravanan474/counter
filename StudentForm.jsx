import { useEffect, useState } from "react";
import { DEPARTMENTS, SECTIONS } from "../data/sampleData";
import { validateStudent } from "../utils/validation";

const emptyForm = {
  rollNo: "",
  name: "",
  department: "",
  section: "",
  email: "",
};

export default function StudentForm({ students, editing, onAdd, onUpdate, onCancel }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Fill the form when a student is chosen for editing.
  useEffect(() => {
    if (editing) {
      const { id, ...rest } = editing;
      setValues(rest);
    } else {
      setValues(emptyForm);
    }
    setErrors({});
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateStudent(values, students, editing ? editing.id : null);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const clean = {
      ...values,
      rollNo: values.rollNo.trim().toUpperCase(),
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
    };

    if (editing) onUpdate(editing.id, clean);
    else onAdd(clean);

    setValues(emptyForm);
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={values[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p className="error" id={`${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const select = (name, label, options) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={values[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="error" id={`${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <h2 className="form-grid__title">
        {editing ? `Edit ${editing.name}` : "Add a student"}
      </h2>
      {field("rollNo", "Roll number", { placeholder: "21CS013" })}
      {field("name", "Full name", { placeholder: "Student name" })}
      {select("department", "Department", DEPARTMENTS)}
      {select("section", "Section", SECTIONS)}
      {field("email", "Email", { type: "email", placeholder: "name@college.edu" })}
      <div className="form-grid__actions">
        <button type="submit" className="btn btn--primary">
          {editing ? "Save changes" : "Add student"}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
