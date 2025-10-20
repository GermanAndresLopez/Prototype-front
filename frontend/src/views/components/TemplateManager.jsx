import React, { useState, useEffect } from 'react';

export const TemplateManager = ({ templateController, onCloneTemplate, refreshKey }) => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState('');
  const [overridesJSON, setOverridesJSON] = useState('');
  const [overridesObj, setOverridesObj] = useState({});
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!templateController) return;
      const list = await templateController.listTemplates();
      setTemplates(list || []);
    };
    load();
  }, [templateController, refreshKey]);

  const refreshList = async () => {
    if (!templateController) return;
    const list = await templateController.listTemplates();
    setTemplates(list || []);
  };

  useEffect(() => {
    // when selected template changes, reset overrides
    setOverridesJSON('');
    setOverridesObj({});
    setJsonError('');
  }, [selected]);

  const handleClone = () => {
    let parsedOverrides = overridesObj;
    if (overridesJSON.trim()) {
      try {
        parsedOverrides = JSON.parse(overridesJSON);
      } catch (error) {
        alert('Error al parsear JSON de overrides');
        return;
      }
    }
    onCloneTemplate(selected, parsedOverrides);
  };

  const handleOverridesChange = (value) => {
    setOverridesJSON(value);
    if (!value.trim()) {
      setJsonError('');
      setOverridesObj({});
      return;
    }
    try {
      const parsed = JSON.parse(value);
      setOverridesObj(parsed);
      setJsonError('');
    } catch (err) {
      setJsonError(err.message);
    }
  };

  return (
    <div className="template-manager">
      <h3>Clonar Template</h3>

      <div className="form-group">
        <label className="form-label">Template</label>
        <select className="form-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Seleccione un template</option>
          {templates.map(t => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Overrides (JSON)</label>
        <textarea
          className="form-textarea"
          value={overridesJSON}
          onChange={(e) => handleOverridesChange(e.target.value)}
          placeholder='{"vm": {"vcpus": 2}, "storage": {"size": 50}}'
          rows={8}
        />
        {jsonError && <div className="form-error">JSON inválido: {jsonError}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Preview del Template Seleccionado</label>
        <pre className="template-preview">
          {selected ? JSON.stringify(templates.find(t => t.name === selected)?.infra, null, 2) : 'Ningún template seleccionado'}
        </pre>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn-secondary" onClick={handleClone} disabled={!selected || !!jsonError}>Clonar Template</button>
        <button className="btn-danger" onClick={async () => {
          if (!selected) return;
          if (!confirm(`Eliminar template "${selected}"? Esta acción no se puede deshacer.`)) return;
          try {
            await templateController.deleteTemplate(selected);
            await refreshList();
            setSelected('');
          } catch (err) {
            alert('Error eliminando template: ' + (err.message || err));
          }
        }}>Eliminar Template</button>
      </div>
    </div>
  );
};
