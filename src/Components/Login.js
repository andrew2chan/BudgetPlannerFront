import * as d3 from 'd3';
import { useEffect } from 'react';

const Login = () => {
    useEffect(() => {
        d3.selectAll("input[type=text]")
            .on("focus", (e) => {
                let span = d3.select(e.target.parentNode).select("span");

                span
                    .classed("top-1", false)
                    .classed("-top-2.5", true)
                    .classed("border", true)
                    .classed("bg-white", true)
                    .classed("text-md", false)
                    .classed("text-xs", true)
                    .classed("left-4", false)
                    .classed("left-2", true)
                    .classed("px-1", true)
            })
            .on("blur", (e) => {
                let span = d3.select(e.target.parentNode).select("span");

                span
                    .classed("top-1", true)
                    .classed("-top-2.5", false)
                    .classed("border", false)
                    .classed("bg-white", false)
                    .classed("text-md", true)
                    .classed("text-xs", false)
                    .classed("left-4", true)
                    .classed("left-2", false)
                    .classed("px-1", false)
            });

    })

    return(
        <main className="h-[calc(100vh-theme('spacing.16'))] max-sm:px-4">
            <div className="flex flex-col pt-10 gap-5">
                <div>
                    <div className="max-sm:text-2xl max-sm:font-medium flex-initial">Hello</div>
                    <div className="text-md">Sign in using your email and password</div>
                </div>
                <div className="relative">
                    <input type="text" className="border rounded-md border-gray-600 p-1 bg-slate-50 w-full"></input>
                    <span className="absolute left-4 top-1 pointer-events-none text-md transition-all">Email</span>
                </div>
                <div className="relative">
                    <input type="text" className="border rounded-md border-gray-600 p-1 bg-slate-50 w-full"></input>
                    <span className="absolute left-4 top-1 pointer-events-none text-md transition-all">Password</span>
                </div>
                <input type="submit" className="border bg-blue-600 text-white rounded-2xl py-2"></input>
            </div>
        </main>
    )
}

export default Login;