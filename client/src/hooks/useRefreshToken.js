import axios from "../../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get("/refresh", {
        withCredentials: true,
      });
      setAuth((prev) => {
        console.log("Previous Auth:", JSON.stringify(prev));
        console.log("New Access Token:", response.data.accessToken);
        return {
          ...prev,
          roles: response.data.roles,
          accessToken: response.data.accessToken,
        };
      });
      return response.data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      // Handle the error appropriately
    }
  };

  return refresh;
}

export default useRefreshToken;
