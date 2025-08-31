import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";

export default function GoogleLoginButton() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await axios.post(`${API_BASE_URL}/auth/google`, { idToken });
      const { token, user } = res.data;

      // Use AuthContext login with keepLoggedIn = true for Google login
      login(user, token, true);
      console.log("Google login success:", user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  const handleError = () => {
    console.error("Google login failed");
    alert("Google login failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
    />
  );
}
