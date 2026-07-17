import { Link } from "react-router-dom";

export function PracticePage() {
  return (
    <div className="home-hero">
      <h1>Pick a practice track</h1>
      <p className="home-subtitle">
        Learn by solving real problems, not by watching tutorials.
      </p>
      <div className="track-picker">
        <Link to="/netcode" className="track-card">
          <h2>NetCode</h2>
          <p>
            LeetCode-style troubleshooting practice. Diagnose trouble tickets using topology,
            logs, CLI output, and monitoring data — DNS, DHCP, Routing, and Switching.
          </p>
        </Link>
        <Link to="/codeops" className="track-card">
          <h2>CodeOps</h2>
          <p>
            Learn network automation by solving practical problems in Python, REST APIs, Git,
            Netmiko, and Ansible — the tools network engineers actually use day to day.
          </p>
        </Link>
      </div>
    </div>
  );
}
