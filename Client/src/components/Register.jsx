import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../assets/customHooks/useFetch.jsx";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [error, setError] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const fetchData = useFetch;
  const navigate = useNavigate();

  function handleInput(e, currState) {
    const currValue = e.target.value;
    if (currValue.length <= 15) {
      switch (currState) {
        case "username":
          setUsername(currValue);
          break;
        case "password":
          setPassword(currValue);
          break;
        case "passwordVerify":
          setPasswordVerify(currValue);
      }
    }
  }

  function createUserObj() {
    return {
      password: password,
      userName: username,
    };
  }

  async function handleSecondSubmit(e) {
    e.preventDefault();
    const currUser = createUserObj();
    if (password === passwordVerify) {
      const newUser = await fetchData(`http://localhost:3000/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currUser),
      });
      setError(false);
      localStorage.setItem("currentUser", newUser.id);
      navigate(`/home/${newUser.id}`);
    } else {
      setError(true);
    }
  }

  return (
    <>
      <form id="registerForm2" onSubmit={handleSecondSubmit}>
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
        <label htmlFor="passwordVerify">verify Password: </label>
        <input
          id="passwordVerify"
          name="passwordVerify"
          type="password"
          value={passwordVerify}
          onChange={(e) => handleInput(e, "passwordVerify")}
        />
        <button type="submit">Submit!</button>
        {error && <h4>Not same passwords!</h4>}
      </form>
    </>
  );
};

export default Register;
