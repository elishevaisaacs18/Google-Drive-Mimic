import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../assets/customHooks/useFetch";

const Home = () => {
  const fetchData = useFetch;
  const [currFolderFiles, setCurrFolderFiles] = useState("root");
  const { id } = useParams();

  useEffect(() => {
    async function getUserName() {
      const data = await fetchData(`http://localhost:3000/content/folder/0`);
      console.log('data.name: ', data)
      setCurrFolderFiles(data);
    }
    getUserName();
  }, [fetchData]);
  return (
    <>
      {window.location.href === `http://localhost:5173/home/${id}` ? (
        <p>{JSON.stringify(currFolderFiles)}</p>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Home;
