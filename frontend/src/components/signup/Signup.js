import { useState } from "react";
import "./Signup.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Signup() {
  let { register, handleSubmit } = useForm();
  let [err,setErr]=useState('')
  const navigate = useNavigate();

  async function onRegister(obj) {
    console.log(obj)
    if(obj.role==='student'){
      let res=await axios.post('http://localhost:4000/student-api/register',obj)
      console.log(res.data.message)
      if(res.data.message==="new student created"){
        console.log('student registration successful')
        navigate('/signin')
        setErr('')
      }else{
        setErr(res.data.message)
      }
    }
    if(obj.role==='coordinator'){
      let res=await axios.post('http://localhost:4000/coordinator-api/register',obj)
      console.log(res.data.message)
      if(res.data.message==="new coordinator created"){
        console.log('coordinator registration successful')
        navigate('/signin')
        setErr('')
      }else{
        setErr(res.data.message)
      }
    }
  }

  return (
    <div>
      <p className="display-3 text-center text-info">SignUp</p>
      {err.length!==0 && <p className="text-danger text-center fs-4">{err}</p>}
      <form className="w-50 bg-light p-3 m-auto mt-5" onSubmit={handleSubmit(onRegister)}>
        {/* two radios for user role */}
        <div className="mb-3">
          <label>Register as</label>
          <div className="form-check">
            <input
              type="radio"
              {...register("role")}
              id="student"
              className="form-check-input"
              value="student"
            />
            <label htmlFor="user" className="form-check-label">Student</label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              {...register("role")}
              id="coordinator"
              className="form-check-input"
              value="coordinator"
            />
            <label htmlFor="coordinator" className="form-check-label">Coordinator</label>
          </div>
        </div>
        {/* name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" {...register("name")} id="name" className="form-control" />
        </div>
        {/* roll number */}
        <div className="mb-3">
          <label htmlFor="rollno" className="form-label">Roll Number</label>
          <input type="text" {...register("rollno")} id="rollno" className="form-control" />
        </div>
        {/* email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" {...register("email")} id="email" className="form-control" />
        </div>
        {/* mobile number */}
        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">Mobile Number</label>
          <input type="text" {...register("mobile")} id="mobile" className="form-control" />
        </div>
        {/* password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" {...register("password")} id="password" className="form-control" />
        </div>
        {/* submit button */}
        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </div>
  );
}

export default Signup;
