import { initCy } from '../src/cygraph.js';
import { initializeUI } from '../src/ui.js';
import { assignEntityIds } from '../src/entityIdUtils.js';

document.addEventListener('DOMContentLoaded', function () {
    initCy().then((cy) => {
        // Retrieve current data for nodes and edges from the Cytoscape instance.
        const nodesData = cy.nodes().map((node) => node.data());
        const edgesData = cy.edges().map((edge) => edge.data());
        
        // Create a structured object for assignEntityIds.
        const elementsData = { nodes: nodesData, edges: edgesData };

        // Generate and log missing entity IDs.
        assignEntityIds(elementsData);

        // Update Cytoscape elements with the modified data containing IDs.
        cy.nodes().forEach((node, index) => {
            node.data(elementsData.nodes[index]);
        });
        cy.edges().forEach((edge, index) => {
            edge.data(elementsData.edges[index]);
        });

        // Continue with UI initialization using the imported function.
        initializeUI(cy);
    });
});