import React, { useState, useEffect } from 'react';
import { ProviderSelector } from './ProviderSelector.jsx';

export const ProvisionForm = ({ onSubmit, isLoading, config }) => {
  const [formData, setFormData] = useState({
    provider: '',
    builderType: 'standard',
    choice: '',
    machineCategory: '',
    machineType: '',
    specs: {
      region: '',
      storageType: '',
      name: ''
    }
  });

  const [machineCategories, setMachineCategories] = useState([]);
  const [machineTypes, setMachineTypes] = useState([]);

  useEffect(() => {
    if (formData.provider && config) {
      const providerKey = formData.provider.toUpperCase();
      const types = config.machineTypes?.[providerKey] || {};
      setMachineCategories(Object.keys(types));
      setFormData(prev => ({ ...prev, machineCategory: '', machineType: '' }));
      setMachineTypes([]);
    }
  }, [formData.provider, config]);

  useEffect(() => {
    if (formData.provider && formData.machineCategory && config) {
      const providerKey = formData.provider.toUpperCase();
      const types = config.machineTypes?.[providerKey]?.[formData.machineCategory] || {};
      setMachineTypes(Object.keys(types));
      setFormData(prev => ({ ...prev, machineType: '' }));
    }
  }, [formData.machineCategory, formData.provider, config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleProviderChange = (provider) => {
    setFormData({
      ...formData,
      provider,
      machineCategory: '',
      machineType: '',
      specs: { region: '', storageType: '', name: '' }
    });
  };

  const handleSpecChange = (key, value) => {
    setFormData({
      ...formData,
      specs: { ...formData.specs, [key]: value }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="provision-form">
      <ProviderSelector
        value={formData.provider}
        onChange={handleProviderChange}
      />

      <div className="form-group">
        <label className="form-label">Tipo de Builder</label>
        <select
          className="form-select"
          value={formData.builderType}
          onChange={(e) => setFormData({ ...formData, builderType: e.target.value })}
        >
          {config?.builderTypes?.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Opción de Infraestructura</label>
        <input
          type="text"
          className="form-input"
          value={formData.choice}
          onChange={(e) => setFormData({ ...formData, choice: e.target.value })}
          placeholder="Ej: web, database, storage"
        />
      </div>

      <div className="specs-section">
        <h3>Especificaciones de Máquina</h3>

        <div className="form-group">
          <label className="form-label">Categoría de Máquina</label>
          <select
            className="form-select"
            value={formData.machineCategory}
            onChange={(e) => setFormData({ ...formData, machineCategory: e.target.value })}
            disabled={!formData.provider}
          >
            <option value="">Seleccione una categoría</option>
            {machineCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Máquina</label>
          <select
            className="form-select"
            value={formData.machineType}
            onChange={(e) => setFormData({ ...formData, machineType: e.target.value })}
            disabled={!formData.machineCategory}
          >
            <option value="">Seleccione un tipo</option>
            {machineTypes.map(type => {
              const providerKey = formData.provider.toUpperCase();
              const specs = config?.machineTypes?.[providerKey]?.[formData.machineCategory]?.[type];
              return (
                <option key={type} value={type}>
                  {type} ({specs?.vcpu} vCPU, {specs?.ram} GB RAM)
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Región</label>
          <select
            className="form-select"
            value={formData.specs.region}
            onChange={(e) => handleSpecChange('region', e.target.value)}
            disabled={!formData.provider}
          >
            <option value="">Seleccione una región</option>
            {config?.regions?.[formData.provider?.toUpperCase()]?.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Almacenamiento</label>
          <select
            className="form-select"
            value={formData.specs.storageType}
            onChange={(e) => handleSpecChange('storageType', e.target.value)}
            disabled={!formData.provider}
          >
            <option value="">Seleccione tipo de almacenamiento</option>
            {config?.storageTypes?.[formData.provider?.toUpperCase()]?.map(storage => (
              <option key={storage} value={storage}>{storage}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Nombre del Recurso</label>
          <input
            type="text"
            className="form-input"
            value={formData.specs.name}
            onChange={(e) => handleSpecChange('name', e.target.value)}
            placeholder="Nombre descriptivo"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={!formData.provider || isLoading}
      >
        {isLoading ? 'Aprovisionando...' : 'Aprovisionar Infraestructura'}
      </button>
    </form>
  );
};
