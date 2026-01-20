import { Link } from "react-router-dom";
import { useState } from "react";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const allowedDomains = ["@gmail.com", "@yahoo.com"];

  const handleReset = () => {
    const isValidDomain = allowedDomains.some((domain) =>
      email.endsWith(domain)
    );

    if (!isValidDomain) {
      setError("Please enter an email address with a valid domain");
      return;
    }

    setError("");
    alert("Reset link will be sent to your email"); // <-- NO NAVIGATION
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-box">
        <div className="fp-icon">⚡</div>

        <h2 className="fp-title">Forgot Password?</h2>

        <label>Email Address</label>
        <div className="fp-input-group">
          <span className="fp-mail-icon">✉</span>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="button" className="fp-btn" onClick={handleReset}>
          Reset Password
        </button>

        <Link to="/" className="fp-back">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
