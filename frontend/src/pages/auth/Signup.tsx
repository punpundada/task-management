import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? <Navigate to="/" /> : <div>SIGNUP</div>;
};

export default Signup;
