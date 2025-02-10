/**
 * Utility functions for generating and assigning unique IDs to graph entities.
 */

/**
 * Generate a unique entity id using a prefix ("node" or "edge") and a random string.
 * @param {string} prefix - The prefix for the entity id.
 * @returns {string} - The generated unique id.
 */
function generateEntityId(prefix) {
  return prefix + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Assign unique IDs to nodes and edges if not already present.
 * Logs the generated IDs in the JavaScript console.
 * If the element's data is undefined, it safely skips that element.
 * Optionally, if the `label` field is missing, a default (empty) label is set.
 * @param {object} elements - The elements object with `nodes` and `edges` arrays.
 * @returns {object} - The modified elements object with IDs assigned.
 */
function assignEntityIds(elements) {
  if (elements.nodes && Array.isArray(elements.nodes)) {
    elements.nodes.forEach(nodeData => {
      if (!nodeData) return; // In case the node data is undefined
      if (!nodeData.hasOwnProperty('id')) {
        const id = generateEntityId('node');
        nodeData.id = id;
        console.log("Generated node id:", id);
      }
      // Ensure each node has a defined label; this helps avoid style warnings.
      if (!nodeData.hasOwnProperty('label')) {
        nodeData.label = "";
      }
    });
  }
  if (elements.edges && Array.isArray(elements.edges)) {
    elements.edges.forEach(edgeData => {
      if (!edgeData) return; // Guard if the edge data is undefined
      if (!edgeData.hasOwnProperty('id')) {
        const id = generateEntityId('edge');
        edgeData.id = id;
        console.log("Generated edge id:", id);
      }
      // Ensure each edge has a defined label.
      if (!edgeData.hasOwnProperty('label')) {
        edgeData.label = "";
      }
    });
  }
  return elements;
}

export { assignEntityIds }; 