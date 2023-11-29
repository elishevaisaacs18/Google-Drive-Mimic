import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../assets/customHooks/useFetch.jsx";

function Login({sendRequestToDb}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const fetchData = useFetch;
  const navigate = useNavigate();

  const forbidChars = [
    "!",
    "?",
    "*",
    "<",
    ">",
    "/",
    "\\",
    ";",
    "(",
    ")",
    "{",
    "}",
    "[",
    "]",
  ];

  async function postUserDetails() {
    const data = await sendRequestToDb("POST", `http://localhost:3000/users`, {
      userName: username,
      password: password,
    });
    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await postUserDetails();
    if (data.userName == username && data.password == password) {
      setIncorrect(false);
      localStorage.setItem("currentUser", data.id);
      navigate(`/home/${data.id}`);
    } else {
      setIncorrect(true);
    }
  }

  function handleInput(e, currState) {
    const currValue = e.target.value;
    if (
      currValue.length <= 15 &&
      !forbidChars.includes(currValue[currValue.length - 1])
    ) {
      switch (currState) {
        case "username":
          setUsername(currValue);
          break;
        case "password":
          setPassword(currValue);
      }
    }
  }

  return (
    <form id="loginForm" onSubmit={handleSubmit}>
      <label htmlFor="username">Username: </label>
      <input
        id="username"
        name="username"
        type="text"
        value={username}
        onChange={(e) => handleInput(e, "username")}
      />
      <br />
      <label htmlFor="password">Password: </label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => handleInput(e, "password")}
      />
      <Link to="/register">Register!</Link>
      <button type="submit">Submit!</button>
      {incorrect && <h4>Incorrect!</h4>}
    </form>
  );
}

export default Login;
