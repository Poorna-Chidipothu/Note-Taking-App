import { useState, useContext, useEffect } from "react";
import axios from "axios";

import sideImage from "/assets/bg.jpg";
import logo from "/assets/logo.png";
import GoogleLoginButton from "../components/GoogleLoginButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config/api";

export default function Auth() {
  const [authstate, setAuthstate] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [otpsent, setOtpsent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false); 

  const navigate = useNavigate();
  const { login, token, loading } = useContext(AuthContext);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && token) {
      navigate("/dashboard");
    }
  }, [token, loading, navigate]);

  // Don't render the auth form if we're loading or already authenticated
  if (loading || token) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // ---- Request OTP ----
  const requestOtp = async () => {
    setError("");
    try {
      if (authstate === "signup") {
        await axios.post(`${API_BASE_URL}/auth/signup/request-otp`, { name, dob, email });
      } else {
        await axios.post(`${API_BASE_URL}/auth/login/request-otp`, { email });
      }
      setOtpsent(true);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.error || "Failed to request OTP. Try again.");
    }
  };

  // ---- Verify OTP ----
  const verifyOtp = async () => {
    setError("");
    try {
      let res;
      if (authstate === "signup") {
        res = await axios.post(`${API_BASE_URL}/auth/signup/verify-otp`, {
          email,
          code: otp,
          name,
          dob,
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/auth/login/verify-otp`, {
          email,
          code: otp,
          keepLoggedIn
        });
      }

      console.log(`${authstate} success:`, res.data);

      if (res.data?.token && res.data?.user) {
        login(res.data.user, res.data.token, keepLoggedIn);
        navigate("/dashboard");
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP or something went wrong.");
    }
  };

  return (
    <div className="min-h-screen h-full flex items-center justify-center bg-white">
      <div className="w-full h-dvh p-10 md:p-10 lg:p-16 md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center gap-10">
        {/* Logo */}
        <div className="w-full flex items-center justify-center gap-2 md:justify-start lg:justify-start">
          <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
          <h1 className="text-xl font-bold">HD</h1>
        </div>

        {/* Form */}
        <div className="h-full w-full flex items-start justify-center md:items-center lg:items-center">
          <div className="w-full flex flex-col items-center justify-start">
            <h2 className="w-full text-4xl font-bold mb-1 text-center md:text-left lg:text-left">
              {authstate === "signup" ? "Sign Up" : "Sign In"}
            </h2>
            <p className="w-full text-lg text-gray-400 mb-6 text-center md:text-left lg:text-left">
              {authstate === "signup"
                ? "Sign up to enjoy the features of HD"
                : "Please login to continue to your account."}
            </p>

            

            {/* Signup only fields */}
            {authstate === "signup" && !otpsent && (
              <>
                <div className="relative w-full mb-2">
                  <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="peer border-2 border-gray-300 p-3 w-full mb-3 rounded-lg outline-0 text-lg focus:border-primary"
                  />
                  <span className="absolute left-2.5 -top-2.5 text-sm font-medium bg-white px-1.5 text-gray-500 peer-focus:text-primary">
                    Your Name
                  </span>
                </div>

                <div className="relative w-full mb-2">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="peer border-2 border-gray-300 p-3 w-full mb-3 rounded-lg outline-0 text-lg focus:border-primary"
                  />
                  <span className="absolute left-2.5 -top-2.5 text-sm font-medium bg-white px-1.5 text-gray-500 peer-focus:text-primary">
                    Date of Birth
                  </span>
                </div>
              </>
            )}

            {/* Email field */}
              <div className="relative w-full mb-2">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="peer border-2 border-gray-300 p-3 w-full mb-3 rounded-lg outline-0 text-lg focus:border-primary"
                />
                <span className="absolute left-2.5 -top-2.5 text-sm font-medium bg-white px-1.5 text-gray-500 peer-focus:text-primary">
                  Email
                </span>
              </div>

            {/* OTP step */}
            {otpsent && (
              <>
                <div className="relative w-full mb-2">
                  <input
                    type="text"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="peer border-2 border-gray-300 p-3 w-full mb-3 rounded-lg outline-0 text-lg focus:border-primary"
                  />
                </div>

                {authstate === "login" ? (
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center mb-2">
                            <input
                            id="keepLoggedIn"
                            type="checkbox"
                            checked={keepLoggedIn}
                            onChange={(e) => setKeepLoggedIn(e.target.checked)}
                            className="mr-2"
                            />
                            <label htmlFor="keepLoggedIn" className="text-gray-700 text-sm">
                              Keep me logged in
                            </label>
                        </div>
                        <button
                            onClick={requestOtp}
                            className="text-primary text-left underline text-sm mb-2 cursor-pointer"
                        >
                            Resend OTP
                        </button>
                    </div>
                  
                ):null}

                <button
                  onClick={verifyOtp}
                  className="bg-primary text-white text-lg font-semibold w-full py-3 rounded-lg cursor-pointer"
                >
                  {authstate === "signup" ? "Sign Up" : "Sign In"}
                </button>

                
              </>
            )}

            {/* Request OTP button */}
            {!otpsent && (
              <button
                onClick={requestOtp}
                className="bg-primary text-white text-lg font-semibold w-full py-3 rounded-lg cursor-pointer"
              >
                Get OTP
              </button>
            )}

            {error && (
              <div className="w-full mt-4 px-3 py-1 text-red-700 text-base text-center">
                {error}
              </div>
            )}

            {/* Toggle link */}
            <p className="mt-6 text-gray-600">
              {authstate === "signup" ? (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setAuthstate("login");
                      setOtpsent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="text-primary underline cursor-pointer"
                  >
                    Sign in
                  </span>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => {
                      setAuthstate("signup");
                      setOtpsent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="text-primary underline cursor-pointer"
                  >
                    Sign up
                  </span>
                </>
              )}
            </p>

            {/* Google Login */}
            <div className="my-4 border-t w-full flex items-center justify-center">
              <div className="w-64 mt-5 border-2 border-primary rounded-lg overflow-hidden">
                <GoogleLoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden p-0 sm:w-0 md:w-1/2 lg:w-3/5 h-dvh lg:p-3 md:p-3 md:block lg:block">
        <img
          src={sideImage}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
}
