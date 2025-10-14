import { useEffect, useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Turnstile from "react-turnstile"; // ✅ added
import {
  clearErrors,
  login,
  register,
  resetOtpMessage,
  resetOtpState,
  verifyOtp,
} from "../../actions/userAction";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    error,
    isAuthenticated,
    message,
    otpPending,
    otpUserId,
    otpMessage,
  } = useSelector((state) => state.user);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);

  const [otp, setOtp] = useState("");

  // ✅ Turnstile token states
  const [cfTokenLogin, setCfTokenLogin] = useState("");

  useEffect(() => {
    if (isAuthenticated && !otpPending) {
      navigate("/");
    }

    const container = document.querySelector(".form-container");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    const handleRegisterClick = () => container.classList.add("active");
    const handleLoginClick = () => container.classList.remove("active");

    if (otpMessage) {
      toast.success(otpMessage);
      dispatch(resetOtpMessage());
    }
    if (message) {
      container.classList.remove("active");
      toast.success(message);
    }

    registerBtn?.addEventListener("click", handleRegisterClick);
    loginBtn?.addEventListener("click", handleLoginClick);

    return () => {
      registerBtn?.removeEventListener("click", handleRegisterClick);
      loginBtn?.removeEventListener("click", handleLoginClick);
    };
  }, [isAuthenticated, navigate, message, otpPending, otpMessage]);

  useEffect(() => {
    if (performance.navigation.type === 1) {
      dispatch(resetOtpState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const loginSubmit = (e) => {
    e.preventDefault();
    if (!cfTokenLogin) {
      toast.error("Please complete the human verification.");
      return;
    }
    dispatch(login(loginEmail, loginPassword, cfTokenLogin)); // ✅ send token
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error(
        "Please agree to the Terms and Conditions before registering."
      );
      return;
    }
    const formData = new FormData();
    formData.set("name", registerName);
    formData.set("email", registerEmail);
    formData.set("password", registerPassword);

    dispatch(register(formData));
  };

  const otpSubmit = (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    dispatch(verifyOtp(otpUserId, otp));
  };

  return (
    <div className="login-div">
      <div className="form-container">
        {/* OTP Verification Form */}
        <div className="form-box otp-verify">
          {otpPending ? (
            <form onSubmit={otpSubmit}>
              <h1>Verify OTP</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter your OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={loginSubmit}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="input-box password-box">
                <input
                  type={loginPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <span
                  onClick={() => setLoginPasswordVisible(!loginPasswordVisible)}
                  className="password-toggle"
                >
                  {loginPasswordVisible ? "Hide" : "Show"}
                </span>
              </div>

              {/* ✅ Cloudflare Turnstile Widget */}
              <div style={{ margin: "10px 0" }}>
                <Turnstile
                  sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onVerify={(token) => setCfTokenLogin(token)}
                />
              </div>

              <div className="forgot-link">
                <Link to="/password/forgot">Forgot Password?</Link>
              </div>
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
              <p>or login with social platforms</p>
              <div className="social-icons">
                <a
                  href={`${import.meta.env.VITE_API_URL}/api/v1/google`}
                  aria-label="Google"
                >
                  <FaGoogle className="icon" />
                </a>
                <a
                  href={`${import.meta.env.VITE_API_URL}/api/v1/facebook`}
                  aria-label="Facebook"
                >
                  <FaFacebookF className="icon" />
                </a>
              </div>
            </form>
          )}
        </div>

        {/* Register Form */}
        <div className="form-box register">
          <form onSubmit={registerSubmit}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div className="input-box password-box">
              <input
                type={registerPasswordVisible ? "text" : "password"}
                placeholder="Password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <span
                onClick={() =>
                  setRegisterPasswordVisible(!registerPasswordVisible)
                }
                className="password-toggle"
              >
                {registerPasswordVisible ? "Hide" : "Show"}
              </span>
            </div>
            <div className="checkbox-box" style={{ margin: "10px 0" }}>
              <label>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />{" "}
                I agree to the{" "}
                <Link to="/terms" className="text-green-600" target="_blank">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a
                href={`${import.meta.env.VITE_API_URL}/api/v1/google`}
                aria-label="Google"
              >
                <FaGoogle className="icon" />
              </a>
              <a
                href={`${import.meta.env.VITE_API_URL}/api/v1/facebook`}
                aria-label="Facebook"
              >
                <FaFacebookF className="icon" />
              </a>
            </div>
          </form>
        </div>

        {/* Toggle Panel */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Don't have an account?</p>
            <button className="btn register-btn">Register</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="btn login-btn">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
