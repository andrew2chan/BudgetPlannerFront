import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const PieChart = () => {
    const userData = useSelector(state => state.user.userData);
    const [colorPicker, updateColorPicker] = useState([]);
    const svgElement = useRef();

    useEffect(() => {
        let listOfBudgetItems = userData.budgetItems;
        let newListOfColors = [];

        for(let i = 0; i < listOfBudgetItems.length; i++) {
            newListOfColors.push("rgb(" + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ", " + calculateRandomNumber(256) + ")");
        }

        let svg = d3.select(svgElement.current);

        svg.selectAll("*").remove(); //remove everything inside the svg

        let width = svg.attr("width");
        let height = svg.attr("height");
        let radius = Math.min(width, height)/2
        let g = svg.append("g").attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

        let color = d3.scaleOrdinal(newListOfColors);

        let data = [{"activity": "gaming", "percent": 40},{"activity": "sleeping", "percent": 45}];

        let pie = d3.pie().value((d) => d.percent);
        let arc = d3.arc().outerRadius(radius).innerRadius(30);
        let label = d3.arc().outerRadius(radius).innerRadius(30);

        let arcs = g.selectAll(".arc").data(pie(data)).enter().append("g").attr("class","arc");

        arcs.append("path").attr("d", arc).attr("fill", (d) => color(d.data.activity));

        arcs.append("text").attr("transform", (d) => `translate(${arc.centroid(d)})`).attr("text-anchor", "middle").text((d) => d.data.activity);

    },[userData]);

    const calculateRandomNumber = (max) => {
        return Math.floor(Math.random() * max);
    }

    return(
        <svg ref={svgElement} width="200" height="200"></svg>
    )
}

export default PieChart;