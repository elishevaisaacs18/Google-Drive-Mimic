import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../assets/customHooks/useFetch";

const Home = ({ sendRequestToDb }) => {
  const fetchData = useFetch;
  const [currFolderFiles, setCurrFolderFiles] = useState();
  const [rename, setRename] = useState();
  const { id } = useParams();

  useEffect(() => {
    async function getUserName() {
      const data = await fetchData(`http://localhost:3000/content/folder/0`);
      console.log("data.name: ", data);
      setCurrFolderFiles(data);
    }
    getUserName();
  }, [fetchData]);
  console.log("currFolderFiles: ", currFolderFiles);

  async function deleteFile(file) {
    try {
      const deletedFile = await sendRequestToDb(
        "DELETE",
        `http://localhost:3000/content/${file.id}`
      );
      setCurrFolderFiles((prev) => {
        const copy = [...prev];
        copy.map((item) => {
          if (item.id === file.id) {
            item.deleted = true;
          }
        });
        console.log("✌️copy --->", copy);
        return copy;
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function renameFile(file) {
    try {
      const fileToRename = await sendRequestToDb(
        "PATCH",
        `http://localhost:3000/content/${file.id}`,
        { name: rename }
      );
      setCurrFolderFiles((prev) => {
        const copy = [...prev];
        copy.filter((item) => {
          if (item.id === file.id) {
            item.name = rename;
          }
        });
        setRename("");
        return copy;
      });
    } catch (err) {
      console.log(err);
    }
  }

  function showFileDetails() {
    console.log("details");
  }

  function duplicateFile() {
    console.log("duplicate");
  }

  // const photosList = currFolderFiles?.map((file, index) => {
  //   return (
  //     <div key={index}>
  //       <h2>{file.name}</h2>
  //       <button onClick={() => deleteFile(file)}>Delete File</button>
  //       <button onClick={() => showFileDetails(file)}>Show Details</button>
  //       <button onClick={() => renameFile(file)}>Rename File</button>
  //       <button onClick={() => duplicateFile(file)}>Duplicate File</button>

  //       <img style={{ width: "200px", display: "block" }} src={file.link} />
  //     </div>
  //   );
  // });
  return (
    <>
      {currFolderFiles?.map((file, index) => {
        if (file.deleted == false) {
          return (
            <div key={index}>
              <h2>{file.name}</h2>
              <button onClick={() => deleteFile(file)}>Delete File</button>
              <button onClick={() => showFileDetails(file)}>
                Show Details
              </button>
              <button onClick={() => renameFile(file)}>Rename File</button>
              <input
                type="text"
                name="rename"
                onChange={(e) => setRename(e.target.value)}
              ></input>
              <button onClick={() => duplicateFile(file)}>
                Duplicate File
              </button>

              <img
                style={{ width: "200px", display: "block" }}
                src={file.link}
              />
            </div>
          );
        }
      })}
      {/* {photosList} */}
      <Outlet />
    </>
  );
};

export default Home;
