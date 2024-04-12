import React from "react";
import Profile from "./Profile";

import { returnConnectionString } from '../HelperLib/connection';
import { updateUserBudgetItems } from '../Redux/Slices/UserSlice';
import { fetchPut } from "../HelperLib/fetch";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Dashboard = () => {
    const dispatch = useDispatch();
    const budgetItems = useSelector(state => state.user.userData);
    const [currentBudgetItemList, updateCurrentBudgetItemList] = useState({});
    const [additionalOptions, updateAdditionalOptions] = useState([]);
    const [indexCounter, updateIndexCounter] = useState(0);

    useEffect(() => {
        updateCurrentBudgetItemList(budgetItems); //update this once our budgetItems is loaded

        if(Object.keys(budgetItems).length > 0 && budgetItems.budgetItems.length > 0) updateIndexCounter(budgetItems.budgetItems[budgetItems.budgetItems.length-1].id + 1); //set the initial counter to whatever is next after the last id
    },[budgetItems]);

    const handleAddNewItem = () => {
        updateAdditionalOptions([ ...additionalOptions, {id: indexCounter, label: '', cost: '' } ]); //add more boxes
        updateIndexCounter(indexCounter + 1);
    }

    const handleCostChangeExisting = (e) => {
        let updateBudgetCostExisting = currentBudgetItemList.budgetItems.map((item) => {
            if(parseInt(item.id) === parseInt(e.target.dataset.index)) {
                return { ...item, budgetItemCost: e.target.value };
            }
            return item;
        });

        let finalUpdateItem = {
            ...budgetItems,
            budgetItems: [ ...updateBudgetCostExisting ]
        }

        updateCurrentBudgetItemList(finalUpdateItem);
    }

    /*
    *   Everytime you lose focus on one of the existing boxes then it updates the backend
    */
    const handleFocusLost = (e) => {
        let specificRecord = currentBudgetItemList.budgetItems.filter((item) => {
            if(parseInt(e.target.dataset.index) === parseInt(item.id)) return true;
            return false;
        })

        let opt = {
            ...specificRecord[0]
        };

        fetchPut(returnConnectionString() + "/api/BudgetItem", opt)
        .then((res) => {
            if(!res.Error) {
                dispatch(updateUserBudgetItems(opt));
                return;
            }

            console.log(res);
        })
    }

    const handleRemoveAdditionalOption = (e) => {
        let removeAdditionalOption = additionalOptions.filter((item) => {
            return parseInt(item.id) !== parseInt(e.target.id);
        });

        updateAdditionalOptions(removeAdditionalOption);
    }

    const handleLabelChange = (e) => {
        let newObj = additionalOptions.map((item, index) => {
            if(parseInt(item.id) === parseInt(e.target.dataset.index)) {
                return { ...item, 'label': e.target.value };
            }
            return item;
        });

        updateAdditionalOptions(newObj);
    }

    const handleCostChange = (e) => {
        let newObj = additionalOptions.map((item, index) => {
            if(parseInt(item.id) === parseInt(e.target.dataset.index)) {
                return { ...item, 'cost': e.target.value };
            }
            return item;
        });

        updateAdditionalOptions(newObj);
    }

    return (
        <>
            <main className="flex flex-col w-11/12 mx-auto mt-4">
                <header className="text-3xl font-bold py-4">
                    Overview
                </header>
                <section className="border rounded-sm px-2 py-3 drop-shadow my-3">
                    <div className="grid grid-cols-2 grid-row gap-5 items-center">
                        {
                            currentBudgetItemList !== undefined && currentBudgetItemList.budgetItems ? currentBudgetItemList.budgetItems.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <label htmlFor={item.budgetItemName} data-index={item.id}>{item.budgetItemName}</label>
                                        <span className="flex items-center">
                                            <input type="number" data-index={item.id} value={item.budgetItemCost} onChange={handleCostChangeExisting} onBlur={handleFocusLost} className="border rounded-lg max-h p-2 w-full"></input>
                                            <span className="material-symbols-outlined" id={item.id}>delete</span>
                                        </span>
                                    </React.Fragment>
                                )
                            })
                            :
                            <></>
                        }
                        {
                            additionalOptions.length > 0 && additionalOptions.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <input type="text" className="border rounded-lg max-h p-2 w-full" placeholder="Label" value={item.label} onChange={handleLabelChange} data-index={item.id}></input>
                                        <span className="flex items-center">
                                            <input type="number" className="border rounded-lg max-h p-2 w-full" placeholder="Value" valie={item.cost} onChange={handleCostChange} data-index={item.id}></input>
                                            <span className="flex">
                                                <span className="material-symbols-outlined">add</span>
                                                <span className="material-symbols-outlined" id={item.id} onClick={handleRemoveAdditionalOption}>delete</span>
                                            </span>
                                        </span>
                                    </React.Fragment>
                                )   
                            })
                        }
                        <input type="button" className="border rounded-lg max-h p-2 w-full bg-black text-white" value="Add item" onClick={handleAddNewItem}></input>
                        <span></span>
                        <span></span>
                        <hr></hr>
                        <label htmlFor="totalBudget">Total monthly budget:</label>
                        <input type="number" id="totalBudget" value={currentBudgetItemList !== undefined ? currentBudgetItemList.monthlyIncome : 0} className="border rounded-lg max-h p-2 w-full"></input>
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