import { ApiService } from '../services/ApiService.js';
import { ProvisionModel } from '../models/ProvisionModel.js';
import { InfrastructureModel } from '../models/InfrastructureModel.js';

export class ProvisionController {
  constructor() {
    this.apiService = new ApiService();
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify(data) {
    this.listeners.forEach(listener => listener(data));
  }

  async provision(provisionData) {
    try {
      const model = new ProvisionModel(
        provisionData.provider,
        provisionData.builderType,
        provisionData.choice,
        provisionData.specs
      );

      model.validate();

      this.notify({ type: 'loading', message: 'Aprovisionando infraestructura...' });

      const response = await this.apiService.post('/provision', model.toJSON());

      const infrastructure = new InfrastructureModel({
        ...response,
        provider: provisionData.provider
      });

      this.notify({
        type: 'success',
        message: 'Infraestructura aprovisionada exitosamente',
        data: infrastructure
      });

      return infrastructure;
    } catch (error) {
      this.notify({
        type: 'error',
        message: error.message || 'Error al aprovisionar infraestructura'
      });
      throw error;
    }
  }

  async listInfrastructures() {
    try {
      const response = await this.apiService.get('/infrastructures');
      return response.infrastructures || [];
    } catch (err) {
      this.notify({ type: 'error', message: err.message || 'Error al listar infraestructuras' });
      return [];
    }
  }

  async listLogs() {
    try {
      const response = await this.apiService.get('/logs');
      return response.logs || [];
    } catch (err) {
      this.notify({ type: 'error', message: err.message || 'Error al listar logs' });
      return [];
    }
  }

  async deleteInfrastructure(id) {
    try {
      const response = await this.apiService.request(`/infrastructure/${encodeURIComponent(id)}`, { method: 'DELETE' });
      return response;
    } catch (err) {
      this.notify({ type: 'error', message: err.message || 'Error al eliminar infrastructure' });
      throw err;
    }
  }

  async updateInfrastructureState(id, state) {
    try {
      const response = await this.apiService.request(`/infrastructure/${encodeURIComponent(id)}/state`, { method: 'PATCH', body: JSON.stringify({ state }) });
      return response;
    } catch (err) {
      this.notify({ type: 'error', message: err.message || 'Error al actualizar estado' });
      throw err;
    }
  }
}
