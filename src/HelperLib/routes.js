import { useState } from 'react';
import { Outlet } from 'react-router';

import Login from '../Components/Login';
import Register from '../Components/Register';
import LandingPage from '../Components/LandingPage';
import SlidingNavbar from '../Components/SlidingNavbar';

import Dashboard from '../Components/Dashboard';
import Profile from '../Components/Profile';

import App from '../App';

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

const routes = [
    {
      path: "/",
      element: <NavBarWrapper />,
      children: [
        {
          path: '/',
          element: <LandingPage />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "/dashboard",
          children: [
            {
              index: true,
              element: <Dashboard />
            },
            {
              path: 'profile',
              element: <Profile />
            }
          ]
        },
      ]
    }
  ];

export {routes}