import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../assets/customHooks/useFetch";

const Home = () => {
  const fetchData = useFetch;
  const [currFolderFiles, setCurrFolderFiles] = useState();
  const { id } = useParams();

  useEffect(() => {
    async function getUserName() {
      const data = await fetchData(`http://localhost:3000/content/folder/0`);
      console.log("data.name: ", data);
      setCurrFolderFiles(data);
    }
    getUserName();
  }, [fetchData]);
  console.log('currFolderFiles: ', currFolderFiles)

  function deleteFile(){
    console.log("deleted")
  }

  function showFileDetails(){
    console.log("details")
  }

  function renameFile(){
    console.log("renamed")
  }

  function duplicateFile(){
    console.log("duplicate")
  }

  const photosList = currFolderFiles?.map((file, index) => {
    return (
      <div key={index}>
        <h2>{file.name}</h2>
        <button onClick={()=>deleteFile(file)}>Delete File</button>
        <button onClick={()=>showFileDetails(file)}>Show Details</button>
        <button onClick={()=>renameFile(file)}>Rename File</button>
        <button onClick={()=>duplicateFile(file)}>Duplicate File</button>

        <img style={{width:"200px", display:"block"}} src={file.link}/>
      </div>
    );
  });
  return (
    <>
       {photosList}
        <Outlet />
    </>
  );
};

export default Home;
