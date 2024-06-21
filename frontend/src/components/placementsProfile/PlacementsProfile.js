import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './PlacementProfile.css'; // Import CSS file for styling
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

function PlacementProfile() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // State to hold filtered students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedRollno, setSelectedRollno] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold search query
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search query
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollno.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.mobile.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/coordinator-api/placements');
      setStudents(response.data.payload);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Error fetching student details');
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleUpdateButtonClick = (rollno) => {
    setSelectedRollno(rollno);
  };

  const handleAdditionalButtonClick = async (rollno, companyName, status, email) => {
    try {
      if (!rollno) {
        setError('Selected student not found');
        return;
      }

      const newData = {
        companies: {
          [companyName]: status ? parseInt(status) : null
        }, email, companyName, status
      };

      await axios.put(`http://localhost:4000/coordinator-api/update/${rollno}`, newData);
      alert('Student updated successfully');
      await fetchStudents(); // Fetch updated data
    } catch (error) {
      alert('Error updating student');
      console.error('Error updating student:', error);
    }
  };

  const handleAddButtonClick = async (rollno) => {
    // Handle the add button click here
    console.log('Add button clicked for rollno:', rollno);
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="placement-profile-container">
      
      <h1 >Student Profiles</h1>
      <button onClick={() => { navigate('/upload') }}>Upload</button>
      <div className="search-box-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-box"
        />
      </div>
      <table id="placement-table" className="placement-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')}>
              <span>Name</span>
              {sortConfig.key === 'name' && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th onClick={() => requestSort('rollno')}>
              <span>Roll Number</span>
              {sortConfig.key === 'rollno' && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th onClick={() => requestSort('email')}>
              <span>Email</span>
              {sortConfig.key === 'email' && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th onClick={() => requestSort('mobile')}>
              <span>Mobile Number</span>
              {sortConfig.key === 'mobile' && (
                <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
            <th>Company Name & Status</th>
            <th>Add</th> 
            {/* New column for Add button */}
            <th>Change Password</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, index) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollno}</td>
              <td>{student.email}</td>
              <td>{student.mobile}</td>
              <td>
                {Object.keys(student.companies).length > 0 ? (
                  Object.entries(student.companies).map(([companyName, status], index) => (
                    <div key={index} className="company-info" style={{ padding: '5px' }}>
                      <div>
                        {companyName} -
                        <span className={`status-button ${status > 0 ? 'accepted' : status < 0 ? 'rejected' : 'pending'}`}>
                          {status > 0 ? 'Accepted' : status < 0 ? 'Rejected' : 'Pending'}
                          {status == null ? (
                            <span style={{ backgroundColor: 'grey' }}>
                              <button onClick={() => handleUpdateButtonClick(student.rollno)}>
                                Update
                              </button>
                              {selectedRollno === student.rollno && (
                                <>
                                  <button onClick={() => handleAdditionalButtonClick(student.rollno, companyName, 1, student.email)}>
                                    <AiOutlineCheck />
                                  </button>
                                  <button onClick={() => handleAdditionalButtonClick(student.rollno, companyName, -1, student.email)}>
                                    <AiOutlineClose />
                                  </button>
                                </>
                              )}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No companies</div>
                )}
              </td>
              <td>
                <button onClick={() => {
                  console.log('Selected Student Roll Number:', student.rollno);
                  navigate('/update', { state: { selectedStudentId: student.rollno } });
                }}>Add</button>
              </td> {/* Add button for each cell */}
              <td><button onClick={()=>{navigate('/changepassword',{state: { selectedStudentId: student.rollno }})}}>Click to change password</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlacementProfile;
