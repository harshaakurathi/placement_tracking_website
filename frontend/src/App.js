import React from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './RootLayout'
import Home from './components/home/Home'
import StudentProfile from './components/studentprofile/StudentProfile'
import CoordinatorProfile from './components/coordinatorprofile/CoordinatorProfile'
import Signup from './components/signup/Signup'
import Signin from './components/signin/Signin'
import UpdatePage from './components/placementsProfile/UpdatePage' // Import the UpdatePage component
import FileUpload from './components/csv/FileUpload'
import Password from './components/password/Password'
import PlacementProfile from './components/placementsProfile/PlacementsProfile'

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: '',
      element: <RootLayout />,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: "signup",
          element: <Signup />
        },
        {
          path: "signin",
          element: <Signin />
        },
        {
          path: 'student-profile',
          element: <StudentProfile />
        },
        {
          path: 'coordinator-profile',
          element: <CoordinatorProfile />
        },
        // Add the update route
        {
          path: 'update', // Specify the dynamic parameter for the student ID
          element: <UpdatePage />
        },
        {
          path:'upload',
          element:<FileUpload/>
        },{
          path:'changepassword',
          element:<Password/>
        }
      ]
    }
  ])
  return (
    <RouterProvider router={browserRouter} />
  )
}

export default App
