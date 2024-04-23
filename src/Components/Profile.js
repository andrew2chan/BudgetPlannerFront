import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchPut } from '../HelperLib/fetch';
import { returnConnectionString } from '../HelperLib/connection';

const Profile = () => {
    const userData = useSelector(state => state.user.userData);
    const [formInputs, updateFormInputs] = useState({
        "name": "",
        "email": "",
        "password": ""
    });
    const [serverMessage, updateServerMessage] = useState("");

    useEffect(() => {
        updateFormInputs(prevState => ({
            ...prevState,
            "name": userData.name,
            "email": userData.email
        }));
    },[userData])

    const handleChangeEvent = (e) => {
        let obj = {
            ...formInputs
        }

        obj[e.target.id] = e.target.value;

        updateFormInputs(obj);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let opt = {
            "Id": userData.id,
            "Name": formInputs.name,
            "Email": formInputs.email
        }

        if(formInputs.password.trim().length > 0) opt["password"] = formInputs.password;

        fetchPut(returnConnectionString() + "/api/User", opt)
        .then((res) => {
            if(!res.Error) {
                updateServerMessage("Successfully updated data.");

                return;
            }

            updateServerMessage("There was a problem updating your data. Please check your inputs again or try again later.")
        });
    }

    return (
        <>
            <section>
                <header className="text-2xl font-bold py-4">Edit your information</header>
                <section className="border rounded-sm px-2 py-3 drop-shadow my-3">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 grid-row gap-5 items-center">
                            <label htmlFor="name">Name:</label>
                            <input type="text" className="border rounded-lg max-h p-2 w-full" id="name" value={formInputs.name} onChange={handleChangeEvent}></input>
                            <label htmlFor="email">Email:</label>
                            <input type="text" className="border rounded-lg max-h p-2 w-full" id="email" value={formInputs.email} onChange={handleChangeEvent}></input>
                            <label htmlFor="password">Password:</label>
                            <input type="password" className="border rounded-lg max-h p-2 w-full" id="password" value={formInputs.password} onChange={handleChangeEvent}></input>
                            <span></span>
                            <input type="Submit" value="Update" className="border rounded-lg max-h p-2 w-full bg-black text-white"></input>
                        </div>
                    </form>
                </section>
                <div>{serverMessage}</div>
            </section>
        </>
    )
}

export default Profile;