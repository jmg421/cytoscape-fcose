from flask import Flask, render_template, jsonify
import threading

app = Flask(__name__)

# Global variable to store graph elements for Cytoscape.
graph_elements = []

@app.route('/graph')
def graph():
    return render_template('graph.html')

@app.route('/graph_data')
def graph_data():
    # Return the current graph elements as JSON.
    return jsonify(graph_elements)

def update_graph_elements(elements):
    global graph_elements
    graph_elements = elements

_server_thread = None

def start_server():
    """Starts the Flask server in a background thread (if not already running)."""
    global _server_thread
    if _server_thread is None:
        _server_thread = threading.Thread(
            target=lambda: app.run(port=5000, host='127.0.0.1', debug=False, use_reloader=False)
        )
        _server_thread.daemon = True
        _server_thread.start()