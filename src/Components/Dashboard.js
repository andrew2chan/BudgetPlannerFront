import React from "react";
import Profile from "./Profile";

import { useSelector } from 'react-redux';

const Dashboard = () => {
    const budgetItems = useSelector(state => state.user.userData);

    return (
        <>
            <main className="flex flex-col w-11/12 mx-auto mt-4">
                <header className="text-3xl font-bold font-roboto py-4">
                    Overview
                </header>
                <section className="border rounded-sm px-2 py-3 drop-shadow my-3">
                    <div className="grid grid-cols-2 grid-row gap-5 items-center">
                        {
                            budgetItems.budgetItems.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <label htmlFor={item.budgetItemName}>{item.budgetItemName}</label>
                                        <input type="number" id={item.budgetItemName} value={item.budgetItemCost} className="border rounded-lg max-h p-2 w-full"></input>
                                    </React.Fragment>
                                )
                            })
                        }
                        <span></span>
                        <hr></hr>
                        <label htmlFor="totalBudget">Total monthly budget:</label>
                        <input type="number" id="totalBudget" value={budgetItems.monthlyIncome} className="border rounded-lg max-h p-2 w-full"></input>
                    </div>
                </section>
                <section>
                    This is the section for the pie graph
                </section>
            </main>
        </>
    )
}

export default Dashboard;