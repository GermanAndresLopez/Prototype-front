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
      templateController.saveTemplate(name, infrastructure);
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
          <TemplateManager onCloneTemplate={handleCloneTemplate} />
        </div>
      </div>
    </div>
  );
};
