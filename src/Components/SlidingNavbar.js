import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';

const SlidingNavbar = ({ menustate, updatemenustate }) => {
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

    const handleCloseSidebar = () => {
        updatemenustate("menu");
    }

    return (
        <nav className="fixed -right-full max-sm:max-w-full w-full h-screen top-0 bg-white transition-all" id="sidebar">
            <div className="flex flex-col">
                <span className="material-symbols-outlined max-sm:text-4xl self-end" onClick={handleCloseSidebar}><button>close</button></span>
                <ul className="max-w-full overflow-hidden flex flex-col items-center">
                    <li className="py-3 border-b-2"><button onClick={handleLoginRegister} id="login">Login</button></li>
                    <li className="py-3 border-b-2"><button onClick={handleLoginRegister} id="register">Register</button></li>
                </ul>
            </div>
            
        </nav>
    );
}

export default SlidingNavbar;