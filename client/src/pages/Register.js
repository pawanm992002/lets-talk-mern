import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/chats");
    }
  }, [navigate]);
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [picture, setPicture] = useState("");
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  const postDetails = (pics) => {
    if (pics === undefined) {
      alert("please select an image");
      return;
    }
    if (
      pics.type === "image/png" ||
      pics.type === "image/jpg" ||
      pics.type === "image/jpeg"
    ) {
      let data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "webChat");
      data.append("cloud_name", "pawan992002");
      fetch("https://api.cloudinary.com/v1_1/pawan992002/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("please select correct image");
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = input;
    if (!name || !email || !password || !cpassword) {
      alert("please fill all the fields");
      return;
    } else if (password !== cpassword) {
      alert("password and confirm password must be same");
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/user/",
        {
          name,
          email,
          password,
          picture: picture,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      alert(data.msg);
      if (data.status === false) {
        return;
      }
      if (data.status === true) {
        localStorage.setItem("userInfo", JSON.stringify(data.sentUser));
        navigate("/chats");
      }
    } catch (err) {
      alert("something went wrong");
    }
  };

  return (
    <>
      <form className="hSignup" onSubmit={submitHandler}>
        <label className="hlabel">User Name: </label>
        <input
          className="hinput"
          type="text"
          name="name"
          value={input.name}
          onChange={changeHandler}
          required
        />

        <label className="hlabel">Email Address : </label>
        <input
          className="hinput"
          type="email"
          name="email"
          value={input.email}
          onChange={changeHandler}
          required
        />

        <label className="hlabel">Password : </label>
        <input
          className="hinput"
          type="password"
          name="password"
          value={input.password}
          onChange={changeHandler}
          required
        />

        <label className="hlabel">Confirm Password : </label>
        <input
          className="hinput"
          type="password"
          name="cpassword"
          value={input.cpassword}
          onChange={changeHandler}
          required
        />

        <label className="hlabel">Upload Profile Picture : </label>
        <input
          className="hpicture"
          type="file"
          name="picture"
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
        <input type="submit" value="Sign Up" className="submitBtn" />
      </form>
    </>
  );
};

export default Register;
