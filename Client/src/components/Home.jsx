import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";

const Home = () => {
  const { id } = useParams();

  return (
    <>
      {window.location.href === `http://localhost:5173/home/${id}` ? (
        <h1>Choose the data you would like to see user number {id} </h1>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Home;
