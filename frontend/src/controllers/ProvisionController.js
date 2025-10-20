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
}
