import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import useAuth from "../../Hook/useAuth";

// Import your assets
import loginPanelImage from "../../assets/Background/background.png";
import Logo from "../../assets/Logo/logo.png";
import Logo_Dark from "../../assets/Logo/logo_dark.png";

const Login = () => {
  // App themes: 'light' or 'dark'
  const [theme, setTheme] = useState("light");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const savedTheme = localStorage.getItem("theme");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Email validation
  const validateEmail = (email) => 
    /\S+@\S+\.\S+/.test(email);

  // Handle toggle between dark/light modes
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Input validation
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    setLoading(true);
    try {
      await loginUser(email, password);
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
      setLoading(false);
      toast.success("Login Successful! Welcome back!");
      navigate("/dashboard/");
    } catch (error) {
      setLoading(false);
      Swal.fire("Login Failed!", "Invalid email or password. Please try again.", "error");
    }
  };

  // Password reset handler
  const handlePasswordReset = (e) => {
    e.preventDefault();
    setShowForgotModal(false);
    Swal.fire("Request Sent", "If an account exists, a reset link will be sent.", "success");
  };

  return (
    <>
      <Helmet>
        <title>Login | Hotel Verse</title>
        <meta name="description" content="Login to your account." />
      </Helmet>

      {/* Theme switcher */}
      <div className="fixed top-6 right-8 z-40">
        <button
          onClick={handleThemeToggle}
          className={
            "px-4 py-2 rounded shadow font-semibold " +
            (theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800 border")
          }
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Main container */}
      <div className={`min-h-screen flex items-center justify-center p-4 transition duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`flex rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          {/* Left Panel (Image) */}
          <div
            className="hidden md:block md:w-1/2 bg-cover bg-center"
            style={{ backgroundImage: `url(${loginPanelImage})` }}
          />

          {/* Right Panel (Form) */}
          <div className={`w-full md:w-1/2 p-8 ${theme === "dark" ? "text-gray-100" : ""}`}>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src={theme === "dark" ? Logo_Dark : Logo}
                alt="Company Logo"
                className="w-48 h-auto transition-all"
              />
            </div>

            <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
            <p className="text-center mb-8 text-gray-600 dark:text-gray-400">Please enter your details to continue</p>

            <form onSubmit={handleLogin} noValidate>
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="loginEmail">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                    focus:ring-green-500 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "border-gray-300"}`}
                  required
                />
                {emailError && <div className="text-red-600 text-xs mt-1">{emailError}</div>}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="loginPassword">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                    focus:ring-green-500 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "border-gray-300"}`}
                  required
                />
                {passwordError && <div className="text-red-600 text-xs mt-1">{passwordError}</div>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`h-4 w-4 text-green-600 focus:ring-green-500 border rounded ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm">
                    Remember Me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out
                     bg-primary hover:bg-secondary text-white
                     ${loading ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className={`bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-sm w-full relative`}>
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2">Forgot Password?</h3>
            <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Enter your email to receive a reset link.
            </p>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                    focus:ring-blue-500 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-100" : "border-gray-300"}`}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;