#!/usr/bin/env python3
import sys
import math
import logging

from PyQt5 import QtWidgets, QtCore, QtGui
# Import our modular graph visualization widget.
from graph_visualization import GraphVisualizationWidget

# Configure logging for debugging output.
logging.basicConfig(level=logging.DEBUG, format='%(levelname)s: %(message)s')

def uniform_threshold_cdf(phi):
    """Uniform threshold distribution on [0,1]."""
    logging.debug("uniform_threshold_cdf() called with phi=%s", phi)
    if phi < 0:
        return 0.0
    elif phi > 1:
        return 1.0
    else:
        return phi

def poisson_degree_distribution(z_mean, N):
    """Compute Poisson degree distribution p(k) for k=0,...,N."""
    logging.debug("poisson_degree_distribution() called with z_mean=%s, N=%s", z_mean, N)
    p = []
    for k in range(N+1):
        pk = math.exp(-z_mean) * (z_mean ** k) / math.factorial(k)
        p.append(pk)
    total = sum(p)
    p = [x / total for x in p]
    logging.debug("Degree distribution computed: %s", p)
    return p

def compute_generating_functions(p, F, N):
    """
    Computes generating functions based on p and F.
    ρₖ = F(1/k) for k>=1 (with ρ₀=1).
    """
    logging.debug("compute_generating_functions() called.")
    G0 = G1 = G2 = 0.0
    for k in range(N+1):
        rho_k = 1.0 if k <= 0 else F(1.0 / k)
        s_k = p[k] * rho_k
        G0 += s_k
        G1 += k * s_k
        G2 += k * (k - 1) * s_k
    logging.debug("Computed generating functions: G0=%s, G1=%s, G2=%s", G0, G1, G2)
    return G0, G1, G2

def compute_metrics(p, F, N):
    """
    Compute cascade metrics and returns:
      - Average degree (z)
      - Vulnerable fraction (P_v)
      - Average degree among vulnerable nodes (z_v)
      - Vulnerable cluster size (n)
    """
    logging.debug("compute_metrics() called.")
    z = sum(k * p[k] for k in range(N+1))
    G0, G1, G2 = compute_generating_functions(p, F, N)
    
    vulnerable_fraction = G0
    vulnerable_avg_degree = G1
    vulnerable_cluster_size = G0 + (G1**2)/(z - G2) if z > G2 else float('inf')
        
    logging.debug("Metrics computed: z=%s, vulnerable_fraction=%s, vulnerable_avg_degree=%s, vulnerable_cluster_size=%s",
                  z, vulnerable_fraction, vulnerable_avg_degree, vulnerable_cluster_size)
    return z, vulnerable_fraction, vulnerable_avg_degree, vulnerable_cluster_size

class CascadeMetricsApp(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("🔥 Cascade Model Metrics")
        self.setGeometry(100, 100, 800, 800)

        # Central widget and layout.
        central_widget = QtWidgets.QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QtWidgets.QVBoxLayout(central_widget)

        # Header label.
        header_label = QtWidgets.QLabel("🔥 Cascade Model Metrics 🔥")
        header_label.setAlignment(QtCore.Qt.AlignCenter)
        header_label.setStyleSheet("font-size: 20px; font-weight: bold;")
        main_layout.addWidget(header_label)

        # Form layout for input parameters.
        form_layout = QtWidgets.QFormLayout()
        self.entry_z_mean = QtWidgets.QLineEdit()
        self.entry_z_mean.setText("3")
        form_layout.addRow("Average Degree (z_mean):", self.entry_z_mean)
        self.entry_N = QtWidgets.QLineEdit()
        self.entry_N.setText("20")
        form_layout.addRow("Maximum Degree (N):", self.entry_N)
        self.entry_num_nodes = QtWidgets.QLineEdit()
        self.entry_num_nodes.setText("20")
        form_layout.addRow("Number of Nodes:", self.entry_num_nodes)
        main_layout.addLayout(form_layout)

        # Button layout.
        button_layout = QtWidgets.QHBoxLayout()
        compute_button = QtWidgets.QPushButton("Compute Metrics")
        compute_button.clicked.connect(self.compute_and_display)
        button_layout.addWidget(compute_button)
        share_button = QtWidgets.QPushButton("Share on X")
        share_button.clicked.connect(self.share_on_x)
        button_layout.addWidget(share_button)
        main_layout.addLayout(button_layout)

        # Results display.
        self.results_label = QtWidgets.QLabel("")
        self.results_label.setWordWrap(True)
        self.results_label.setStyleSheet("font-size: 14px;")
        main_layout.addWidget(self.results_label)

        # Graph Visualization widget.
        graph_header = QtWidgets.QLabel("Network Visualization")
        graph_header.setAlignment(QtCore.Qt.AlignCenter)
        graph_header.setStyleSheet("font-size: 16px; font-weight: bold; margin-top: 10px;")
        main_layout.addWidget(graph_header)

        self.graph_widget = GraphVisualizationWidget()
        self.graph_widget.setMinimumHeight(300)
        main_layout.addWidget(self.graph_widget)

        # Set a welcome message.
        self.results_label.setText(
            "Welcome to the Cascade Metrics App!\n"
            "Enter parameters and click 'Compute Metrics' to update metrics and the network visualization.\n"
            "Click 'Share on X' to copy a shareable version of the results."
        )

        # Compute metrics at startup.
        self.compute_and_display()

    def compute_and_display(self):
        logging.debug("compute_and_display() triggered.")
        try:
            z_mean = float(self.entry_z_mean.text())
            N = int(self.entry_N.text())
            num_nodes = int(self.entry_num_nodes.text())
            logging.debug("Inputs read: z_mean=%s, N=%s, num_nodes=%s", z_mean, N, num_nodes)
        except ValueError as e:
            logging.error("Input Error: %s", e)
            QtWidgets.QMessageBox.critical(self, "Input Error", "Please enter valid numbers for the parameters.")
            return

        # Compute cascade metrics.
        p = poisson_degree_distribution(z_mean, N)
        F = uniform_threshold_cdf
        z, vulnerable_fraction, vulnerable_avg_degree, vulnerable_cluster_size = compute_metrics(p, F, N)

        # Build and display results.
        results = [
            "🔥 Cascade Metrics 🔥",
            f"Average degree (z): {z:.4f}",
            f"Vulnerable fraction (P_v): {vulnerable_fraction:.4f}",
            f"Avg. degree of vulnerable nodes (z_v): {vulnerable_avg_degree:.4f}"
        ]
        if vulnerable_cluster_size == float('inf'):
            results.append("Vulnerable cluster size: Infinite (Cascade condition met!)")
        else:
            results.append(f"Avg. vulnerable cluster size (n): {vulnerable_cluster_size:.4f}")

        self.result_text = "\n".join(results)
        self.results_label.setText(self.result_text)
        logging.debug("Final results to display: %s", self.result_text)

        # Update the graph visualization.
        self.graph_widget.update_graph(z_mean, num_nodes)

    def share_on_x(self):
        logging.debug("share_on_x() triggered.")
        if not hasattr(self, 'result_text') or not self.result_text:
            QtWidgets.QMessageBox.information(self, "Info", "Please compute the metrics first!")
            return
        tweet_text = self.result_text + "\n#CascadeModel #NetworkScience"
        clipboard = QtWidgets.QApplication.clipboard()
        clipboard.setText(tweet_text)
        QtWidgets.QMessageBox.information(self, "Shared!", "Tweet text copied to clipboard!\nPaste it on x.com to share the cascade vibes.")

def main():
    app = QtWidgets.QApplication(sys.argv)
    window = CascadeMetricsApp()
    window.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()