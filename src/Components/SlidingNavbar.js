import { useEffect } from "react";
import * as d3 from 'd3';

const SlidingNavbar = ({menustate}) => {
    useEffect(() => {
        if(menustate === "menu") { //this means that menu is not open
            d3.select("#sidebar")
                //.classed("w-full", false)
                //.classed("w-0", true);
                .classed("right-invert-full", true)
                .classed("right-0", false)
        }
        else {
            d3.select("#sidebar")
                //.classed("w-0", false)
                //.classed("w-full", true);
                .classed("right-invert-full", false)
                .classed("right-0", true)
        }
    },[menustate])

    return (
        <nav className="fixed right-invert-full max-sm:max-w-full w-full transition-all" id="sidebar">
            <ul className="max-w-full overflow-hidden flex flex-col items-center">
                <li className="py-3">YAAAAA</li>
                <li className="py-3">YAAAAA</li>
                <li className="py-3">YAAAAA</li>
                <li className="py-3">YAAAAA</li>
                <li className="py-3">YAAAAA</li>
                <li className="py-3">YAAAAA</li>
                <li className="py-3">YAAAAA</li>
            </ul>
        </nav>
    );
}

export default SlidingNavbar;