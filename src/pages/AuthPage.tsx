import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { login, register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthPage = ({ isRegister = false }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem("accessToken");
    const token = Cookies.get("accessToken");
    if (token) {
      navigate("/");
    }
  }, []);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(username)) {
      newErrors.username = "Please enter a valid email address.";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (isRegister) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password.";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          Swal.fire({
            icon: "error",
            title: "Passwords do not match",
            text: "Please make sure both passwords are the same.",
          });
          return;
        }

        await register({ username, password });

        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "You can now log in.",
        });

        navigate("/login");
      } else {
        const response = await login({ username, password });

        // localStorage.setItem("accessToken", response.Access_Token);
        Cookies.set("accessToken", response.Access_Token);
        // , {
        //   secure: true,
        //   sameSite: "Strict",
        // });

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
        });

        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text:
          error?.response?.data?.message ||
          error.message ||
          "An error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl p-10 rounded-3xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
          {isRegister ? "Create Your Admin Account" : "Welcome Back, Admin"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-5 py-3 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-5 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <span
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          {isRegister && (
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-5 py-3 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        {!isRegister && (
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        )}
        {isRegister && (
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
