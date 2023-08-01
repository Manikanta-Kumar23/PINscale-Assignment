import { Component } from "react";

import "./index.css";

import { MdOutlineMail } from "react-icons/md";

import { PiPassword } from "react-icons/pi";

import { Redirect } from "react-router-dom";

import Cookies from "js-cookie";

class Login extends Component {
  state = { email: "", password: "", errMssg: "", mailErr: false };

  onMailId = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  onPassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  onSuccess = (userId) => {
    const { history } = this.props;
    this.setState({
      mailErr: false,
      errMssg: "",
    });
    Cookies.set("id", userId, { expires: 23 });
    history.push("/");
  };

  onCheckMail = (event) => {
    if (event.target.value.endsWith("@gmail.com") === false) {
      this.setState({
        errMssg: "Please provide a valid Email-Id",
        mailErr: true,
      });
    } else if (event.target.value.endsWith("@gmail.com")) {
      this.setState({
        mailEr: false,
        errMssg: "",
      });
    }
  };

  onLogin = async (event) => {
    const { email, password } = this.state;
    const userDetails = { email, password };
    event.preventDefault();
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
      this.onSuccess(data.get_user_id[0].id);
    } else {
      this.setState({
        mailErr: true,
        errMssg: "email & password doesn't match",
      });
    }
  };

  render() {
    const { email, password, errMssg, mailErr } = this.state;
    const userId = Cookies.get("id");
    if (userId !== undefined) {
      return <Redirect to="/" />;
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
          <form onSubmit={this.onLogin} className="login-form">
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
                    onBlur={this.onCheckMail}
                    onChange={this.onMailId}
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
                    onChange={this.onPassword}
                    value={password}
                    type="password"
                    id="password"
                  />
                </div>
              </div>
              <button className="login-btn" type="submit">
                Login
              </button>
              {mailErr && <p className="err">*{errMssg}</p>}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
