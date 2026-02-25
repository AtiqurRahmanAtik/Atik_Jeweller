import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import useAuth from "../../Hook/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  // Load saved credentials if "Remember Me" was used
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Email validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

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



  // Jewellers

  return (
    <>
      <Helmet>
        <title>Login | Kunjo Jewellers</title>
        <meta name="description" content="Login to your Kunjo Jewellers account." />
      </Helmet>

    
     {/* Main container - Full screen height */}
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        
       
        <div className="rounded-sm shadow-2xl overflow-hidden max-w-md w-full bg-white">
          
          <div className="w-full p-8 md:p-10 flex flex-col justify-center text-gray-800">
            
            
            <h2 className="text-xl md:text-2xl font-serif text-center font-bold tracking-wide">Welcome Back</h2>
            <p className="text-center mb-8 text-gray-500 text-xs md:text-sm">Please enter your details to continue</p>

            <form onSubmit={handleLogin} noValidate>
              
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="loginEmail">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                  required
                />
                {emailError && <div className="text-red-600 text-xs mt-1">{emailError}</div>}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="loginPassword">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                  required
                />
                {passwordError && <div className="text-red-600 text-xs mt-1">{passwordError}</div>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-8 mt-2">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded-sm"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-600">
                    Remember Me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-gray-500 hover:text-black font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-3 px-4 uppercase tracking-wider text-sm rounded-sm transition duration-300 ease-in-out
                     bg-primary hover:bg-secondary text-white shadow-md
                     ${loading ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* --- Forgot Password Modal --- */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-sm shadow-2xl text-center max-w-sm w-full relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-2 right-4 text-3xl font-light text-gray-400 hover:text-gray-800 transition-colors"
            >
              &times;
            </button>
            <h3 className="text-xl font-serif font-bold mb-2 mt-2">Forgot Password?</h3>
            <p className="mb-6 text-gray-500 text-sm">
              Enter your email to receive a reset link.
            </p>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-6 text-left">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 px-4 uppercase tracking-wider text-sm rounded-sm transition duration-300"
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