import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../../api/axios";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, resetUser, userattributes] = useInput("user", "");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [check, toggleCheck] = useToggle("persist", false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      setAuth({ user, accessToken });
      resetUser();
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1 className="log">Log in to your account</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <div className="inputContainer">
          <FontAwesomeIcon icon={faUser} className="icon" size="sm" />
          <input
            type="text"
            id="username"
            ref={userRef}
            autoComplete="off"
            {...userattributes}
            required
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="inputContainer">
          <FontAwesomeIcon icon={faLock} className="icon" size="sm" />
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
        </div>
        <button>Sign In</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={toggleCheck}
            checked={check}
          />
          <label htmlFor="persist">Trust this device</label>
        </div>
      </form>
      <p>
        Need an Account?
        <br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
