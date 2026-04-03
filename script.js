// OSI Model Visualizer JavaScript
class OSIVisualizer {
    constructor() {
        this.initializeEventListeners();
        this.currentLayer = 7;
        this.isAnimating = false;
    }

    initializeEventListeners() {
        document.getElementById('sendBtn').addEventListener('click', () => this.sendData());
        document.getElementById('receiveBtn').addEventListener('click', () => this.receiveData());
        document.getElementById('processBtn').addEventListener('click', () => this.processMessage());
        
        // Add hover effects to layer cards
        document.querySelectorAll('.layer-card').forEach(card => {
            card.addEventListener('mouseenter', () => this.highlightLayer(card));
            card.addEventListener('mouseleave', () => this.unhighlightLayer(card));
        });
    }

    sendData() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const flowStatus = document.getElementById('flowStatus');
        const flowBar = document.getElementById('flowBar');
        
        flowStatus.textContent = 'Sending data through layers...';
        flowBar.style.width = '0%';
        
        // Animate through layers from top to bottom
        let currentLayerNum = 7;
        const layers = document.querySelectorAll('.layer-card');
        
        const animateDown = () => {
            if (currentLayerNum >= 1) {
                // Highlight current layer
                layers.forEach(layer => layer.classList.remove('ring-2', 'ring-blue-400'));
                const currentLayer = document.querySelector(`[data-layer="${currentLayerNum}"]`);
                currentLayer.classList.add('ring-2', 'ring-blue-400');
                
                // Update progress bar
                const progress = ((7 - currentLayerNum) / 6) * 100;
                flowBar.style.width = `${progress}%`;
                
                // Update status
                const layerNames = ['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'];
                flowStatus.textContent = `Processing through ${layerNames[currentLayerNum]} Layer...`;
                
                currentLayerNum--;
                setTimeout(animateDown, 500);
            } else {
                flowStatus.textContent = 'Data sent successfully!';
                setTimeout(() => {
                    this.resetAnimation();
                }, 1000);
            }
        };
        
        animateDown();
    }

    receiveData() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const flowStatus = document.getElementById('flowStatus');
        const flowBar = document.getElementById('flowBar');
        
        flowStatus.textContent = 'Receiving data through layers...';
        flowBar.style.width = '100%';
        
        // Animate through layers from bottom to top
        let currentLayerNum = 1;
        const layers = document.querySelectorAll('.layer-card');
        
        const animateUp = () => {
            if (currentLayerNum <= 7) {
                // Highlight current layer
                layers.forEach(layer => layer.classList.remove('ring-2', 'ring-green-400'));
                const currentLayer = document.querySelector(`[data-layer="${currentLayerNum}"]`);
                currentLayer.classList.add('ring-2', 'ring-green-400');
                
                // Update progress bar
                const progress = (currentLayerNum / 7) * 100;
                flowBar.style.width = `${progress}%`;
                
                // Update status
                const layerNames = ['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'];
                flowStatus.textContent = `Processing through ${layerNames[currentLayerNum]} Layer...`;
                
                currentLayerNum++;
                setTimeout(animateUp, 500);
            } else {
                flowStatus.textContent = 'Data received successfully!';
                setTimeout(() => {
                    this.resetAnimation();
                }, 1000);
            }
        };
        
        animateUp();
    }

    processMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) {
            alert('Please enter a message to process');
            return;
        }
        
        const resultDiv = document.getElementById('processResult');
        const stepsDiv = document.getElementById('transformationSteps');
        
        // Clear previous results
        stepsDiv.innerHTML = '';
        
        // Simulate data transformation through layers
        const transformations = [
            { layer: 'Application', action: 'Application creates user data', data: message },
            { layer: 'Presentation', action: 'Data formatted and encrypted', data: `[ENCRYPTED]${message}` },
            { layer: 'Session', action: 'Session established', data: `[SESSION_ID:12345][ENCRYPTED]${message}` },
            { layer: 'Transport', action: 'Data segmented, TCP headers added', data: `[TCP_PORT:80][SESSION_ID:12345][ENCRYPTED]${message}` },
            { layer: 'Network', action: 'IP addressing and routing', data: `[IP:192.168.1.1][TCP_PORT:80][SESSION_ID:12345][ENCRYPTED]${message}` },
            { layer: 'Data Link', action: 'MAC addressing and framing', data: `[MAC:00:11:22:33:44:55][IP:192.168.1.1][TCP_PORT:80][SESSION_ID:12345][ENCRYPTED]${message}` },
            { layer: 'Physical', action: 'Converted to electrical signals', data: '🔌 ⚡ 📡 [BINARY STREAM]' }
        ];
        
        transformations.forEach((transform, index) => {
            setTimeout(() => {
                const stepDiv = document.createElement('div');
                stepDiv.className = 'p-3 bg-white rounded border-l-4 border-indigo-500';
                stepDiv.innerHTML = `
                    <div class="font-semibold text-indigo-700">Layer ${7-index}: ${transform.layer}</div>
                    <div class="text-gray-600 text-sm mt-1">${transform.action}</div>
                    <div class="text-xs text-gray-500 mt-1 font-mono break-all">${transform.data}</div>
                `;
                stepsDiv.appendChild(stepDiv);
                
                if (index === transformations.length - 1) {
                    resultDiv.classList.remove('hidden');
                }
            }, index * 300);
        });
    }

    highlightLayer(card) {
        const layerNum = card.dataset.layer;
        card.style.transform = 'translateX(15px) scale(1.02)';
        
        // Show additional info
        const info = this.getLayerInfo(layerNum);
        if (!card.querySelector('.layer-info')) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'layer-info mt-3 p-3 bg-blue-50 rounded text-sm';
            infoDiv.innerHTML = `
                <div class="font-semibold text-blue-700">Key Functions:</div>
                <ul class="list-disc list-inside text-gray-700 mt-1 space-y-1">
                    ${info.functions.map(func => `<li>${func}</li>`).join('')}
                </ul>
            `;
            card.appendChild(infoDiv);
        }
    }

    unhighlightLayer(card) {
        card.style.transform = '';
        const info = card.querySelector('.layer-info');
        if (info) {
            info.remove();
        }
    }

    getLayerInfo(layerNum) {
        const layerInfo = {
            '7': {
                functions: ['User interface', 'Network services', 'Resource sharing', 'File transfers']
            },
            '6': {
                functions: ['Data encryption', 'Compression', 'Character encoding', 'Format conversion']
            },
            '5': {
                functions: ['Session management', 'Authentication', 'Authorization', 'Synchronization']
            },
            '4': {
                functions: ['Segmentation', 'Flow control', 'Error checking', 'Reliable delivery']
            },
            '3': {
                functions: ['Routing', 'Logical addressing', 'Packet forwarding', 'Path determination']
            },
            '2': {
                functions: ['Frame synchronization', 'Error detection', 'MAC addressing', 'Flow control']
            },
            '1': {
                functions: ['Bit transmission', 'Signal encoding', 'Physical topology', 'Hardware specifications']
            }
        };
        
        return layerInfo[layerNum] || { functions: [] };
    }

    resetAnimation() {
        this.isAnimating = false;
        document.querySelectorAll('.layer-card').forEach(layer => {
            layer.classList.remove('ring-2', 'ring-blue-400', 'ring-green-400');
        });
        document.getElementById('flowBar').style.width = '0%';
        document.getElementById('flowStatus').textContent = 'Ready to send data';
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new OSIVisualizer();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('sendBtn').click();
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        document.getElementById('receiveBtn').click();
    }
});
