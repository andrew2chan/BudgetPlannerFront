import React from "react";

import { returnConnectionString } from '../HelperLib/connection';
import { updateUserBudgetItems } from '../Redux/Slices/UserSlice';
import { fetchPut, fetchPost, fetchDelete } from "../HelperLib/fetch";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Dashboard = () => {
    const dispatch = useDispatch();
    const budgetItems = useSelector(state => state.user.userData);
    const [currentBudgetItemList, updateCurrentBudgetItemList] = useState("");
    const [additionalOptions, updateAdditionalOptions] = useState("");
    const [indexCounter, updateIndexCounter] = useState(0);

    useEffect(() => {
        updateCurrentBudgetItemList(budgetItems); //update this once our budgetItems is loaded

        if(Object.keys(budgetItems).length > 0 && budgetItems.budgetItems.length > 0) updateIndexCounter(budgetItems.budgetItems[budgetItems.budgetItems.length-1].id + 1); //set the initial counter to whatever is next after the last id
    },[budgetItems]);

    /*
    *   adds a new row for additional options
    */
    const handleAddNewItem = () => {
        updateAdditionalOptions([ ...additionalOptions, {id: indexCounter, label: '', cost: '' } ]); //add more boxes
        updateIndexCounter(indexCounter + 1);
    }

    /*
    *   Handles deleting an existing object
    */
   const handleDeleteExisting = (e) => {
        fetchDelete(returnConnectionString() + "/api/BudgetItem/" + e.target.id)
        .then((res) => {
            if(!res.Error) {
                console.log("Deleted: " + e.target.id);

                let findExistingBudgetItem = currentBudgetItemList.budgetItems.filter((item) => parseInt(item.id) !== parseInt(e.target.id));
                let finalUpdateItem = {
                    ...budgetItems,
                    budgetItems: findExistingBudgetItem
                }

                updateCurrentBudgetItemList(finalUpdateItem);

                return;
            }

            console.log(res);
        })
   }

    /*
    *   Handles creating an existing object and deleting an item from the additional list
    */
    const handleAddAdditionalOption = (e) => {
        let findAdditionalOption = additionalOptions.filter((item) => {
            if(parseInt(item.id) === parseInt(e.target.dataset.index)) return true;
            return false;
        })

        let { id, label: budgetItemName, cost: budgetItemCost } = findAdditionalOption[0]; //destructure

        let newBudgetItem = { id, budgetItemName: budgetItemName || "Other", budgetItemCost: budgetItemCost || 0, "userId": budgetItems.id }

        let newCurrentBudgetItemList = [ ...currentBudgetItemList.budgetItems, newBudgetItem ];

        let finalUpdateItem = {
            ...budgetItems,
            budgetItems: [ ...newCurrentBudgetItemList ]
        }

        updateCurrentBudgetItemList(finalUpdateItem);

        fetchPost(returnConnectionString() + "/api/BudgetItem", newBudgetItem) //add the new budget item to the db
        .then((res) => {
            if(!res.Error) {
                let newAdditionalOptions = additionalOptions.filter((item) => parseInt(item.id) !== parseInt(e.target.dataset.index)); // acts as a delete to get rid of the option that was added to the main list
                updateAdditionalOptions(newAdditionalOptions);

                return;
            }

            console.log(res);
        })
    }

    /*
    *   This is for updating the pricing on the front end for display for existing items
    */
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
    const handleFocusLostExisting = (e) => {
        let specificRecord = currentBudgetItemList.budgetItems.filter((item) => {
            if(parseInt(e.target.dataset.index) === parseInt(item.id)) return true;
            return false;
        });

        let opt = {
            ...specificRecord[0]
        };

        console.log(opt);

        fetchPut(returnConnectionString() + "/api/BudgetItem", opt)
        .then((res) => {
            if(!res.Error) {
                dispatch(updateUserBudgetItems(opt));
                return;
            }

            console.log(res);
        })
    }

    /*
    *   This is for when we delete an additional object
    */
    const handleRemoveAdditionalOption = (e) => {
        let removeAdditionalOption = additionalOptions.filter((item) => {
            return parseInt(item.id) !== parseInt(e.target.id);
        });

        updateAdditionalOptions(removeAdditionalOption);
    }

    /*
    *   Handles updating the label for additional options
    */
    const handleLabelChange = (e) => {
        let newObj = additionalOptions.map((item, index) => {
            if(parseInt(item.id) === parseInt(e.target.dataset.index)) {
                return { ...item, 'label': e.target.value };
            }
            return item;
        });

        updateAdditionalOptions(newObj);
    }

    /*
    *   Handles updating the cost for additional options
    */
    const handleCostChange = (e) => {
        let newObj = additionalOptions.map((item, index) => {
            if(parseInt(item.id) === parseInt(e.target.dataset.index)) {
                return { ...item, 'cost': e.target.value };
            }
            return item;
        });

        updateAdditionalOptions(newObj);
    }

    /*
    *   handles what happens when the total monthly income changes
    */
    const handleMonthlyIncomeUpdate = (e) => {
        let newBudget = {
            ...currentBudgetItemList,
            monthlyIncome: e.target.value
        }
        
        updateCurrentBudgetItemList(newBudget);
    }

    /*
    *   handles what happens when we click off of the income
    */
   const handleFocusLostMonthly = (e) => {
        let newMonthlyIncome = {
            "id": currentBudgetItemList.id,
            "monthlyIncome": currentBudgetItemList.monthlyIncome
        }

        fetchPut(returnConnectionString() + "/api/User/monthlyincome", newMonthlyIncome)
        .then((res) => {
            if(!res.Error) {
                console.log("successfully updated user's monthly income");

                return;
            }

            console.log(res.Error);
        })
   }

    return (
        <>
            <main className="flex flex-col w-11/12 mx-auto mt-4">
                <header className="text-2xl font-bold py-4">
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
                                            <input type="number" data-index={item.id} value={item.budgetItemCost? item.budgetItemCost : 0} onChange={handleCostChangeExisting} onBlur={handleFocusLostExisting} className="border rounded-lg max-h p-2 w-full"></input>
                                            <span className="material-symbols-outlined" id={item.id} onClick={handleDeleteExisting}>delete</span>
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
                                            <input type="number" className="border rounded-lg max-h p-2 w-full" placeholder="Value" value={item.cost} onChange={handleCostChange} data-index={item.id}></input>
                                            <span className="flex">
                                                <span className="material-symbols-outlined" data-index={item.id} onClick={handleAddAdditionalOption}>add</span>
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
                        <input type="number" id="totalBudget" value={currentBudgetItemList !== undefined ? currentBudgetItemList.monthlyIncome : 0} className="border rounded-lg max-h p-2 w-full" onChange={handleMonthlyIncomeUpdate} onBlur={handleFocusLostMonthly}></input>
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