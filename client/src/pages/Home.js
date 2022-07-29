import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Login from "./Login";
import Register from "./Register";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  function changeTabs(e) {
    const form1 = document.getElementsByClassName("hlogin")[0];
    const form2 = document.getElementsByClassName("hSignup")[0];
    if (e === "login") {
      form1.style.display = "flex";
      form2.style.display = "none";
    } else if (e === "signup") {
      form1.style.display = "none";
      form2.style.display = "flex";
    }
  }
  return (
    <>
      <div className="hContainer">
        <h2 className="hTitle"> Lets Have Talk </h2>
        <div className="hMain">
          <div className="hBtns">
            <button onClick={() => changeTabs("login")} className="hbtn">
              Login
            </button>
            <button onClick={() => changeTabs("signup")} className="hbtn">
              Sign Up
            </button>
          </div>
          <div className="hForms">
            <Login />
            <Register />
          </div>
        </div>
      </div>
    </>
  );
}
