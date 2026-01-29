import { useState } from "react";

import { FiBell, FiMoon, FiShield, FiSave } from "react-icons/fi";

export default function Settings() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("appSettings");
        return saved ? JSON.parse(saved) : {
            notifications: true,
            emailAlerts: false,
            darkMode: false,
            twoFactor: true,
            desktopNotifications: true,
        };
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev: any) => {
            const newSettings = { ...prev, [key]: !prev[key] };
            localStorage.setItem("appSettings", JSON.stringify(newSettings));

            // Apply side effects immediately
            if (key === "darkMode") {
                if (newSettings.darkMode) {
                    document.body.classList.add("dark-mode");
                } else {
                    document.body.classList.remove("dark-mode");
                }
            }

            return newSettings;
        });
    };

    // Apply dark mode on initial load
    useState(() => {
        if (settings.darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    });

    const handleSave = () => {
        localStorage.setItem("appSettings", JSON.stringify(settings));
        alert("Settings saved successfully!");
    };

    return (
        <>
            <section className="panel">


                <div style={{ padding: "24px", maxWidth: "800px" }}>

                    {/* Notifications Section */}
                    <div style={{ marginBottom: "32px" }}>
                        <h4 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "#1e293b" }}>
                            <FiBell /> Notifications
                        </h4>
                        <div className="settings-card" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>

                            <div className="setting-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <div>
                                    <div style={{ fontWeight: "500", color: "#334155" }}>Push Notifications</div>
                                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Receive alerts on your device</div>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications}
                                        onChange={() => handleToggle("notifications")}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="setting-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: "500", color: "#334155" }}>Email Alerts</div>
                                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Receive daily summaries via email</div>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailAlerts}
                                        onChange={() => handleToggle("emailAlerts")}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* Appearance Section */}
                    <div style={{ marginBottom: "32px" }}>
                        <h4 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "#1e293b" }}>
                            <FiMoon /> Appearance
                        </h4>
                        <div className="settings-card" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>

                            <div className="setting-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: "500", color: "#334155" }}>Dark Mode</div>
                                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Switch to a darker theme for low-light environments</div>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.darkMode}
                                        onChange={() => handleToggle("darkMode")}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* Security Section */}
                    <div style={{ marginBottom: "32px" }}>
                        <h4 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: "#1e293b" }}>
                            <FiShield /> Security
                        </h4>
                        <div className="settings-card" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>

                            <div className="setting-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: "500", color: "#334155" }}>Two-Factor Authentication</div>
                                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Add an extra layer of security</div>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.twoFactor}
                                        onChange={() => handleToggle("twoFactor")}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                        </div>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={handleSave}
                        style={{ marginTop: "20px" }}
                    >
                        <FiSave /> Save Preferences
                    </button>

                </div>

                {/* Simple CSS for the switch toggle embedded in component for portability */}
                <style>{`
          .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
          }
          
          .switch input { 
            opacity: 0;
            width: 0;
            height: 0;
          }
          
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #cbd5e1;
            -webkit-transition: .4s;
            transition: .4s;
          }
          
          .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
          }
          
          input:checked + .slider {
            background-color: #1B5E20; /* Matches brand color */
          }
          
          input:focus + .slider {
            box-shadow: 0 0 1px #1B5E20;
          }
          
          input:checked + .slider:before {
            -webkit-transform: translateX(20px);
            -ms-transform: translateX(20px);
            transform: translateX(20px);
          }
          
          .slider.round {
            border-radius: 24px;
          }
          
          .slider.round:before {
            border-radius: 50%;
          }
        `}</style>
            </section>
        </>
    );
}
