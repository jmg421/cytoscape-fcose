import { initCy } from './cygraph.js';
import { initializeUI } from './ui.js';

document.addEventListener('DOMContentLoaded', function () {
    initCy().then(() => {
        initializeUI();
    });
}); 