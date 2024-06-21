// FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';
import { AiOutlineArrowUp, AiOutlineCheck } from "react-icons/ai";

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [message1, setMessage1] = useState('');
    const [message2, setMessage2] = useState('');
    const [fileSelected1, setFileSelected1] = useState(false); // Track if file is selected for box 1
    const [fileSelected2, setFileSelected2] = useState(false); // Track if file is selected for box 2
    const [fileSelected3, setFileSelected3] = useState(false); // Track if file is selected for box 3

    const handleFileChange1 = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileSelected1(true); // Set fileSelected to true when file is selected
        clearMessages(); // Clear messages when file is selected
    };
    
    const handleFileChange2 = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileSelected2(true); // Set fileSelected to true when file is selected
        clearMessages(); // Clear messages when file is selected
    };
    
    const handleFileChange3 = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileSelected3(true); // Set fileSelected to true when file is selected
        clearMessages(); // Clear messages when file is selected
    };
    
    const clearMessages = () => {
        setMessage('');
        setMessage1('');
        setMessage2('');
    };

    
    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post(`http://localhost:4000/coordinator-api/process-csv/${1}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setMessage(response.data.message);
                alert('File uploaded successfully');
            } catch (error) {
                setMessage('Error uploading file');
                console.error('Error uploading file:', error);
            }
        } else {
            setMessage('Please select a file to upload');
        }
    };
    const handleUpload2 = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post(`http://localhost:4000/coordinator-api/process-csv-pending/${null}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setMessage2(response.data.message);
                alert('File uploaded successfully');
            } catch (error) {
                setMessage2('Error uploading file');
                console.error('Error uploading file:', error);
            }
        } else {
            setMessage2('Please select a file to upload');
        }
    };

    const handleUpload1 = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post(`http://localhost:4000/coordinator-api/process-csv-rejected/${-1}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                }
                });
                setMessage1(response.data.message);
                alert('File uploaded successfully');
            } catch (error) {
                setMessage1('Error uploading file');
                console.error('Error uploading file:', error);
                
            }
        } else {
            setMessage1('Please select a file to upload');
        }
    };
    const handleClick = () => {
        document.getElementById('fileInput2').click(); // Target file input for box 2
    };

    const handleClick1 = () => {
        document.getElementById('fileInput3').click(); // Target file input for box 3
    };

    const handleClick2 = () => {
        document.getElementById('fileInput1').click(); // Target file input for box 1
    };

    return (
        <div className="file-upload-container">
            <div className="file-upload-box">
                <p>Click to update Placement Applied students</p>
                <input type="file" id="fileInput1" style={{ display: 'none' }} onChange={handleFileChange1} />
                <button className="file-upload-button1" onClick={handleClick2}>Select File</button>
                <button className="file-upload-button1" onClick={handleUpload2}><AiOutlineArrowUp />  Upload</button>
                {fileSelected1 && <AiOutlineCheck className="check-icon" />} {/* Display check icon if file is selected */}
                {message2 && <p className="message">{message2}</p>}
            </div>
            
            <div className="file-upload-box">
                <p>Click to upload Accepted students</p>
                <input type="file" id="fileInput2" style={{ display: 'none' }} onChange={handleFileChange2} />
                <button className="file-upload-button" onClick={handleClick}><AiOutlineArrowUp />Select File</button>
                <button className="file-upload-button" onClick={handleUpload}><AiOutlineArrowUp />Upload</button>
                {fileSelected2 && <AiOutlineCheck className="check-icon" />} {/* Display check icon if file is selected */}
                {message && <p className="message">{message}</p>}
            </div>

            <div className="file-upload-box">
                <p>Click to update Placement Rejected students</p>
                <input type="file" id="fileInput3" style={{ display: 'none' }} onChange={handleFileChange3} />
                <button className="file-upload-button2" onClick={handleClick1}>Select File</button>
                <button className="file-upload-button2" onClick={handleUpload1}><AiOutlineArrowUp />  Upload</button>
                {fileSelected3 && <AiOutlineCheck className="check-icon" />} {/* Display check icon if file is selected */}
                {message1 && <p className="message">{message1}</p>}
            </div>
        </div>
    );
};

export default FileUpload;
