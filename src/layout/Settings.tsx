import { useState } from "react";
import { FiBell, FiMoon, FiShield, FiSave } from "react-icons/fi";

type SettingsState = {
  notifications: boolean;
  emailAlerts: boolean;
  darkMode: boolean;
  twoFactor: boolean;
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem("appSettings");
    return saved
      ? JSON.parse(saved)
      : {
          notifications: true,
          emailAlerts: false,
          darkMode: false,
          twoFactor: true,
        };
  });

  const toggle = (key: keyof SettingsState) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("appSettings", JSON.stringify(next));
      return next;
    });
  };

  return (
    <section className="panel" style={{ maxWidth: "800px" }}>
      {/* Notifications */}
      <h3>
        <FiBell /> Notifications
      </h3>
      <label>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={() => toggle("notifications")}
        />
        Enable notifications
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.emailAlerts}
          onChange={() => toggle("emailAlerts")}
        />
        Email alerts
      </label>

      {/* Appearance */}
      <h3>
        <FiMoon /> Appearance
      </h3>
      <label>
        <input
          type="checkbox"
          checked={settings.darkMode}
          onChange={() => toggle("darkMode")}
        />
        Dark mode
      </label>

      {/* Security */}
      <h3>
        <FiShield /> Security
      </h3>
      <label>
        <input
          type="checkbox"
          checked={settings.twoFactor}
          onChange={() => toggle("twoFactor")}
        />
        Two-factor authentication
      </label>

      <button className="primary-btn" style={{ marginTop: 24 }}>
        <FiSave /> Save Settings
      </button>
    </section>
  );
}
