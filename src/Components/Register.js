import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import { fetchPost } from '../HelperLib/fetch';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const [passwordVisible, updatePasswordVisible] = useState(false);
    const [showTextOrPassword, updateShowTextOrPassword] = useState("password");
    const [errorMessageShown, updateErrorMessageShown] = useState("");

    const [loginEmail, updateLoginEmail] = useState('');
    const [loginPass, updateLoginPass] = useState('');
    const [loginName, updateLoginName] = useState('');

    useEffect(() => {
        d3.selectAll("input[type=text],input[type=password]")
            .on("focus", (e) => {
                if(e.target.value) return; //if there is text in the input then don't change the css

                let span = d3.select(e.target.parentNode).select("span");

                span
                    .classed("top-1", false)
                    .classed("-top-2.5", true)
                    .classed("border", true)
                    .classed("border-black", true)
                    .classed("bg-white", true)
                    .classed("text-md", false)
                    .classed("text-xs", true)
                    .classed("left-4", false)
                    .classed("left-2", true)
                    .classed("px-1", true)
            })
            .on("blur", (e) => {
                if(e.target.value) return; //if there is text in the input then don't change the css

                let span = d3.select(e.target.parentNode).select("span");

                span
                    .classed("top-1", true)
                    .classed("-top-2.5", false)
                    .classed("border", false)
                    .classed("border-black", false)
                    .classed("bg-white", false)
                    .classed("text-md", true)
                    .classed("text-xs", false)
                    .classed("left-4", true)
                    .classed("left-2", false)
                    .classed("px-1", false)
            });
    },[])

    useEffect(() => {
        !passwordVisible ? updateShowTextOrPassword("password") : updateShowTextOrPassword("text"); //toggle between visible password or not
    }, [passwordVisible]);

    const handleVisible = () => {
        updatePasswordVisible(!passwordVisible);
    }

    const handleLoginEmail = (e) => {
        updateLoginEmail(e.target.value);
    }

    const handleLoginPass = (e) => {
        updateLoginPass(e.target.value);
    }

    const handleLoginName = (e) => {
        updateLoginName(e.target.value);
    }

    const handleDataSubmit = (e) => {
        e.preventDefault();

        let email = loginEmail;
        let pass = loginPass;
        let name = loginName;

        submitData(email, pass, name)
    }

    const submitData = (email, pass, name) => {
        let opt = {
            "email": email,
            "password": pass,
            "name": name,
            "monthlyIncome": 0,
            "budgetItems": []
        }

        fetchPost("https://localhost:7054/api/User", opt)
        .then((res) => {
            if(!res.Error) {
                navigate("/login");
            }

            //only goes here if we have an error
            updateErrorMessageShown(res.Error);
        })
    }

    return(
        <main className="h-[calc(100vh-theme('spacing.16'))] max-sm:px-4">
            <form onSubmit={handleDataSubmit}>
                <div className="flex flex-col pt-10 gap-5">
                    <div>
                        <div className="max-sm:text-2xl max-sm:font-medium flex-initial">Register</div>
                        <div className="text-md">Register by filling out the fields below</div>
                    </div>
                    <div className="relative">
                        <input type="text" className="border rounded-md border-gray-600 p-1 bg-slate-50 w-full" name="name" onChange={handleLoginName} value={loginName} required></input>
                        <span className="absolute left-4 top-1 pointer-events-none text-md transition-all">Name</span>
                    </div>
                    <div className="relative">
                        <input type="text" className="border rounded-md border-gray-600 p-1 bg-slate-50 w-full" onChange={handleLoginEmail} value={loginEmail} name="email" required></input>
                        <span className="absolute left-4 top-1 pointer-events-none text-md transition-all">Email</span>
                    </div>
                    <div className="relative">
                        <input type={showTextOrPassword} className="border rounded-md border-gray-600 p-1 bg-slate-50 w-full" onChange={handleLoginPass} value={loginPass} name="password" required></input>
                        <span className="absolute left-4 top-1 pointer-events-none text-md transition-all">Password</span>
                        <span className="material-symbols-outlined absolute right-3 top-1 cursor-pointer" onClick={handleVisible}>{!passwordVisible ? "visibility_off" : "visibility"}</span>
                    </div>
                    <input type="submit" className="border bg-blue-600 text-white rounded-2xl py-2 w-full hover:shadow-[inset_0_0_10px_8px_theme('colors.blue.800')]"></input>
                </div>
                <div className={errorMessageShown !== "" ? "visible text-red-600" : "hidden"}>{errorMessageShown}</div>
            </form>
        </main>
    )
}

export default Register;