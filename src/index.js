import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import Login from './Components/Login';
import Register from './Components/Register';
import LandingPage from './Components/LandingPage';
import SlidingNavbar from './Components/SlidingNavbar';

import store from './Redux/store';
import Overview from './Components/Overview';
import Profile from './Components/Profile';

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
      },
      {
        path: "/overview",
        element: <Overview />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
