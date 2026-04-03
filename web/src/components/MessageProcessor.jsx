import React, { useState } from 'react';

const MessageProcessor = () => {
  const [message, setMessage] = useState('');
  const [transformations, setTransformations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processMessage = () => {
    if (!message.trim()) {
      alert('Please enter a message to process');
      return;
    }

    setIsProcessing(true);
    setTransformations([]);

    const steps = [
      { 
        layer: 'Application', 
        action: 'Application creates user data', 
        data: message 
      },
      { 
        layer: 'Presentation', 
        action: 'Data formatted and encrypted', 
        data: `[ENCRYPTED]${message}` 
      },
      { 
        layer: 'Session', 
        action: 'Session established', 
        data: `[SESSION_ID:12345][ENCRYPTED]${message}` 
      },
      { 
        layer: 'Transport', 
        action: 'Data segmented, TCP headers added', 
        data: `[TCP_PORT:80][SESSION_ID:12345][ENCRYPTED]${message}` 
      },
      { 
        layer: 'Network', 
        action: 'IP addressing and routing', 
        data: `[IP:192.168.1.1][TCP_PORT:80][SESSION_ID:12345][ENCRYPTED]${message}` 
      },
      { 
        layer: 'Data Link', 
        action: 'MAC addressing and framing', 
        data: `[MAC:00:11:22:33:44:55][IP:192.168.1.1][TCP_PORT:80][SESSION_ID:12345][ENCRYPTED]${message}` 
      },
      { 
        layer: 'Physical', 
        action: 'Converted to electrical signals', 
        data: '🔌 ⚡ 📡 [BINARY STREAM]' 
      }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setTransformations(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsProcessing(false);
        }
      }, index * 300);
    });
  };

  return (
    <section className="demo-section">
      <h2>Interactive Layer Demo</h2>
      <div className="input-group">
        <label htmlFor="messageInput">Enter a message to send:</label>
        <input
          id="messageInput"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hello, OSI Model!"
          onKeyPress={(e) => e.key === 'Enter' && processMessage()}
        />
      </div>
      <button 
        className="btn btn-process" 
        onClick={processMessage}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Process Through Layers'}
      </button>
      
      {transformations.length > 0 && (
        <div className="process-result">
          <h3>Data Transformation:</h3>
          <div className="transformation-steps">
            {transformations.map((step, index) => (
              <div key={index} className="transformation-step">
                <div className="step-title">Layer {7-index}: {step.layer}</div>
                <div className="step-action">{step.action}</div>
                <div className="step-data">{step.data}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MessageProcessor;
