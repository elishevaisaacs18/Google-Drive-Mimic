import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../assets/customHooks/useFetch.jsx";

const Register = () => {
  const [nameOfUser, setNameOfUser] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [error, setError] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const fetchData = useFetch;
  const navigate = useNavigate();

  let alphabetChars = "abcdefghijklmnopqrstuvwxyz";
  alphabetChars += alphabetChars.toUpperCase() + " ";
  alphabetChars = alphabetChars.split("");
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
  const phoneChars = "1234567890-".split("");

  function handleName(e) {
    const currValue = e.target.value;
    if (
      currValue.length <= 25 &&
      (alphabetChars.includes(currValue[currValue.length - 1]) ||
        currValue === "")
    ) {
      setNameOfUser(currValue);
    }
  }

  function handleEmail(e) {
    const currValue = e.target.value;
    if (
      currValue.length <= 35 &&
      !forbidChars.includes(currValue[currValue.length - 1])
    ) {
      setEmail(currValue);
    }
  }

  function handleCity(e) {
    const currValue = e.target.value;
    if (
      currValue.length <= 25 &&
      (alphabetChars.includes(currValue[currValue.length - 1]) ||
        currValue === "")
    ) {
      setCity(currValue);
    }
  }

  function handlePhone(e) {
    const currValue = e.target.value;
    if (
      currValue.length <= 12 &&
      (phoneChars.includes(currValue[currValue.length - 1]) || currValue === "")
    ) {
      setPhone(currValue);
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
          break;
        case "passwordVerify":
          setPasswordVerify(currValue);
      }
    }
  }

  function handleFirstSubmit(e) {
    e.preventDefault();
    if (email.includes("@") && phone.length >= 10) {
      setError(false);
      setCurrPage(2);
    } else {
      setError(true);
    }
  }

  function createUserObj() {
    return {
      name: nameOfUser,
      username: username,
      email: email,
      address: {
        street: "street",
        suite: "suite",
        city: city,
        zipcode: "01234-567",
        geo: {
          lat: "000.000",
          lng: "000.000",
        },
      },
      phone: phone,
      website: password,
      company: {
        name: "company name",
        catchPhrase: "phrase",
        bs: "bs",
      },
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
      {currPage === 1 ? (
        <form id="registerForm1" onSubmit={handleFirstSubmit}>
          <label htmlFor="nameOfUser">Name: </label>
          <input
            id="nameOfUser"
            name="nameOfUser"
            type="text"
            value={nameOfUser}
            onChange={handleName}
          />
          <br />
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            name="email"
            type="text"
            value={email}
            onChange={handleEmail}
          />
          <br />
          <label htmlFor="city">City: </label>
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={handleCity}
          />
          <br />
          <label htmlFor="phone">Phone: </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={phone}
            onChange={handlePhone}
          />
          <button type="submit">Submit!</button>
          {error && <h4>Error!</h4>}
        </form>
      ) : (
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
      )}
    </>
  );
};

export default Register;
