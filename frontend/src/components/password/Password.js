import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function Password() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isInputFilled, setIsInputFilled] = useState(false);
  useEffect(() => {
    setIsInputFilled(!!password); // Set isInputFilled based on companyName
  }, [password]);


  const handleUpdate = async () => {
    try {
      if (!location.state || !location.state.selectedStudentId) {
        setError('Student ID not provided');
        return;
      }
      
      const studentId = location.state.selectedStudentId;
      const newData = { password: password }; // Wrap password in an object
      await axios.put(`http://localhost:4000/coordinator-api/student-password-update/${studentId}`, newData);
      alert('Student password updated successfully');
      navigate('/coordinator-profile');
    } catch (error) {
      alert('Error updating student');
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      <h1>Update Student Password</h1>
      <div>
        <label>New Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleUpdate} disabled={!isInputFilled}>Update</button> 
      {error && <p>{error}</p>}
    </div>
  );
}

export default Password;
