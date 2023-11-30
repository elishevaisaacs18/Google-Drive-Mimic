// import { Outlet } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import useFetch from "../assets/customHooks/useFetch";

// const Home = ({ sendRequestToDb }) => {
//   const fetchData = useFetch;
//   const [currFolderFiles, setCurrFolderFiles] = useState();
//   const [rename, setRename] = useState();
//   const { id } = useParams();
//   const [fileContent, setFileContent] = useState([]);

//   useEffect(() => {
//     async function getUserName() {
//       const data = await fetchData(`http://localhost:3000/content/user/${id}`);
//       console.log("data.name: ", data);
//       setCurrFolderFiles(data);
//     }
//     getUserName();
//   }, [fetchData]);

//   useEffect(() => {
//     async function getUserName() {
//       const data = await fetchData(`http://localhost:3000/content/user/${id}`);
//       console.log("data.name: ", data);
//       setCurrFolderFiles(data);
//     }
//     getUserName();
//   }, [fetchData]);

//   console.log("currFolderFiles: ", currFolderFiles);

//   async function deleteFile(file) {
//     try {
//       const deletedFile = await sendRequestToDb(
//         "DELETE",
//         `http://localhost:3000/content/${file.id}`
//       );
//       setCurrFolderFiles((prev) => {
//         const copy = [...prev];
//         copy.map((item) => {
//           if (item.id === file.id) {
//             item.deleted = true;
//           }
//         });
//         console.log("✌️copy --->", copy);
//         return copy;
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async function renameFile(file) {
//     try {
//       const fileToRename = await sendRequestToDb(
//         "PATCH",
//         `http://localhost:3000/content/${file.id}`,
//         { name: rename }
//       );
//       setCurrFolderFiles((prev) => {
//         const copy = [...prev];
//         copy.filter((item) => {
//           item.name = rename;
//         });
//         return copy;
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   function showFileDetails() {
//     console.log("details");
//   }

//   function duplicateFile() {
//     console.log("duplicate");
//   }

//   // const photosList = currFolderFiles?.map((file, index) => {
//   //   return (
//   //     <div key={index}>
//   //       <h2>{file.name}</h2>
//   //       <button onClick={() => deleteFile(file)}>Delete File</button>
//   //       <button onClick={() => showFileDetails(file)}>Show Details</button>
//   //       <button onClick={() => renameFile(file)}>Rename File</button>
//   //       <button onClick={() => duplicateFile(file)}>Duplicate File</button>

//   //       <img style={{ width: "200px", display: "block" }} src={file.link} />
//   //     </div>
//   //   );
//   // });
//   return (
//     <>
//       {currFolderFiles?.map(async (file, index) => {
//         if(file.info){
//         const fileAfterReading = await fetchData(`http://localhost:3000/content/${file.id}/info`)
//         console.log('fileAfterReading: ', fileAfterReading)
//         setFileContent((prev) => [...prev, fileAfterReading]);
//         }
//         if (file.deleted == false) {
//           return (
//             <div key={index}>
//               <h2>{file.name}</h2>
//               <button onClick={() => deleteFile(file)}>Delete File</button>
//               <button onClick={() => showFileDetails(file)}>
//                 Show Details
//               </button>
//               <button onClick={() => renameFile(file)}>Rename File</button>
//               <input
//                 type="text"
//                 name="rename"
//                 onChange={(e) => setRename(e.target.value)}
//               ></input>
//               <button onClick={() => duplicateFile(file)}>
//                 Duplicate File
//               </button>

//               {JSON.stringify(fileContent[index])}
//             </div>
//           );
//         }
//       })}
//       {/* {photosList} */}
//       <Outlet />
//     </>
//   );
// };

// export default Home;

import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../assets/customHooks/useFetch";

const Home = ({ sendRequestToDb }) => {
  const fetchData = useFetch; // Correctly invoke the custom hook
  const [currFolderFiles, setCurrFolderFiles] = useState([]);
  const [folderTree, setFolderTree] = useState([0]);
  const { id } = useParams();
  const [fileContent, setFileContent] = useState([]);

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

  console.log("currFolderFiles: ", currFolderFiles);

  async function handleOpenFolder(folder) {
    try {
      const folderFiles = await sendRequestToDb(
        "GET",
        `http://localhost:3000/content/folder/${folder}`
      );
      setCurrFolderFiles(folderFiles);
      // debugger;
      setFolderTree((prev) => [...prev, folder]);
      console.log(folderTree);
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

  const showFileDetails = () => {
    console.log("details");
  };

  const duplicateFile = () => {
    console.log("duplicate");
  };

  useEffect(() => {
    const fetchDataAndUpdateFileContent = async () => {
      const newFileContent = await Promise.all(
        currFolderFiles.map(async (file) => {
          if (file.link) {
            console.log("file: ", file.id);
            try {
              const fileAfterReading = await fetchData(
                `http://localhost:3000/content/${file.id}/info`
              );
              return fileAfterReading;
            } catch (err) {
              console.error(err);
              return null;
            }
          }
          return null;
        })
      );

      setFileContent(newFileContent);
      console.log("newFileContent: ", newFileContent);
      console.log(fileContent);
    };

    fetchDataAndUpdateFileContent();
  }, [currFolderFiles, fetchData]);

  return (
    <>
      <button onClick={() => handleBack(currFolderFiles[0].currFolder)}>
        Back
      </button>
      {Object.keys(currFolderFiles) !== 0 &&
        currFolderFiles.length !== 0 &&
        currFolderFiles.map((file, index) => {
          console.log("content: ", fileContent[index]);
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
        })}
      <Outlet />
    </>
  );
};

export default Home;
