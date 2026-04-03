import React, { useState } from 'react';

const DataFlowDemo = () => {
  const [flowStatus, setFlowStatus] = useState('Ready to send data');
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sendData = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setProgress(0);
    
    let currentLayer = 7;
    const interval = setInterval(() => {
      if (currentLayer >= 1) {
        const layerNames = ['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'];
        setFlowStatus(`Processing through ${layerNames[currentLayer]} Layer...`);
        setProgress(((7 - currentLayer) / 6) * 100);
        currentLayer--;
      } else {
        setFlowStatus('Data sent successfully!');
        clearInterval(interval);
        setTimeout(() => {
          resetAnimation();
        }, 1000);
      }
    }, 500);
  };

  const receiveData = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setProgress(100);
    
    let currentLayer = 1;
    const interval = setInterval(() => {
      if (currentLayer <= 7) {
        const layerNames = ['', 'Physical', 'Data Link', 'Network', 'Transport', 'Session', 'Presentation', 'Application'];
        setFlowStatus(`Processing through ${layerNames[currentLayer]} Layer...`);
        setProgress((currentLayer / 7) * 100);
        currentLayer++;
      } else {
        setFlowStatus('Data received successfully!');
        clearInterval(interval);
        setTimeout(() => {
          resetAnimation();
        }, 1000);
      }
    }, 500);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setProgress(0);
    setFlowStatus('Ready to send data');
  };

  return (
    <section className="data-flow-section">
      <h2>Data Flow Demonstration</h2>
      <div className="flow-controls">
        <button 
          className="btn btn-send" 
          onClick={sendData}
          disabled={isAnimating}
        >
          Send Data ↓
        </button>
        <div className="flow-status">
          <span>{flowStatus}</span>
        </div>
        <button 
          className="btn btn-receive" 
          onClick={receiveData}
          disabled={isAnimating}
        >
          Receive Data ↑
        </button>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
};

export default DataFlowDemo;
