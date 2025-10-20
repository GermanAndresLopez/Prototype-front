import React, { useState } from 'react';

export const TemplateManager = ({ onCloneTemplate }) => {
  const [templateName, setTemplateName] = useState('');
  const [overrides, setOverrides] = useState('');

  const handleClone = () => {
    let parsedOverrides = {};

    if (overrides.trim()) {
      try {
        parsedOverrides = JSON.parse(overrides);
      } catch (error) {
        alert('Error al parsear JSON de overrides');
        return;
      }
    }

    onCloneTemplate(templateName, parsedOverrides);
  };

  return (
    <div className="template-manager">
      <h3>Clonar Template</h3>

      <div className="form-group">
        <label className="form-label">Nombre del Template</label>
        <input
          type="text"
          className="form-input"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Nombre del template a clonar"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Overrides (JSON opcional)</label>
        <textarea
          className="form-textarea"
          value={overrides}
          onChange={(e) => setOverrides(e.target.value)}
          placeholder='{"vm": {"size": "large"}, "network": {...}}'
          rows={5}
        />
      </div>

      <button
        className="btn-secondary"
        onClick={handleClone}
        disabled={!templateName}
      >
        Clonar Template
      </button>
    </div>
  );
};
