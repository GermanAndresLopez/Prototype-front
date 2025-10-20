import React, { useState, useEffect } from 'react';
import { ProvisionController } from '../../controllers/ProvisionController.js';
import { TemplateController } from '../../controllers/TemplateController.js';
import { ConfigService } from '../../services/ConfigService.js';
import { ProvisionForm } from '../components/ProvisionForm.jsx';
import { InfrastructureResult } from '../components/InfrastructureResult.jsx';
import { TemplateManager } from '../components/TemplateManager.jsx';
import { Notification } from '../components/Notification.jsx';

export const HomePage = () => {
  const [infrastructure, setInfrastructure] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);

  const configService = React.useMemo(() => new ConfigService(), []);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const configData = await configService.loadConfig();
        setConfig(configData);
      } catch (error) {
        setNotification({
          message: 'Error al cargar configuración. Verifica que el backend esté corriendo en puerto 3000',
          type: 'error'
        });
      }
    };
    loadConfig();
  }, [configService]);

  const loadLogs = async () => {
    try {
      const l = await provisionController.listLogs();
      setLogs(l || []);
    } catch (e) {
      console.error('Error loading logs', e);
    }
  };

  const provisionController = React.useMemo(() => {
    const controller = new ProvisionController();
    controller.subscribe((event) => {
      if (event.type === 'loading') {
        setIsLoading(true);
      } else if (event.type === 'success') {
        setIsLoading(false);
        setInfrastructure(event.data);
        setNotification({ message: event.message, type: 'success' });
      } else if (event.type === 'error') {
        setIsLoading(false);
        setNotification({ message: event.message, type: 'error' });
      }
    });
    return controller;
  }, []);

  const [savedInfras, setSavedInfras] = useState([]);
  const [templatesRefreshKey, setTemplatesRefreshKey] = useState(0);

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const items = await provisionController.listInfrastructures();
        setSavedInfras(items || []);
      } catch (e) {
        console.error('Error loading saved infrastructures', e);
      }
    };
    loadSaved();
  }, [provisionController]);

  const refreshSavedInfras = async () => {
    try {
      const items = await provisionController.listInfrastructures();
      setSavedInfras(items || []);
    } catch (e) {
      console.error('Error loading saved infrastructures', e);
    }
  };

  const templateController = React.useMemo(() => {
    const controller = new TemplateController();
    controller.subscribe((event) => {
      if (event.type === 'loading') {
        setIsLoading(true);
      } else if (event.type === 'success') {
        setIsLoading(false);
        if (event.data && event.data.vm) {
          setInfrastructure(event.data);
        }
        setNotification({ message: event.message, type: 'success' });
      } else if (event.type === 'error') {
        setIsLoading(false);
        setNotification({ message: event.message, type: 'error' });
      }
    });
    return controller;
  }, []);

  const handleProvision = async (formData) => {
    try {
      await provisionController.provision(formData);
    } catch (error) {
      console.error('Error en aprovisionamiento:', error);
    }
  };

  const handleSaveTemplate = () => {
    const name = prompt('Ingresa el nombre del template:');
    if (name && infrastructure) {
      templateController.saveTemplate(name, infrastructure).then(() => {
        // trigger template manager to refresh
        setTemplatesRefreshKey(k => k + 1);
      });
    }
  };

  const handleCloneTemplate = async (name, overrides) => {
    try {
      await templateController.cloneTemplate(name, overrides);
    } catch (error) {
      console.error('Error al clonar template:', error);
    }
  };

  return (
    <div className="home-page">
      <header className="app-header">
        <h1>Sistema de Aprovisionamiento Multi-Nube</h1>
        <p className="subtitle">Gestiona infraestructura en AWS, Azure, GCP y On-Premise</p>
      </header>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button className="btn-secondary" onClick={async () => { setShowLogs(s => !s); if (!showLogs) await loadLogs(); }}>
            Historial
          </button>
        </div>

        {showLogs && (
          <div className="content-section">
            <h2>Historial de Acciones</h2>
            {logs.length === 0 ? (
              <div>No hay registros</div>
            ) : (
              <ul className="logs-list">
                {logs.map(l => (
                  <li key={l.id} className="log-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{l.action}</strong> — {l.provider || l.details?.provider || '—'}
                        <div style={{ fontSize: 12, color: '#666' }}>{new Date(l.timestamp).toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>ID: {l.infraId || l.id}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, whiteSpace: 'pre-wrap' }}>{JSON.stringify(l.details || l.overrides || {}, null, 2)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="content-section">
          <h2>Nueva Infraestructura</h2>
          {config ? (
            <ProvisionForm
              onSubmit={handleProvision}
              isLoading={isLoading}
              config={config}
            />
          ) : (
            <div className="loading-message">Cargando configuración...</div>
          )}
        </div>

        {infrastructure && (
          <div className="content-section">
            <InfrastructureResult
              infrastructure={infrastructure}
              onSaveTemplate={handleSaveTemplate}
            />
          </div>
        )}

        <div className="content-section">
          <TemplateManager templateController={templateController} onCloneTemplate={handleCloneTemplate} refreshKey={templatesRefreshKey} />
        </div>

        <div className="content-section">
          <h2>Infraestructuras Guardadas</h2>
          {savedInfras.length === 0 ? (
            <div>No hay infraestructuras guardadas</div>
          ) : (
            <div className="saved-infras-grid">
              {savedInfras.map(item => {
                const infra = item.infra || {};
                const vm = infra.vm || {};
                const storage = infra.storage || {};
                // helpers
                const providerLabel = infra.provider || vm.proveedor || vm.provider || 'Unknown';
                const vmName = vm.name || vm.instancia || vm.machine_type || vm.tamaño_maquina || 'VM';
                const vmType = vm.instancia || vm.machine_type || vm.tamaño_maquina || '';
                const vcpus = vm.vcpus || vm.vcpu || '—';
                const memory = vm.memoryGB || vm.ram || '—';
                const storageSize = storage.size || storage.sizeGB || storage.disco || '—';

                return (
                  <div key={item.id} className="infra-card">
                    <div className="infra-card-header">
                      <div>
                        <strong>{vmName}</strong>
                        <div className="infra-provider">{providerLabel}</div>
                      </div>
                      
                    </div>
                    <div className="infra-card-body">
                      <div>Tipo: {vmType}</div>
                      <div>vCPUs: {vcpus}</div>
                      <div>RAM: {memory} GB</div>
                      <div>Almacenamiento: {storageSize} GB</div>
                    </div>
                    <div className="infra-actions">
                        <button className="btn-secondary" onClick={async () => {
                          if (!confirm(`Eliminar infraestructura ${item.id}?`)) return;
                          try {
                            await provisionController.deleteInfrastructure(item.id);
                            await refreshSavedInfras();
                          } catch (err) {
                            alert('Error eliminando infraestructura: ' + (err.message || err));
                          }
                        }}>Eliminar</button>
                      </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
