import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';

const SlidingNavbar = ({menustate, handlemenuclick}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(menustate === "menu") { //this means that menu is not open
            d3.select("#sidebar")
                .classed("right-invert-full", true)
                .classed("right-0", false)
        }
        else {
            d3.select("#sidebar")
                .classed("right-invert-full", false)
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
        handlemenuclick();
    }

    return (
        <nav className="fixed right-invert-full max-sm:max-w-full w-full transition-all" id="sidebar">
            <ul className="max-w-full overflow-hidden flex flex-col items-center">
                <li className="py-3"><button onClick={handleLoginRegister} id="login">Login</button></li>
                <li className="py-3"><button onClick={handleLoginRegister} id="register">Register</button></li>
            </ul>
        </nav>
    );
}

export default SlidingNavbar;