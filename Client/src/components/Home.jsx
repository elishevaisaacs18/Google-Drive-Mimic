import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../assets/customHooks/useFetch";

const Home = ({ sendRequestToDb }) => {
  const fetchData = useFetch; // Correctly invoke the custom hook
  const [currFolderFiles, setCurrFolderFiles] = useState([]);
  const [rename, setRename] = useState("");
  const { id } = useParams();
  const [fileContent, setFileContent] = useState([]);
  const [fileDetails, setFileDetails] = useState("");

  useEffect(() => {
    const getUserName = async () => {
      try {
        const data = await fetchData(
          `http://localhost:3000/content/user/${id}`
        );
        setCurrFolderFiles(data);
      } catch (err) {
        console.error(err);
      }
    };
    getUserName();
  }, [fetchData, id]);

  const deleteFile = async (file) => {
    try {
      await sendRequestToDb(
        "DELETE",
        `http://localhost:3000/content/${file.id}`
      );
      setCurrFolderFiles((prev) =>
        prev.map((item) =>
          item.id === file.id ? { ...item, deleted: true } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renameFile = async (file) => {
    try {
      await sendRequestToDb(
        "PATCH",
        `http://localhost:3000/content/${file.id}`,
        { name: rename }
      );
      setCurrFolderFiles((prev) =>
        prev.map((item) =>
          item.id === file.id ? { ...item, name: rename } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const showFileDetails = (file) => {
    const type = file.link ? "file" : "folder";
    setFileDetails(
      ` File Details: userId: ${file.userId}, currFolder: ${file.currFolder}, type: ${type}`
    );
  };

  const duplicateFile = async () => {
    try {
     const newFile = await sendRequestToDb("POST", `http://localhost:3000/content`, {
        userId:"2",
        currFolder: "4",
        name: "aaaaaaaaaa",
        link:"../files/file1.txt"
        });
      setCurrFolderFiles((prev) => [...prev, newFile]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchDataAndUpdateFileContent = async () => {
      const newFileContent = [];  
      for (const file of currFolderFiles) {
        if (file.link) {
          try {
            const fileAfterReading = await fetchData(
              `http://localhost:3000/content/${file.id}/info`
            );
            newFileContent.push(fileAfterReading);
          } catch (err) {
            console.error(`Error fetching file ${file.id}:`, err);
            newFileContent.push(null);
          }
        } else {
          newFileContent.push(null);
        }
      }
    
      console.log('newFileContent: ', newFileContent);
      setFileContent(newFileContent);
    };
    

    fetchDataAndUpdateFileContent();
  }, [currFolderFiles, fetchData]);

  return (
    <>
      {currFolderFiles.map((file, index) => {
        if (!file.deleted) {
          return (
            <div key={index}>
              <h2>{file.name}</h2>
              <button onClick={() => deleteFile(file)}>Delete File</button>
              <button onClick={() => showFileDetails(file)}>
                Show Details
              </button>
              <br />
              <button onClick={() => renameFile(file)}>Rename File</button>
              <input
                type="text"
                name="rename"
                value={rename}
                onChange={(e) => setRename(e.target.value)}
              ></input>
              <br />
              <button onClick={() => duplicateFile(file)}>
                Duplicate File
              </button>
              <br />
              <h4>{fileDetails}</h4>
              {fileContent[index]}
            </div>
          );
        }
        return null;
      })}
      <Outlet />
    </>
  );
};

export default Home;
