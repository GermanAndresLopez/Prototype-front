import { ApiService } from '../services/ApiService.js';
import { TemplateModel, CloneTemplateModel } from '../models/TemplateModel.js';
import { InfrastructureModel } from '../models/InfrastructureModel.js';

export class TemplateController {
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

  async saveTemplate(name, infrastructure) {
    try {
      const model = new TemplateModel(name, infrastructure);
      model.validate();

      this.notify({ type: 'loading', message: 'Guardando template...' });

      const response = await this.apiService.post('/template', model.toJSON());

      this.notify({
        type: 'success',
        message: `Template "${name}" guardado exitosamente`,
        data: response
      });

      return response;
    } catch (error) {
      this.notify({
        type: 'error',
        message: error.message || 'Error al guardar template'
      });
      throw error;
    }
  }

  async cloneTemplate(name, overrides = {}) {
    try {
      const model = new CloneTemplateModel(name, overrides);
      model.validate();

      this.notify({ type: 'loading', message: 'Clonando template...' });

      const response = await this.apiService.post('/template/clone', model.toJSON());

      const infrastructure = new InfrastructureModel(response);

      this.notify({
        type: 'success',
        message: `Template "${name}" clonado exitosamente`,
        data: infrastructure
      });

      return infrastructure;
    } catch (error) {
      this.notify({
        type: 'error',
        message: error.message || 'Error al clonar template'
      });
      throw error;
    }
  }
}
