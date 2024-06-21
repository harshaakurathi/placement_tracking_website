import React, { useContext } from 'react';
import { loginContext } from '../../contexts/LoginContextProvider';
import PlacementProfile from '../placementsProfile/PlacementsProfile';


function CoordinatorProfile() {
  // Access the login context
  const { currentUserDetails } = useContext(loginContext);

  // Extract coordinator details
  const { name, rollno, email, mobile } = currentUserDetails.currentUser;

  return (
    <div>
      <div className="container">
        <h1>Coordinator Profile</h1>
        <div>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Roll Number:</strong> {rollno}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Mobile:</strong> {mobile}</p>
        </div>
        <PlacementProfile/>
      </div>
    </div>
  );
}

export default CoordinatorProfile;
