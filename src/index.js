import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import App from './App';
import Login from './Components/Login';
import Register from './Components/Register';
import LandingPage from './Components/LandingPage';
import SlidingNavbar from './Components/SlidingNavbar';

const NavBarWrapper = () => {
  const [menuState, updateMenuState] = useState("menu");

  return (
    <>
      <App updatemenustate={updateMenuState} menustate={menuState} />
      <Outlet />
      <SlidingNavbar updatemenustate={updateMenuState} menustate={menuState} />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBarWrapper />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
