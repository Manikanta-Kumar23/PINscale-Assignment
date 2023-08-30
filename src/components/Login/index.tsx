import { useState } from "react"
import { useHistory , Redirect  } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import Cookies from "js-cookie";

import "./index.css";

const Login = () => {
  const [email , setEmail] = useState("")
    const [password ,setPassword] = useState("")
    const [errMssg, setErrMssg] = useState("")
    const [mailErr , setMailErr] = useState(false)
    const history = useHistory()
    const onCheckMail = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value.endsWith("@gmail.com") === false &&
        event.target.value !== "") {
            setErrMssg("*Please provide a valid Email-Id")
            setMailErr(true)
        }
        else if (event.target.value.endsWith("@gmail.com")) {
            setErrMssg("")
            setMailErr(false)
        }

    }
    
    const onSuccess = (id: string) => {
      setMailErr(false)
      setErrMssg("")
      Cookies.set("id", id, { expires: 23 });
      history.push("/")
    }
    const onMailId = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    } 
    const onPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }
    const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
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
          if (data.get_user_id.length !== 0) {
            onSuccess(data.get_user_id[0].id);
          } else {
            setMailErr(true)
            setErrMssg("*email & password doesn't match")
          }
        } else {
          alert("Email & Password are required");
        }
    }
    if (Cookies.get("id") !== undefined) {
      return <Redirect to = "/" />
    }

    return (
      <div className="background">
        <div className="page-card">
          <div className="image-card">
            <img
              alt="logo"
              className="company-logo"
              src="https://res.cloudinary.com/djwve85r0/image/upload/v1690624094/Company_logo.png"
            />
            <img
              alt="login_image"
              className="vector-img"
              src="https://res.cloudinary.com/djwve85r0/image/upload/v1690629076/IM_zlx35s.png"
            />
          </div>
          <form onSubmit={onLogin} className="login-form">
            <img
              alt="logo"
              className="logo"
              src="https://res.cloudinary.com/djwve85r0/image/upload/v1690624094/logo.png"
            />
            <div className="form-card">
              <div className="input-card">
                <label className="label" htmlFor="email">
                  Email Address
                </label>
                <div className="icon-box">
                  <MdOutlineMail color="#1b2a33" size="23" />
                  <input
                    className="input"
                    placeholder="Email ID"
                    onBlur={onCheckMail}
                    onChange={onMailId}
                    value={email}
                    type="text"
                    id="email"
                  />
                </div>
              </div>
              <div className="input-card">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <div className="icon-box">
                  <PiPassword color="#1b2a33" size="23" />
                  <input
                    className="input"
                    placeholder="Password"
                    onChange={onPassword}
                    value={password}
                    type="password"
                    id="password"
                  />
                </div>
              </div>
              <button className="login-btn" type="submit">
                Login
              </button>
              {mailErr && <p className="err">{errMssg}</p>}
            </div>
          </form>
        </div>
      </div>
    );
  }

export default Login;
