'use strict';

let data;
let url = 'https://opendata.paris.fr/api/records/1.0/search/?dataset=liste_des_prenoms&q=&rows=10&facet=sexe&facet=annee&facet=prenoms';
let apiKey = config.API_KEY;

const CHART_WIDTH = 800;
const CHART_HEIGHT = 400;

/**
 * Fetch data from json file
 */
async function fetchData() {
    let options = {
        method: 'GET',
        headers: {
            'Authorization': apiKey
        }
    };

    await fetch(url, options)
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
        .domain([0, d3.max(data, d => d.nombre) + 10])
        .range([CHART_HEIGHT, 0]);

    const svg = d3
        .select('svg')
        .attr('width', CHART_WIDTH)
        .attr('height', CHART_HEIGHT);

    const g = svg
        .append('g')
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', xScale.bandwidth())
        .attr('height', d => CHART_HEIGHT - yScale(d.nombre))
        .attr('x', d => xScale(d.prenoms))
        .attr('y', d => yScale(d.nombre) - 20);

    svg
        .selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.prenoms)
        .classed('label', true)
        .attr('x', d => xScale(d.prenoms) + xScale.bandwidth() / 2)
        .attr('y', CHART_HEIGHT);
}

document.readyState ? fetchData() : console.log('Load error');
