import * as d3 from 'd3';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const PieChart = () => {
    const userData = useSelector(state => state.user.userData);
    const [colorPicker, updateColorPicker] = useState([]);

    useEffect(() => {
        console.log(userData);
        let listOfBudgetItems = userData.budgetItems;
        let newListOfColors = [];

        for(let i = 0; i < listOfBudgetItems.length; i++) {
            newListOfColors.push("rgb(" + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ")");
        }

        //console.log(newListOfColors);
    },[userData]);

    const calculateRandomNumber = (max) => {
        return Math.floor(Math.random() * max);
    }

    return(
        <svg className="w-full">
            <circle cx="0" cy="0" r="20"></circle>
        </svg>
    )
}

export default PieChart;