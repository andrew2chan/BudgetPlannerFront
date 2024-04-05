import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { clearUserData } from "../Redux/Slices/UserSlice";
import * as d3 from 'd3';

const SlidingNavbar = ({ menustate, updatemenustate }) => {
    const dispatch = useDispatch();

    const userData = useSelector(state => state.user.userData);

    const navigate = useNavigate();

    useEffect(() => {
        if(menustate === "menu") { //this means that menu is not open
            d3.select("#sidebar")
                .classed("-right-full", true)
                .classed("right-0", false)
        }
        else {
            d3.select("#sidebar")
                .classed("-right-full", false)
                .classed("right-0", true)
        }
    },[menustate])

    const handleLoginRegister = (e) => {
        switch(e.target.id) {
            case 'login':
                navigate("/login");
                break;
            default:
                navigate("/register");
        }
        updatemenustate("menu");
    }

    const handleLoggedInSidebar = (e) => {
        switch(e.target.id) {
            case 'logout':
                dispatch(clearUserData());
                navigate("/");
                break;
            default:
                navigate("/");
        }
        updatemenustate("menu");
    }

    const handleCloseSidebar = () => {
        updatemenustate("menu");
    }

    return (
        <nav className="fixed -right-full max-sm:max-w-full w-full h-screen top-0 bg-white transition-all" id="sidebar">
            {
                Object.keys(userData).length === 0 ? (
                    <div className="flex flex-col">
                        <span className="material-symbols-outlined max-sm:text-4xl self-end" onClick={handleCloseSidebar}><button>close</button></span>
                        <ul className="max-w-full overflow-hidden flex flex-col items-center">
                            <li className="py-3 border-b-2"><button onClick={handleLoginRegister} id="login">Login</button></li>
                            <li className="py-3 border-b-2"><button onClick={handleLoginRegister} id="register">Register</button></li>
                        </ul>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <span className="material-symbols-outlined max-sm:text-4xl self-end" onClick={handleCloseSidebar}><button>close</button></span>
                        <ul className="max-w-full overflow-hidden flex flex-col items-center">
                            <li className="py-3 border-b-2"><button>Overview</button></li>
                            <li className="py-3 border-b-2"><button>Profile</button></li>
                            <li className="py-3 border-b-2"><button onClick={handleLoggedInSidebar} id="logout">Logout</button></li>
                        </ul>
                    </div>
                )
            }
        </nav>
    );
}

export default SlidingNavbar;