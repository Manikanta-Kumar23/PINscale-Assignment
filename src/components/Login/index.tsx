import { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import Cookies from "js-cookie";

import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMssg, setErrMssg] = useState("");
  const [isMailErr, setIsMailErr] = useState(false);
  const history = useHistory();
  const onCheckMail = (event: React.FocusEvent<HTMLInputElement>) => {
    if (
      event.target.value.endsWith("@gmail.com") === false &&
      event.target.value !== ""
    ) {
      setErrMssg("*Please provide a valid Email-Id");
      setIsMailErr(true);
    } else if (event.target.value.endsWith("@gmail.com")) {
      setErrMssg("");
      setIsMailErr(false);
    }
  };

  const onSuccess = (id: string) => {
    setIsMailErr(false);
    setErrMssg("");
    Cookies.set("id", id, { expires: 23 });
    history.replace("/");
  };

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email !== "" && password !== "") {
      const userDetails = { email, password };
      const url = `https://bursting-gelding-24.hasura.app/api/rest/get-user-id`;
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
        },
        body: JSON.stringify(userDetails),
      };
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(res)
      if (data.get_user_id.length !== 0) {
        onSuccess(data.get_user_id[0].id);
      } else {
        setIsMailErr(true);
        setErrMssg("*email & password doesn't match");
      }
    } else {
      alert("Email & Password are required");
    }
  };
  if (Cookies.get("id") !== undefined) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-background">
      <div className="login-page-card">
        <div className="login-page-image-card">
          <img
            alt="loginLogo"
            className="company-logo"
            src="https://res.cloudinary.com/djwve85r0/image/upload/v1690624094/Company_logo.png"
          />
          <img
            alt="login_image"
            className="vector-img"
            src="https://res.cloudinary.com/djwve85r0/image/upload/v1690629076/IM_zlx35s.png"
          />
        </div>
        <form onSubmit={onLogin} className="login-form-card">
          <img
            alt="logo"
            className="login-form-logo"
            src="https://res.cloudinary.com/djwve85r0/image/upload/v1690624094/logo.png"
          />
          <div className="credential-form-card">
            <div className="login-input-card">
              <label className="login-form-label" htmlFor="email">
                Email Address
              </label>
              <div className="login-form-input">
                <MdOutlineMail color="#1b2a33" size="23" />
                <input
                  className="input"
                  placeholder="Email ID"
                  onBlur={onCheckMail}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="text"
                  id="email"
                />
              </div>
            </div>
            <div className="login-input-card">
              <label className="login-form-label" htmlFor="password">
                Password
              </label>
              <div className="login-form-input">
                <PiPassword color="#1b2a33" size="23" />
                <input
                  className="input"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  id="password"
                />
              </div>
            </div>
            <button className="login-btn" type="submit">
              Login
            </button>
            {isMailErr && <p className="login-error">{errMssg}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
