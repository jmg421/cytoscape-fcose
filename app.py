from flask import Flask, render_template, jsonify, request
import logging
import os

app = Flask(__name__)

# Set production configuration unless explicitly set otherwise
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False') == 'True'
app.config['ENV'] = os.environ.get('FLASK_ENV', 'production')

# Configure logging: use DEBUG level if in debug mode, otherwise INFO
logging.basicConfig(
    level=logging.DEBUG if app.debug else logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

# Global in-memory graph state.
graph_state = {
    "nodes": [
        {"data": {"id": "node1", "label": "Node 1"}},
        {"data": {"id": "node2", "label": "Node 2"}},
        {"data": {"id": "node3", "label": "Node 3"}},
        {"data": {"id": "node4", "label": "Node 4"}},
        {"data": {"id": "node5", "label": "Node 5"}}
    ],
    "edges": [
        {"data": {"id": "e1", "source": "node1", "target": "node2"}},
        {"data": {"id": "e2", "source": "node1", "target": "node3"}},
        {"data": {"id": "e3", "source": "node2", "target": "node4"}},
        {"data": {"id": "e4", "source": "node3", "target": "node5"}},
        {"data": {"id": "e5", "source": "node4", "target": "node5"}}
    ]
}

# Home page: renders the main graph template.
@app.route('/')
def index():
    app.logger.debug("Rendering index page")
    return render_template('graph.html')

# Graph page: this could be used to provide additional context if needed.
@app.route('/graph')
def graph():
    app.logger.info("Rendering graph page with Cytoscape fcose layout")
    # Pass an empty propagation dictionary to ensure consistency in the template.
    return render_template('graph.html', propagation={})

# API endpoint that returns the current graph state.
@app.route('/graph_data')
def graph_data():
    app.logger.info("Serving graph data")
    return jsonify(graph_state)

# API endpoint to add a new node.
@app.route('/api/add_node', methods=['POST'])
def add_node():
    req_data = request.get_json()
    new_node_id = req_data.get('id')
    if not new_node_id:
        return jsonify({"status": "error", "message": "Node id is required"}), 400
    
    # Use the provided label or fallback to the node id.
    label = req_data.get('label', new_node_id)
    # Optional position information.
    position = req_data.get('position')

    # Check if a node with this id already exists.
    for node in graph_state['nodes']:
        if node['data'].get('id') == new_node_id:
            return jsonify({"status": "error", "message": "Node already exists"}), 400

    new_node = {"data": {"id": new_node_id, "label": label}}
    if position:
        try:
            x = float(position.get('x'))
            y = float(position.get('y'))
            new_node["position"] = {"x": x, "y": y}
        except (TypeError, ValueError):
            app.logger.warning("Invalid position format for node %s. Ignoring position.", new_node_id)
    
    graph_state['nodes'].append(new_node)
    app.logger.info("Added new node: %s", new_node)
    return jsonify({"status": "success", "node": new_node})

# API endpoint to add a new edge.
@app.route('/api/add_edge', methods=['POST'])
def add_edge():
    req_data = request.get_json()
    new_edge_id = req_data.get("id")
    source = req_data.get("source")
    target = req_data.get("target")
    
    if not (new_edge_id and source and target):
        return jsonify({"status": "error", "message": "Edge id, source, and target are required"}), 400

    # Check if an edge with the same id already exists.
    for edge in graph_state["edges"]:
        if edge["data"].get("id") == new_edge_id:
            return jsonify({"status": "error", "message": "Edge already exists"}), 400

    # Optionally, check that the provided source and target nodes exist.
    node_ids = {node["data"].get("id") for node in graph_state["nodes"]}
    if source not in node_ids or target not in node_ids:
        return jsonify({"status": "error", "message": "Invalid source or target node"}), 400

    new_edge = {"data": {"id": new_edge_id, "source": source, "target": target}}
    graph_state["edges"].append(new_edge)
    app.logger.info("Added new edge: %s", new_edge)
    return jsonify({"status": "success", "edge": new_edge})

# API endpoint to remove elements (both nodes and edges).
@app.route('/api/remove_elements', methods=['POST'])
def remove_elements():
    req_data = request.get_json()
    ids_to_remove = req_data.get("ids")
    if not ids_to_remove or not isinstance(ids_to_remove, list):
        return jsonify({"status": "error", "message": "A list of ids is required"}), 400
    
    # Remove nodes with matching ids.
    original_nodes_count = len(graph_state["nodes"])
    graph_state["nodes"] = [node for node in graph_state["nodes"] if node["data"]["id"] not in ids_to_remove]
    removed_nodes_count = original_nodes_count - len(graph_state["nodes"])
    
    # Remove edges that either have a matching id or that are connected to a removed node.
    original_edges_count = len(graph_state["edges"])
    graph_state["edges"] = [
        edge for edge in graph_state["edges"]
        if (edge["data"]["id"] not in ids_to_remove and
            edge["data"]["source"] not in ids_to_remove and
            edge["data"]["target"] not in ids_to_remove)
    ]
    removed_edges_count = original_edges_count - len(graph_state["edges"])
    
    app.logger.info("Removed %d nodes and %d edges", removed_nodes_count, removed_edges_count)
    return jsonify({
        "status": "success",
        "removed_nodes": removed_nodes_count,
        "removed_edges": removed_edges_count
    })

if __name__ == '__main__':
    # In production, use a proper WSGI server (e.g. Gunicorn or uWSGI) instead of app.run()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
