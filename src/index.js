/**
 * Minimal fcose layout plugin for Cytoscape.
 *
 * In a real implementation, you would include your layout algorithm code.
 * Here we provide a refined implementation to demonstrate proper structure.
 */

/**
 * Define the FcoseLayout as a proper class to be used as a constructor.
 */
class FcoseLayout {
  constructor(options) {
    this.options = options;
  }

  run() {
    const cy = this.options.cy;
    // Use the provided element collection, if available
    const nodes = this.options.eles ? this.options.eles.nodes() : cy.nodes();
    // If no nodes are available, exit gracefully.
    if (nodes.length === 0) {
      return;
    }
    
    // Begin a batch update for smoother rendering.
    cy.startBatch();
    
    const spacing = 100;
    let row = 0;
    let col = 0;
    
    nodes.forEach((node) => {
      const posX = col * spacing + 50;
      const posY = row * spacing + 50;
      node.position({ x: posX, y: posY });
      col++;
      if (col >= 5) {
        col = 0;
        row++;
      }
    });
    
    cy.endBatch();
    // Adjust the viewport so all nodes are visible.
    cy.fit();
    
    if (this.options.done) {
      this.options.done();
    }
  }

  stop() {
    // Provide functionality for stopping the layout if necessary.
  }

  // Dummy event methods to support Cytoscape's API:
  on() {}
  one() {}
  off() {}
  trigger() {}
}

/**
 * Register the layout with Cytoscape.
 * Cytoscape will call this registration function (once imported by cytoscape.use())
 * passing the cytoscape instance. The plugin then registers the 'fcose' layout,
 * which Cytoscape instantiates using new FcoseLayout(options)
 */
function register(cytoscape) {
  if (!cytoscape) {
    console.error("Cytoscape is not defined");
    return;
  }
  cytoscape('layout', 'fcose', FcoseLayout);
  console.log("fcose layout registered");
}

// Export the registration function as the default export
export default register;