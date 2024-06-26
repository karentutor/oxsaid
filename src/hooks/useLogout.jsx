import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setAuth({});
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return logout;
};

export default useLogout;
