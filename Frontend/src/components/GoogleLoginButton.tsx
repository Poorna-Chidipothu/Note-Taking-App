import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const { login } = useContext(AuthContext);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await axios.post("http://localhost:4000/api/auth/google", { idToken });
      const { token, user } = res.data;

      login(user, token);
      console.log("Google login success:", user);
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
