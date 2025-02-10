import { cy, refreshGraphData } from './cygraph.js';

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

export function initializeUI() {
    // Open the Add Node modal.
    const addNodeBtn = document.getElementById('add-node-btn');
    addNodeBtn.addEventListener('click', function () {
        document.getElementById('add-node-form').reset();
        const addNodeModal = new bootstrap.Modal(document.getElementById('addNodeModal'));
        addNodeModal.show();
    });

    // Open the Add Edge modal.
    const addEdgeBtn = document.getElementById('add-edge-btn');
    addEdgeBtn.addEventListener('click', function () {
        document.getElementById('add-edge-form').reset();
        // Update the source/target dropdowns before showing the modal.
        updateEdgeModalDropdown();
        const addEdgeModal = new bootstrap.Modal(document.getElementById('addEdgeModal'));
        addEdgeModal.show();
    });

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
            const edgeId = `e-${source}-${target}`;
            const payload = { id: edgeId, source: source, target: target };

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
    }

    // Remove selected elements (nodes and edges).
    const removeSelectedBtn = document.getElementById('remove-selected-btn');
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

    // Handle Add Node form submission.
    const addNodeForm = document.getElementById('add-node-form');
    addNodeForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        const nodeId = document.getElementById('node-id').value.trim();
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
            addNodeModal.hide();
        });
    });

    // Handle Add Edge form submission.
    const addEdgeForm = document.getElementById('add-edge-form');
    addEdgeForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // Use the dynamic dropdown values for source and target.
        const edgeId = document.getElementById('edge-id').value.trim();
        const edgeSource = document.getElementById('edge-source-select').value;
        const edgeTarget = document.getElementById('edge-target-select').value;
        
        // Basic validation.
        if (!edgeSource || !edgeTarget) {
            alert("Please select both a source and a target node.");
            return;
        }
        
        const payload = { id: edgeId, source: edgeSource, target: edgeTarget };

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
            addEdgeModal.hide();
        });
    });
} 