import React, { useState, useContext } from 'react';
import { loginContext } from '../../contexts/LoginContextProvider';
import './Studentprofile.css'; // Import the CSS file

function StudentProfile() {
  // Access the login context
  const { currentUserDetails } = useContext(loginContext);

  // Extract student details
  const { name, rollno, email, mobile, companies } = currentUserDetails.currentUser;

  // State variables for sorting and searching
  const [sortColumn, setSortColumn] = useState('');
  const [sortBy, setSortBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedCompanies, setSortedCompanies] = useState([...Object.entries(companies)]);

  // Function to toggle sorting order
  const toggleSort = (column) => {
    if (sortColumn === column) {
      setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortBy('asc');
    }
    setSortedCompanies(sortedCompanies.reverse());
  };

  // Function to handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filteredCompanies = Object.entries(companies).filter(([companyName]) =>
      companyName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSortedCompanies(filteredCompanies);
  };

  return (
    <div className="student-profile-container">
      <div className="header">
        <h1>Student Profile</h1>
      </div>
      <div className="info">
        <div className="info-item">
          <p><strong>Name:</strong> {name}</p>
        </div>
        <div className="info-item">
          <p><strong>Roll Number:</strong> {rollno}</p>
        </div>
        <div className="info-item">
          <p><strong>Email:</strong> {email}</p>
        </div>
        <div className="info-item">
          <p><strong>Mobile:</strong> {mobile}</p>
        </div>
      </div>
      <div className="search-box">
        <input type="text" placeholder="Search company..." value={searchTerm} onChange={handleSearch} />
      </div>
      <div className="companies">
        <h2 className='companies-heading'>Companies</h2>
        {sortedCompanies && sortedCompanies.length > 0 ? (
          <table className="companies-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('sno')}>
                  Sno {sortColumn === 'sno' && (sortBy === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => toggleSort('company')}>
                  Company Name {sortColumn === 'company' && (sortBy === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => toggleSort('status')}>
                  Status {sortColumn === 'status' && (sortBy === 'asc' ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map(([companyName, status], index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{companyName}</td>
                  <td>
                    {status > 0 ? (
                      <button className="accepted">Accepted</button>
                    ) : status < 0 ? (
                      <button className="rejected">Rejected</button>
                    ) : (
                      <button className="applied">Just Applied</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No companies</p>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;
