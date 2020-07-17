'use strict';

let data;
let json = './data.json';
const MARGINS = {top: 10, left: 20, bottom: 20, right: 20};
const CHART_WIDTH = 800 - MARGINS.left - MARGINS.right;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

/**
 * Fetch data from json file
 */
async function fetchData() {
    await fetch(json, { method: 'GET'})
        .then((r) => r.json())
        .then((d) => {
            data = d.records.map(f => f.fields);
            createChart();
        });
}

/**
 * Creates D3 elements
 */
function createChart() {
    const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.prenoms))
        .rangeRound([0, CHART_WIDTH])
        .padding(0.1);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.nombre) + d3.max(data, d => d.nombre) * 0.1])
        .range([CHART_HEIGHT, 0]);

    const svg = d3
        .select('svg')
        .attr('width', CHART_WIDTH + MARGINS.left + MARGINS.right)
        .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

    svg
        .append('g')
        .call(d3.axisBottom(xScale).tickSizeOuter(0))
        .attr('transform', `translate(${MARGINS.left}, ${CHART_HEIGHT})`);

    svg
        .append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0))
        .attr('transform', `translate(${MARGINS.left}, 0)`);

    svg
        .append('g')
        .attr('transform', `translate(${MARGINS.left}, 0)`)
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', xScale.bandwidth())
        .attr('height', d => CHART_HEIGHT - yScale(d.nombre))
        .attr('x', d => xScale(d.prenoms))
        .attr('y', d => yScale(d.nombre));

    svg
        .selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.nombre)
        .classed('label', true)
        .attr('x', d => xScale(d.prenoms) + xScale.bandwidth() - 15)
        .attr('y', d => yScale(d.nombre) - 5);
}

document.readyState ? fetchData() : console.log('Load error');
