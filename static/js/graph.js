// Start by logging the beginning of the graph rendering process
console.log("Starting graph rendering process...");

// Ensure the container element exists before proceeding
const cyContainer = document.getElementById('cy');
if (!cyContainer) {
    console.error("Cytoscape container element with id 'cy' was not found.");
} else {
    // Fetch the graph data from the Flask endpoint
    console.log("Fetching graph data from /graph_data");
    fetch('/graph_data')
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok: " + response.statusText);
          }
          console.log("Received response from /graph_data, status:", response.status);
          return response.json();
      })
      .then(data => {
          console.log("Graph data received:", data);
          // Initialize Cytoscape with the received graph data
          console.log("Initializing Cytoscape with fcose layout...");

          var cy = cytoscape({
              container: cyContainer,
              elements: data,
              style: [
                  {
                      selector: 'node',
                      style: {
                          'background-color': '#666',
                          'label': 'data(id)'
                      }
                  },
                  {
                      selector: 'edge',
                      style: {
                          'width': 3,
                          'line-color': '#ccc'
                      }
                  }
              ],
              layout: {
                  name: 'fcose',
                  animate: true,
                  gravity: 1,
                  numIter: 1000
              }
          });
          
          // Log when the layout stops after stabilizing.
          cy.on('layoutstop', function() {
              console.log("Cytoscape fcose layout finished.");
          });

          // Attach cy to the global window object so it can be inspected in the console
          window.cy = cy;

          // Log the initialized Cytoscape instance for debugging.
          console.log("Cytoscape instance initialized:", cy);
      })
      .catch(err => {
          console.error("Error fetching or initializing graph data:", err);
      });
}
