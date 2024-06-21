import { createContext, useState } from "react";
import axios from "axios";

//create context obj
export const loginContext = createContext();

function LoginProvider({ children }) {
  let [currentUserDetails, setCurrentUserDetails] = useState({
    userLoginStatus: false,
    currentUser: {},
    err: "",
  });

  async function loginUser(credObj) {
    if (credObj.role === "student") {
      let res = await axios.post(
        "http://localhost:4000/student-api/login",
        credObj
      );

      console.log(res);
      if (res.data.message === "Login Successfully") {
        //navigate to user profile
        console.log("student logged in");
        sessionStorage.setItem('token',res.data.token)

        setCurrentUserDetails({
          ...currentUserDetails,
          currentUser: res.data.user,
          userLoginStatus: true,
        });
      } else {
        setCurrentUserDetails({
          ...currentUserDetails,
          err: res.data.message,
          userLoginStatus: false,
          currentUser: {},
        });
      }
    }
    if (credObj.role === "coordinator") {
        let res = await axios.post(
          "http://localhost:4000/coordinator-api/login",
          credObj
        );
  
        console.log(res);
        if (res.data.message === "Login Successfully") {
          //navigate to user profile
          console.log("coordinator logged in");
            sessionStorage.setItem('token',res.data.token)
          setCurrentUserDetails({
            ...currentUserDetails,
            currentUser: res.data.user,
            userLoginStatus: true,
          });
        } else {
          setCurrentUserDetails({
            ...currentUserDetails,
            err: res.data.message,
            userLoginStatus: false,
            currentUser: {},
          });
        }
      }
  }

  return (
    <loginContext.Provider value={{ currentUserDetails, setCurrentUserDetails,loginUser }}>
      {children}
    </loginContext.Provider>
  );
}

export default LoginProvider;