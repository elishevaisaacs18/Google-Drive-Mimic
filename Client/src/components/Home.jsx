import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../assets/customHooks/useFetch";

const Home = ({ sendRequestToDb }) => {
  const fetchData = useFetch;
  const [currFolderFiles, setCurrFolderFiles] = useState([]);
  const [folderTree, setFolderTree] = useState([0]);
  const { id } = useParams();
  const [fileContent, setFileContent] = useState([]);
  const [fileDetails, setFileDetails] = useState("");

  useEffect(() => {
    const getUserName = async () => {
      try {
        const data = await fetchData(
          `http://localhost:3000/content/user/${id}`
        );
        data.map(async (item) => {
          if (item.currFolder === "root") {
            try {
              const currentFiles = await fetchData(
                `http://localhost:3000/content/folder/${item.id}`
              );
              setCurrFolderFiles(currentFiles);
              // setFolderTree((prev) => [...prev], item.id);
            } catch (err) {
              console.log(err);
            }
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    getUserName();
  }, [fetchData, id]);

  async function handleOpenFolder(folder) {
    try {
      const folderFiles = await sendRequestToDb(
        "GET",
        `http://localhost:3000/content/folder/${folder}`
      );
      setCurrFolderFiles(folderFiles);
      // debugger;
      setFolderTree((prev) => [...prev, folder]);
    } catch (err) {
      console.log(err);
    }
  }

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

  function handleBack(folder) {
    // debugger;
    if ((folder === "0" && folderTree.length === 1) || folder == 0) {
      return console.log("root folder");
    } else {
      const correntFolderIndex = folderTree.findIndex(
        (element) => parseInt(element) === parseInt(folder)
      );
      handleOpenFolder(folderTree[correntFolderIndex - 1]);
      setFolderTree((prev) => {
        let copy = [...prev];
        copy.pop();
        setFolderTree(copy);
      });
    }
  }

  const renameFile = async (file) => {
    const newName = prompt("name");
    try {
      await sendRequestToDb(
        "PATCH",
        `http://localhost:3000/content/${file.id}`,
        { name: newName }
      );
      setCurrFolderFiles((prev) =>
        prev.map((item) =>
          item.id === file.id ? { ...item, name: newName } : item
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

  const duplicateFile = async (file) => {
    const fileToSend = {
      currFolder: file.currFolder, // Ensure currFolder is correct
      link: file.link,
      name: file.name,
      userId: file.userId,
    };
    try {
      const newFile = await sendRequestToDb(
        "POST",
        `http://localhost:3000/content`,
        fileToSend
      );
      setCurrFolderFiles((prev) => [...prev, newFile]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchDataAndUpdateFileContent = async () => {
      const newFileContent = [];
      if (currFolderFiles.length > 0) {
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
      }

      setFileContent(newFileContent);
    };

    fetchDataAndUpdateFileContent();
  }, [currFolderFiles, fetchData, id]);

  return (
    <>
      <button onClick={() => handleBack(currFolderFiles[0].currFolder)}>
        Back
      </button>
      {Object.keys(currFolderFiles).length !== 0 &&
      currFolderFiles.length !== 0 ? (
        currFolderFiles.map((file, index) => {
          if (!file.deleted) {
            return (
              <div key={index}>
                <h2>{file.name}</h2>
                <button onClick={() => deleteFile(file)}>Delete File</button>
                <button onClick={() => showFileDetails(file)}>
                  Show Details
                </button>
                <button onClick={() => renameFile(file)}>Rename File</button>
                <button onClick={() => duplicateFile(file)}>
                  Duplicate File
                </button>
                <br />
                <h4>{fileDetails}</h4>
                {!file.link ? (
                  <button
                    style={{ backgroundColor: "violet" }}
                    onClick={() => handleOpenFolder(file.id)}
                  >
                    Open Folder
                  </button>
                ) : null}
                {fileContent[index]}
              </div>
            );
          }
          return null;
        })
      ) : (
        <p>No files found</p>
      )}
      <Outlet />
    </>
  );
};

export default Home;
