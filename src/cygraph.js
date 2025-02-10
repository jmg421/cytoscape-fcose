import cytoscape from 'cytoscape';

export let cy = null;  // This will hold the Cytoscape instance

export function initCy() {
    return fetch('/graph_data')
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { 
                    throw new Error(`HTTP Error ${response.status}: ${text}`); 
                });
            }
            return response.json();
        })
        .then(data => {
            cy = cytoscape({
                container: document.getElementById('cy'),
                boxSelectionEnabled: true,
                autounselectify: false,
                elements: data,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'content': 'data(label)',
                            'background-color': '#0074D9',
                            'color': '#fff',
                            'text-valign': 'center',
                            'font-size': '10px'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'content': 'data(label)',
                            'width': 2,
                            'line-color': '#ccc',
                            'target-arrow-shape': 'triangle',
                            'target-arrow-color': '#ccc',
                            'curve-style': 'bezier',
                            'font-size': '10px',
                            'color': '#000',
                            'text-rotation': 'autorotate',
                            'text-margin-y': -5
                        }
                    },
                    {
                        selector: 'node:selected',
                        style: {
                            'background-color': '#f00',
                            'border-width': '4px',
                            'border-color': '#FFA500'
                        }
                    },
                    {
                        selector: 'edge:selected',
                        style: {
                            'line-color': '#f00',
                            'target-arrow-color': '#f00',
                            'width': 4
                        }
                    },
                    {
                        selector: 'node:active',
                        style: {
                            'background-color': '#f00',
                            'border-width': '4px',
                            'border-color': '#FFA500'
                        }
                    },
                    {
                        selector: 'edge:active',
                        style: {
                            'line-color': '#f00',
                            'target-arrow-color': '#f00',
                            'width': 4
                        }
                    }
                ],
                layout: {
                    name: 'fcose',
                    animate: true
                }
            });

            // Node selection events:
            cy.on('tap', 'node', function(evt) {
                const node = evt.target;
                if (!node.selected()) { node.select(); }
            });
            cy.on('tapend', 'node', function(evt) {
                const node = evt.target;
                if (!node.selected()) { node.select(); }
            });

            // Edge selection events:
            cy.on('tap', 'edge', function(evt) {
                const edge = evt.target;
                if (!edge.selected()) { edge.select(); }
            });
            cy.on('tapend', 'edge', function(evt) {
                const edge = evt.target;
                if (!edge.selected()) { edge.select(); }
            });

            return cy;
        })
        .catch(error => {
            console.error('Error initializing Cytoscape:', error);
        });
}

export function updateLayout() {
    if (cy) {
        const layout = cy.layout({ name: 'fcose', animate: true });
        layout.run();
        cy.fit();
    }
}

export function refreshGraphData() {
    if (!cy) return;
    fetch('/graph_data')
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { 
                    throw new Error(`HTTP Error ${response.status}: ${text}`); 
                });
            }
            return response.json();
        })
        .then(data => {
            cy.json({ elements: data });
            updateLayout();
        })
        .catch(error => {
            console.error('Error refreshing graph data:', error);
        });
} 