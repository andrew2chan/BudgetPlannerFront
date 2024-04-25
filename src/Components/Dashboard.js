import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { returnConnectionString } from '../HelperLib/connection';
import { updateUserBudgetItems, updateUserData } from '../Redux/Slices/UserSlice';
import { fetchPut, fetchPost, fetchDelete } from "../HelperLib/fetch";

import PieChart from "./PieChart";

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
                    ...currentBudgetItemList,
                    budgetItems: findExistingBudgetItem
                }

                //updateCurrentBudgetItemList(finalUpdateItem);
                dispatch(updateUserData(finalUpdateItem));

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
            ...currentBudgetItemList,
            budgetItems: [ ...newCurrentBudgetItemList ]
        }

        //updateCurrentBudgetItemList(finalUpdateItem);
        dispatch(updateUserData(finalUpdateItem));

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
                return { ...item, budgetItemCost: 0 || parseTo2Digits(e.target.value) };
            }
            return item;
        });

        let finalUpdateItem = {
            ...currentBudgetItemList,
            budgetItems: [ ...updateBudgetCostExisting ]
        }

        //updateCurrentBudgetItemList(finalUpdateItem);
        dispatch(updateUserData(finalUpdateItem));

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
                return { ...item, 'cost': parseTo2Digits(e.target.value) };
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
            monthlyIncome: parseTo2Digits(e.target.value)
        }
        
        //updateCurrentBudgetItemList(newBudget);
        dispatch(updateUserData(newBudget));
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

   const parseTo2Digits = (val) => {
        let inputValue = (val).toString().replace(/[^0-9.]|(?<=\..*)\./g, ''); //replace all non-numerics with blanks and only 1 decimal value [^0-9.] - replaces all that isn't a number or . / (?<=\..*)\. replaces anytime a . has another dot before IE. 2.2. will match the second period

        const decimalDelimit = inputValue.indexOf("."); // looks for 1 decimal
        if(decimalDelimit !== -1) {
            inputValue = inputValue.slice(0, decimalDelimit + 3); //takes everything up to 3 spots after
        }

        return inputValue;
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
                                            <input type="text" data-index={item.id} value={item.budgetItemCost} onChange={handleCostChangeExisting} onBlur={handleFocusLostExisting} className="border rounded-lg max-h p-2 w-full"></input>
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
                        <input type="text" id="totalBudget" value={currentBudgetItemList.monthlyIncome} className="border rounded-lg max-h p-2 w-full" onChange={handleMonthlyIncomeUpdate} onBlur={handleFocusLostMonthly}></input>
                    </div>
                </section>
                <section>
                    <PieChart />
                </section>
            </main>
        </>
    )
}

export default Dashboard;