import React from 'react';

export const InfrastructureResult = ({ infrastructure, onSaveTemplate }) => {
  if (!infrastructure || infrastructure.isEmpty()) {
    return null;
  }

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="infrastructure-result">
      <div className="result-header">
        <h2>Infraestructura Aprovisionada</h2>
        {infrastructure.provider && (
          <span className="provider-badge">{infrastructure.getProviderLabel()}</span>
        )}
      </div>

      <div className="result-grid">
        {infrastructure.vm && (
          <div className="result-card">
            <h3>Máquina Virtual</h3>
            <pre className="result-code">{formatJSON(infrastructure.vm)}</pre>
          </div>
        )}

        {infrastructure.network && (
          <div className="result-card">
            <h3>Red</h3>
            <pre className="result-code">{formatJSON(infrastructure.network)}</pre>
          </div>
        )}

        {infrastructure.storage && (
          <div className="result-card">
            <h3>Almacenamiento</h3>
            <pre className="result-code">{formatJSON(infrastructure.storage)}</pre>
          </div>
        )}
      </div>

      <button
        className="btn-secondary"
        onClick={onSaveTemplate}
      >
        Guardar como Template
      </button>
    </div>
  );
};
