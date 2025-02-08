from flask import Flask, render_template, jsonify
import random  
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

# The home page; if no metrics are computed, propagation will be undefined in the template.
@app.route('/')
def index():
    app.logger.debug("Rendering index page")
    return render_template('index.html')


# Route to view the network graph visualization
@app.route('/graph')
def graph():
    app.logger.info("Rendering graph page with Cytoscape fcose layout")
    # Pass an empty dictionary for propagation to ensure consistency in the template
    return render_template('graph.html', propagation={})


# API endpoint that returns graph data as JSON.
@app.route('/graph_data')
def graph_data():
    app.logger.info("Generating graph data")
    # Generate sample graph data for visualization purposes
    nodes = [{'data': {'id': str(i), 'label': f'Node {i}'}} for i in range(1, 21)]
    edges = []
    for i in range(1, 21):
        target = random.randint(1, 20)
        if target != i:
            edges.append({'data': {'source': str(i), 'target': str(target)}})
    app.logger.debug("Generated %d nodes and %d edges.", len(nodes), len(edges))
    graph_payload = {'nodes': nodes, 'edges': edges}
    app.logger.debug("Graph data payload: %s", graph_payload)
    return jsonify(graph_payload)


if __name__ == '__main__':
    # In production, use a proper WSGI server (e.g. Gunicorn or uWSGI) instead of app.run()
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
