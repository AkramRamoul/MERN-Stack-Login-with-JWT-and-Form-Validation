import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";
const PersistLogin = () => {
  const [isLoading, setisLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [persist] = useLocalStorage("persist", false);
  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        isMounted && setisLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setisLoading(false);
    return () => (isMounted = false);
  }, []);
  useEffect(() => {
    console.log(`isLoding : ${isLoading}`);
    console.log(`AT : ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p> Loading.....</p> : <Outlet />}</>
  );
};

export default PersistLogin;
