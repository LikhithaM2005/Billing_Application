import { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";


const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    salutation: "Mr",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (name === "password") {
      setShowPasswordRules(value.length > 0);
    }
  };

  const passwordRules = {
    firstCapital: /^[A-Z]/.test(form.password),
    minLength: form.password.length >= 8,
    hasNumber: /\d/.test(form.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
  };

  const isValidEmailDomain = (email: string) => {
    return (
      email.endsWith("@gmail.com") || email.endsWith("@yahoo.com")
    );
  };

  const handleSubmit = () => {
    const newErrors: string[] = [];

    if (!form.firstName) newErrors.push("First name required");
    if (!form.lastName) newErrors.push("Last name required");

    if (!form.email) {
      newErrors.push("Email required");
    } else if (!isValidEmailDomain(form.email)) {
      newErrors.push("Enter email with proper domain");
    }

    if (form.phone.length !== 10) {
      newErrors.push("Phone must be 10 digits");
    }

    if (
      !passwordRules.firstCapital ||
      !passwordRules.minLength ||
      !passwordRules.hasNumber ||
      !passwordRules.hasSpecial
    ) {
      newErrors.push(
        "Password does not meet all the requirements"
      );
    }

    if (form.password !== form.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      alert("Signup Successful");
      navigate("/");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>

        {/* ===== ROW 1 ===== */}
        <div className="row-3">
          <div>
            <label>
              Salutation <span className="required">*</span>
            </label>
            <select
              name="salutation"
              value={form.salutation}
              onChange={handleChange}
            >
              <option>Mr</option>
              <option>Ms</option>
              <option>Mrs</option>
              <option>Miss</option>
            </select>
          </div>

          <div>
            <label>
              First Name <span className="required">*</span>
            </label>
            <input
              name="firstName"
              placeholder="Enter First Name"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>
              Last Name <span className="required">*</span>
            </label>
            <input
              name="lastName"
              placeholder="Enter Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ===== ROW 2 ===== */}
        <div className="row-2">
          <div>
            <label>
              Phone Number <span className="required">*</span>
            </label>
            <div className="input-group">
              <span className="icon">+91</span>
              <input
                name="phone"
                placeholder="Enter 10 digit phone number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label>
              Email <span className="required">*</span>
            </label>
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ===== PASSWORD ROW ===== */}
        <div className="row-2">
          <div>
            <label>
              Password <span className="required">*</span>
            </label>
            <div className="input-group">
              <span className="icon">🔒</span>

              <input
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
              />

              <span
                className="toggle"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? "🙈" : "👁️"}
              </span>
            </div>

            {showPasswordRules && (
              <div className="password-rules">
                <p className={passwordRules.firstCapital ? "valid" : "invalid"}>
                  {passwordRules.firstCapital ? "✓" : "✗"} First letter capital
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
          </div>

          <div>
            <label>
              Confirm Password <span className="required">*</span>
            </label>
            <div className="input-group">
              <span className="icon">🔒</span>

              <input
                type={showConfirmPwd ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter the password"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <span
                className="toggle"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              >
                {showConfirmPwd ? "🙈" : "👁️"}
              </span>
            </div>

            {form.confirmPassword.length > 0 && (
              <div className="password-rules">
                {form.password === form.confirmPassword ? (
                  <p className="valid">✓ Passwords match</p>
                ) : (
                  <p className="invalid">✗ Passwords do not match</p>
                )}
              </div>
            )}
          </div>
        </div>

        {errors.map((err, i) => (
          <p key={i} className="error-text">
            {err}
          </p>
        ))}

        <button className="signup-btn" onClick={handleSubmit}>
          Sign Up
        </button>

        <p className="login-text centered">
          Already a user?{" "}
          <Link to="/" className="signin-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
