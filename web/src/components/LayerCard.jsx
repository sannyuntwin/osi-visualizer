import React from 'react';

const LayerCard = ({ layer, isActive, onHover, showInfo }) => {
  const { number, name, description, protocols, color, functions } = layer;
  
  return (
    <div 
      className={`layer-card layer-${number} ${isActive ? 'active' : ''}`}
      data-layer={number}
      onMouseEnter={() => onHover(layer)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="layer-header">
        <div className="layer-title">
          <h3>L{number}: {name}</h3>
          <p>{description}</p>
        </div>
        <span className="layer-number">{number}</span>
      </div>
      <div className="layer-content">
        <div className="protocol-tags">
          {protocols.slice(0, 3).map((protocol, index) => (
            <span key={index} className="protocol-tag">{protocol}</span>
          ))}
        </div>
        <p className="layer-description">{layer.fullDescription}</p>
      </div>
      
      {showInfo && (
        <div className="layer-info">
          <div className="info-title">Key Functions:</div>
          <ul>
            {functions.map((func, index) => (
              <li key={index}>{func}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LayerCard;
