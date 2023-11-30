import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../assets/customHooks/useFetch.jsx";
import { useEffect, useState } from "react";
// import { useHistory } from 'react-router-dom';

const Nav = () => {
  // const history = useHistory();
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchData = useFetch;
  const [nameOfUser, setNameOfUser] = useState("");

  function logout() {
    localStorage.setItem("currentUser", "");
    navigate(`/login`);
    // history.push('/login');
    // history.replace('/login');
  }

  useEffect(() => {
    async function getUserName() {
      try {
        const currUserId = localStorage.getItem("currentUser");
        const data = await fetchData(
          `http://localhost:3000/users/${currUserId}`
        );
        setNameOfUser(data.userName);
      } catch (err) {
        console.error(err);
      }
    }
    getUserName();
  }, [fetchData, id]);

  return (
    <nav>
      <h3>Hello, {nameOfUser}!</h3>
      <button type="button" className="navBtn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Nav;
