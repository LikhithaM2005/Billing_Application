import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const passwordRules = {
    firstCapital: /^[A-Z]/.test(newPassword),
    minLength: newPassword.length >= 8,
    hasNumber: /\d/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid =
    passwordRules.firstCapital &&
    passwordRules.minLength &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecial;

  const handleReset = () => {
    let hasError = false;

    if (!isPasswordValid) {
      setPasswordError(
        "Please ensure the password meets all the above requirements before continuing."
      );
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    alert("Password reset successful");
    navigate("/"); // Redirect to Login
  };

  return (
    <div className="rp-wrapper">
      <div className="rp-box">
        <h2 className="rp-title">Reset Password</h2>

        
        <label>New Password <span className="required">*</span></label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPasswordError("");
            setShowPasswordRules(e.target.value.length > 0); // SHOW RULES ONLY WHEN TYPING
          }}
        />

        {showPasswordRules && (
          <div className="password-rules">
            <p className={passwordRules.firstCapital ? "valid" : "invalid"}>
              {passwordRules.firstCapital ? "✓" : "✗"} First letter should be capital
            </p>

            <p className={passwordRules.minLength ? "valid" : "invalid"}>
              {passwordRules.minLength ? "✓" : "✗"} Minimum 8 characters
            </p>

            <p className={passwordRules.hasNumber ? "valid" : "invalid"}>
              {passwordRules.hasNumber ? "✓" : "✗"} At least one number
            </p>

            <p className={passwordRules.hasSpecial ? "valid" : "invalid"}>
              {passwordRules.hasSpecial ? "✓" : "✗"} At least one special character
            </p>
          </div>
        )}

        
        <label>Confirm Password <span className="required">*</span></label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordError("");
          }}
        />

        {confirmPassword.length > 0 && (
          <div className="password-rules">
            {newPassword === confirmPassword ? (
              <p className="valid">✓ Passwords match</p>
            ) : (
              <p className="invalid">✗ Passwords do not match</p>
            )}
          </div>
        )}

        {passwordError && (
          <p className="password-warning">{passwordError}</p>
        )}

        <button className="rp-btn" onClick={handleReset}>
          Reset Password
        </button>

        <Link to="/" className="rp-back">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
