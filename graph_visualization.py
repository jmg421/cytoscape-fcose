from PyQt5 import QtWidgets, QtWebEngineWidgets, QtCore
import networkx as nx
from flask_server import start_server, update_graph_elements

class GraphVisualizationWidget(QtWidgets.QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        # Start the Flask server in the background.
        start_server()
        self.web_view = QtWebEngineWidgets.QWebEngineView()
        layout = QtWidgets.QVBoxLayout(self)
        layout.addWidget(self.web_view)
        self.setLayout(layout)
        self.load_blank()

    def load_blank(self):
        # Display a temporary blank message.
        blank_html = """
        <html>
          <head><style>
          body { font-family: sans-serif; margin: 0; padding: 20px; }
          </style></head>
          <body>
            <h3>Graph will render here</h3>
          </body>
        </html>
        """
        self.web_view.setHtml(blank_html)

    def update_graph(self, z_mean, num_nodes):
        # Generate new graph elements.
        elements = self.generate_graph_elements(z_mean, num_nodes)
        # Update Flask's graph data.
        update_graph_elements(elements)
        # Load the Flask-served URL.
        self.web_view.load(QtCore.QUrl("http://127.0.0.1:5000/graph"))

    def generate_graph_elements(self, z_mean, num_nodes):
        """
        Generate a random Erdős–Rényi graph with an edge probability that gives
        an approximate average degree of z_mean, then convert it into a list of
        Cytoscape-compatible node and edge elements.
        """
        p = min(z_mean / max(num_nodes - 1, 1), 1.0)
        G = nx.erdos_renyi_graph(num_nodes, p)
        nodes = [
            {"data": {"id": f"n{n}", "label": f"Node {n}"}} for n in G.nodes
        ]
        edges = []
        for i, (u, v) in enumerate(G.edges()):
            edge_id = f"e{i}"
            edges.append({"data": {"id": edge_id, "source": f"n{u}", "target": f"n{v}"}})
        return nodes + edges