import { ApiService } from './ApiService.js';

export class ConfigService {
  constructor() {
    this.apiService = new ApiService();
    this.config = null;
  }

  async loadConfig() {
    if (!this.config) {
      this.config = await this.apiService.get('/config');
    }
    return this.config;
  }

  getProviders() {
    return this.config?.providers || [];
  }

  getBuilderTypes() {
    return this.config?.builderTypes || [];
  }

  getMachineTypes(provider) {
    const providerKey = provider?.toUpperCase();
    return this.config?.machineTypes?.[providerKey] || {};
  }

  getRegions(provider) {
    const providerKey = provider?.toUpperCase();
    return this.config?.regions?.[providerKey] || [];
  }

  getStorageTypes(provider) {
    const providerKey = provider?.toUpperCase();
    return this.config?.storageTypes?.[providerKey] || [];
  }
}
