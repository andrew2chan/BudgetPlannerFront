import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const PieChart = () => {
    const userData = useSelector(state => state.user.userData);
    const svgElement = useRef();
    const previousUserData = useRef();
    const [localUserData, updateLocalUserData] = useState();
    const [newListOfColors, updateNewListOfColors] = useState([]);

    /*
    *   Updates colors depending on if the length of the existing items changes
    */
    useEffect(() => {
        if(previousUserData.current === undefined || previousUserData.current.budgetItems.length !== userData.budgetItems.length) {
            let newColors = [];
            let listOfBudgetItems = userData.budgetItems;

            for(let i = 0; i < listOfBudgetItems.length; i++) {
                newColors.push("rgb(" + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ")");
            }

            newColors.push("rgb(" + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ")"); // always push 1 more additional color for the free space

            previousUserData.current = userData;

            updateNewListOfColors([ ...newColors ])
        }
        updateLocalUserData(userData);
    },[userData]);

    /*
    *   Creates the pie chart
    */
    useEffect(() => {
        if(localUserData && newListOfColors) {
            let svg = d3.select(svgElement.current);

            svg.selectAll("*").remove(); //remove everything inside the svg

            let width = svg.attr("width");
            let height = svg.attr("height");
            let radius = Math.min(width, height)/2
            let g = svg.append("g").attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

            let color = d3.scaleOrdinal(newListOfColors);

            let data = [];
            let missingPercent = 1;

            for(const item of localUserData.budgetItems) {
                let newDataPoint = {"budgetitemname": item.budgetItemName, "percent": (item.budgetItemCost/localUserData.monthlyIncome).toFixed(2)}
                data.push(newDataPoint);
                missingPercent -= newDataPoint.percent;
            }

            if((missingPercent).toFixed(2) > 0) data.push({"budgetitemname": "Free", "percent": (missingPercent).toFixed(2)})

            let pie = d3.pie().value((d) => d.percent);
            let arc = d3.arc().outerRadius(radius).innerRadius(30);

            let arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class","arc");

            arcs.append("path").transition().attr("d", arc).attr("fill", (d) => color(d.data.budgetitemname));

            arcs.append("text").attr("transform", (d) => `translate(${arc.centroid(d)})`).attr("text-anchor", "middle").text((d) => d.data.budgetitemname);
        }
    },[newListOfColors, localUserData])

    const calculateRandomNumber = (max) => {
        return Math.floor(Math.random() * max);
    }

    return(
        <svg ref={svgElement} width="200" height="200"></svg>
    )
}

export default PieChart;