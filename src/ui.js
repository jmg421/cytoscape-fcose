import { cy, refreshGraphData } from './cygraph.js';

// Helper function to generate a unique id.
function generateUniqueId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function updateEdgeModalDropdown() {
    const sourceSelect = document.getElementById('edge-source-select');
    const targetSelect = document.getElementById('edge-target-select');

    // If either dropdown doesn't exist, log a warning and exit.
    if (!sourceSelect || !targetSelect) {
        console.warn('Edge modal dropdown element(s) not found. ' +
                     'Make sure your Add Edge modal contains <select> elements with ' +
                     'ids "edge-source-select" and "edge-target-select".');
        return;
    }

    // Clear existing options and add a default placeholder option.
    [sourceSelect, targetSelect].forEach(select => {
        select.innerHTML = `<option value="">Select a node</option>`;
    });

    // Get the current nodes from the Cytoscape instance.
    const nodes = cy.nodes();

    nodes.forEach(node => {
        const nodeId = node.data('id');
        const nodeLabel = node.data('label') || nodeId;
        const optionHTML = `<option value="${nodeId}">${nodeLabel}</option>`;
        sourceSelect.insertAdjacentHTML("beforeend", optionHTML);
        targetSelect.insertAdjacentHTML("beforeend", optionHTML);
    });
}

/**
 * Initialize the application's UI by attaching event listeners to DOM elements.
 * This version verifies that each expected element exists before proceeding.
 */
export function initializeUI(cy) {
    // Open the Add Node modal.
    const addNodeBtn = document.getElementById('add-node-btn');
    if (addNodeBtn) {
        addNodeBtn.addEventListener('click', function () {
            // Reset the form (the node id field is not present now)
            document.getElementById('add-node-form').reset();
            const addNodeModal = new bootstrap.Modal(document.getElementById('addNodeModal'));
            addNodeModal.show();
        });
    } else {
        console.warn("Element 'add-node-btn' not found in the DOM.");
    }

    // Open the Add Edge modal.
    const addEdgeBtn = document.getElementById('add-edge-btn');
    if (addEdgeBtn) {
        addEdgeBtn.addEventListener('click', function () {
            document.getElementById('add-edge-form').reset();
            updateEdgeModalDropdown();
            const addEdgeModal = new bootstrap.Modal(document.getElementById('addEdgeModal'));
            addEdgeModal.show();
        });
    } else {
        console.warn("Element 'add-edge-btn' not found in the DOM.");
    }

    // Create edge from exactly 2 selected nodes.
    const createEdgeBtn = document.getElementById('create-edge-btn');
    if (createEdgeBtn) {
        createEdgeBtn.addEventListener('click', function () {
            const selectedNodes = cy.$('node:selected');
            if (selectedNodes.length !== 2) {
                alert("Please select exactly 2 nodes to create an edge.");
                return;
            }
            const source = selectedNodes[0].data('id');
            const target = selectedNodes[1].data('id');
            const edgeId = generateUniqueId('edge');
            const edgeLabel = `${source}→${target}`;
            const payload = { id: edgeId, source: source, target: target, label: edgeLabel };

            fetch('/api/add_edge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { 
                        throw new Error(`HTTP Error ${response.status}: ${text}`); 
                    });
                }
                return response.json();
            })
            .then(result => {
                if (result.status === 'success') {
                    refreshGraphData();
                } else {
                    alert("Error: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error creating edge:", error);
            });
        });
    } else {
        console.warn("Element 'create-edge-btn' not found in the DOM.");
    }

    // Remove selected elements (nodes and edges).
    const removeSelectedBtn = document.getElementById('remove-selected-btn');
    if (removeSelectedBtn) {
        removeSelectedBtn.addEventListener('click', function () {
            const selected = cy.$(':selected');
            if (selected.length === 0) {
                alert("Please select nodes or edges to remove.");
                return;
            }
            const ids = selected.map(ele => ele.data('id'));
            fetch('/api/remove_elements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: ids })
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { 
                        throw new Error(`HTTP Error ${response.status}: ${text}`); 
                    });
                }
                return response.json();
            })
            .then(result => {
                if (result.status === 'success') {
                    refreshGraphData();
                } else {
                    alert("Error: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error removing elements:", error);
            });
        });
    } else {
        console.warn("Element 'remove-selected-btn' not found in the DOM.");
    }

    // Handle Add Node form submission.
    const addNodeForm = document.getElementById('add-node-form');
    if (addNodeForm) {
        addNodeForm.addEventListener('submit', function (evt) {
            evt.preventDefault();

            // Automatically generate a new node id.
            const nodeId = generateUniqueId('node');
            const nodeLabel = document.getElementById('node-label').value.trim() || nodeId;
            const nodePosVal = document.getElementById('node-position').value.trim();
            let position = null;
            if (nodePosVal) {
                const coords = nodePosVal.split(',');
                if (coords.length === 2) {
                    position = {
                        x: parseFloat(coords[0].trim()),
                        y: parseFloat(coords[1].trim())
                    };
                }
            }
            
            const payload = { id: nodeId, label: nodeLabel };
            if (position) { payload.position = position; }
            
            fetch('/api/add_node', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP Error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(result => {
                if (result.status === 'success') {
                    refreshGraphData();
                } else {
                    alert("Error: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error adding node:", error);
            })
            .finally(() => {
                const addNodeModal = bootstrap.Modal.getInstance(document.getElementById('addNodeModal'));
                if (addNodeModal) {
                    addNodeModal.hide();
                }
            });
        });
    } else {
        console.warn("Element 'add-node-form' not found in the DOM.");
    }

    // Handle Add Edge form submission.
    const addEdgeForm = document.getElementById('add-edge-form');
    if (addEdgeForm) {
        addEdgeForm.addEventListener('submit', function (evt) {
            evt.preventDefault();

            const edgeId = generateUniqueId('edge');
            const edgeSource = document.getElementById('edge-source-select').value;
            const edgeTarget = document.getElementById('edge-target-select').value;
            const edgeLabel = document.getElementById('edge-label').value.trim() || `${edgeSource}→${edgeTarget}`;
            
            if (!edgeSource || !edgeTarget) {
                alert("Please select both a source and a target node.");
                return;
            }
            
            const payload = { id: edgeId, source: edgeSource, target: edgeTarget, label: edgeLabel };

            fetch('/api/add_edge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`HTTP Error ${response.status}: ${text}`);
                    });
                }
                return response.json();
            })
            .then(result => {
                if (result.status === 'success') {
                    refreshGraphData();
                } else {
                    alert("Error: " + result.message);
                }
            })
            .catch(error => {
                console.error("Error adding edge:", error);
            })
            .finally(() => {
                const addEdgeModal = bootstrap.Modal.getInstance(document.getElementById('addEdgeModal'));
                if (addEdgeModal) {
                    addEdgeModal.hide();
                }
            });
        });
    } else {
        console.warn("Element 'add-edge-form' not found in the DOM.");
    }

    console.log("UI initialized");
} 