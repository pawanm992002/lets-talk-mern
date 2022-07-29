import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/chats");
    }
  }, [navigate]);
  const [showPassword, setShowPassword] = useState(false);
  const showPasswordfunc = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = input;
    if (!email || !password) {
      alert("please fill all the fields");
      return;
    }
    const { data } = await axios.post(
      "/api/user/login",
      { email, password },
      { headers: { "Content-type": "application/json" } }
    );
    alert(data.msg);
    if (data.status === false) {
      return;
    }
    if (data.status === true) {
      localStorage.setItem("userInfo", JSON.stringify(data.sentUser));
      navigate("/chats");
    }
  };
  return (
    <>
      <form className="hlogin" onSubmit={submitHandler}>
        <label className="hlabel">Email Address : </label>
        <input
          className="hinput"
          type="text"
          name="email"
          value={input.email}
          onChange={changeHandler}
          required
        />

        <label className="hlabel">Password : </label>
        <div>
          <input
            className="hinput"
            type={showPassword ? "text" : "password"}
            name="password"
            value={input.password}
            onChange={changeHandler}
            required
          />
          <button onClick={showPasswordfunc}>
            {showPassword ? "😑" : "😐"}
          </button>
        </div>

        <input type="submit" value="Login" className="submitBtn" />
      </form>
    </>
  );
}
