import axios from "../../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      const response = await axios("/logout", {
        withCredentials: true,
      });
      setAuth({});
      // Optionally, handle response data or additional state updates here
    } catch (error) {
      console.error(error);
      // Optionally, handle error state or additional cleanup here
    }
  };

  return logout;
};

export default useLogout;
