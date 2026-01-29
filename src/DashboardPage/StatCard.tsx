import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  change?: string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, change, icon }: Props) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="eyebrow">{title}</p>
        <div className="stat-value">
          <h3>{value}</h3>
          {change ? <span className="pill success">{change}</span> : null}
        </div>
      </div>
    </div>
  );
}
