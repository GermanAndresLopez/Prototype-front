import React from 'react';

export const ProviderSelector = ({ value, onChange }) => {
  const providers = [
    { value: 'aws', label: 'Amazon Web Services (AWS)', icon: '☁️' },
    { value: 'azure', label: 'Microsoft Azure', icon: '🔷' },
    { value: 'gcp', label: 'Google Cloud Platform', icon: '🌐' },
    { value: 'onpremise', label: 'On-Premise', icon: '🏢' }
  ];

  return (
    <div className="provider-selector">
      <label className="form-label">Proveedor de Nube</label>
      <div className="provider-grid">
        {providers.map(provider => (
          <button
            key={provider.value}
            type="button"
            className={`provider-card ${value === provider.value ? 'active' : ''}`}
            onClick={() => onChange(provider.value)}
          >
            <span className="provider-icon">{provider.icon}</span>
            <span className="provider-label">{provider.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
