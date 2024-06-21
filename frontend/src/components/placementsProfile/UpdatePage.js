import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function UpdatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInputFilled, setIsInputFilled] = useState(false); // Track if input is filled

  useEffect(() => {
    setIsInputFilled(!!companyName); // Set isInputFilled based on companyName
  }, [companyName]);

  const handleUpdate = async () => {
    try {
      if (!location.state || !location.state.selectedStudentId) {
        setError('Student ID not provided');
        return;
      }
      
      const studentId = location.state.selectedStudentId;
      const newData = {
        companies: {
          [companyName]: status ? parseInt(status) : null // Convert status to a number if it's not empty
        }
      };
      await axios.put(`http://localhost:4000/coordinator-api/update/${studentId}`, newData);
      alert('Student updated successfully');
      navigate('/coordinator-profile');
    } catch (error) {
      alert('Error updating student');
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      <h1>Update Student</h1>
      <div>
        <label>Company Name:</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required/>
      </div>
      <button onClick={handleUpdate} disabled={!isInputFilled}>Update</button> 
    </div>
  );
}

export default UpdatePage;
