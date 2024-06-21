import "./Signin.css";
import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { loginContext } from "../../contexts/LoginContextProvider";

function Signin() {
  let { register, handleSubmit } = useForm();
  let navigate = useNavigate()
  const { currentUserDetails, loginUser } = useContext(loginContext);

  function onLogin(credObj) {
    loginUser(credObj);
  }

  useEffect(() => {
    if (currentUserDetails.currentUser.role === 'student' && currentUserDetails.userLoginStatus === true) {
      navigate('/student-profile');
    }
    if (currentUserDetails.currentUser.role === 'coordinator' && currentUserDetails.userLoginStatus === true) {
      navigate('/coordinator-profile');
    }
  }, [currentUserDetails.userLoginStatus]);

  return (
    <div>
      <p className="display-3 text-center text-info">SignIn</p>
      {currentUserDetails.err.length !== 0 && (
        <p className="text-danger fs-3 text-center">{currentUserDetails.err}</p>
      )}
      <form
        className="w-50 bg-light p-3 m-auto mt-5"
        onSubmit={handleSubmit(onLogin)}
      >
        {/* two radios for user role */}
        <div className="mb-3">
          <label>Signin as</label>
          <div className="form-check">
            <input
              type="radio"
              {...register("role")}
              id="student"
              className="form-check-input"
              value="student"
            />
            <label htmlFor="student" className="form-check-label">
              Student
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              {...register("role")}
              id="coordinator"
              className="form-check-input"
              value="coordinator"
            />
            <label htmlFor="coordinator" className="form-check-label">
              Coordinator
            </label>
          </div>
        </div>
        {/* roll number */}
        <div className="mb-3">
          <label htmlFor="rollno" className="form-label">
            Roll Number
          </label>
          <input
            type="text"
            {...register("rollno")}
            id="rollno"
            className="form-control"
          />
        </div>
        {/* password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            id="password"
            className="form-control"
          />
        </div>
        {/* submit button */}
        <button type="submit" className="btn btn-success">
          Login
        </button>
      </form>
    </div>
  );
}

export default Signin;
