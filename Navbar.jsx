import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/students", label: "Students" },
  { to: "/attendance", label: "Mark attendance" },
  { to: "/reports", label: "Reports" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <span className="brand">Attendance Register</span>
        <nav aria-label="Main">
          <ul className="navlinks">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    isActive ? "navlink navlink--active" : "navlink"
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
