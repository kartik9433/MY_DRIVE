import React, { useState, useRef, useEffect } from 'react';
import '../App.css';  
import { Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHouse, faFile, faShare, faClock, faStar, faTrash, faCloud, faMagnifyingGlass, faArrowDown } from '@fortawesome/free-solid-svg-icons';

function Drive() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/apis/files/list`);
      if (response.ok) {
        const fileList = await response.json();
        setFiles(fileList);
      }
    } catch (error) {
      console.log("Error fetching files:", error);
    }
  };

  const showonScreen = () => {
    fileInputRef.current.click();
  };

  const fetchfiles = async (file) => {
    if (!file) {
      alert("Please select a file");
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/apis/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Failed to upload file!");
        return null;
      } else {
        const savedFile = await response.json();
        alert("Successfully uploaded file!");
        return savedFile;
      }
    } catch (error) {
      console.log(error);
      alert("Error while uploading file");
      return null;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const savedFile = await fetchfiles(file);
    if (savedFile) {
      setFiles((prev) => [...prev, savedFile]);
    }
  };

  const downloadFile = async (file) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/apis/files/download/${file.id}`, {
        method: "GET",
      });
      if (!response.ok) {
        alert("Failed to download file!");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Error while downloading file");
    }
  };

  const deleteFile = async (file) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/apis/files/delete/${file.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Could not delete file");
      } else {
        setFiles((prev) => prev.filter(f => f.id !== file.id));
        alert("File deleted successfully");
      }
    } catch (error) {
      console.log(error);
      alert("Could not delete file");
    }
  };

  
     const handleSearchChange = (event)=>{
         setSearchText(event.target.value);
      }


  return (
    <div className='container'>
      <div className='sidebar'>
        <Link onClick={showonScreen}><FontAwesomeIcon icon={faPlus} /> NEW</Link>
        <br />
        <Link><FontAwesomeIcon icon={faHouse} /> Home</Link>
        <br />
        <Link><FontAwesomeIcon icon={faFile} /> My Drive</Link>
        <br />
        <Link><FontAwesomeIcon icon={faShare} /> Shared with me</Link>
        <br />
        <Link><FontAwesomeIcon icon={faClock} /> Recent</Link>
        <br />
        <Link><FontAwesomeIcon icon={faStar} /> Starred</Link>
        <br />
        <Link><FontAwesomeIcon icon={faTrash} /> Trash</Link>
        <br />
        <Link><FontAwesomeIcon icon={faCloud} /> Storage</Link>
      </div>
      <div className="home">
        <nav>
          <Link><FontAwesomeIcon icon={faMagnifyingGlass } /><input type="text" 
          placeholder='Search in Drive'
             value={searchText}
          onChange={handleSearchChange}   
           /></Link>
        </nav>

        <div className='screen'>
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                padding: "10px",
                margin: "10px",
               backgroundColor: searchText && file.name.toLowerCase().includes(searchText.toLowerCase())
                  ? "lightgreen"  
                  : "lightblue",
                borderRadius: "5px",
                boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{file.name}</span>
              <div style={{ display: "flex", gap: "15px" }}>
                <FontAwesomeIcon
                  icon={faArrowDown}
                  style={{
                    cursor: "pointer",
                    color: "green",
                    fontSize: "18px",
                    transition: "transform 0.2s",
                  }}
                  onClick={() => downloadFile(file)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{
                    cursor: "pointer",
                    color: "red",
                    fontSize: "18px",
                    transition: "transform 0.2s",
                  }}
                  onClick={() => deleteFile(file)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                />
              </div>
            </div>
                
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default Drive;
