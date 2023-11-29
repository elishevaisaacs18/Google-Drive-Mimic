import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../assets/customHooks/useFetch.jsx";
import { useEffect, useState } from "react";

const Nav = ({ setShowPost, setShowAlbum }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchData = useFetch;
  const [nameOfUser, setNameOfUser] = useState("");

  function logout() {
    localStorage.setItem("currentUser", "");
    navigate(`/login`);
  }

  useEffect(() => {
    async function getUserName() {
      const currUserId = localStorage.getItem("currentUser");
      const data = await fetchData(`http://localhost:3000/users/${currUserId}`);
      setNameOfUser(data.name);
    }
    getUserName();
  }, [fetchData]);

  return (
    <nav>
      <h3>Hello, {nameOfUser}!</h3>
      <button
        type="button"
        className="navBtn"
        onClick={() => navigate(`/home/${id}/info/`)}
      >
        Info
      </button>
      <button
        type="button"
        className="navBtn"
        onClick={() => navigate(`/home/${id}/todos/`)}
      >
        Todos
      </button>
      <button
        type="button"
        className="navBtn"
        onClick={() => {
          setShowPost(false);
          navigate(`/home/${id}/posts/`);
        }}
      >
        Posts
      </button>
      <button
        type="button"
        className="navBtn"
        onClick={() => {
          setShowAlbum(false);
          navigate(`/home/${id}/albums/`);
        }}
      >
        Albums
      </button>
      <button type="button" className="navBtn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Nav;
