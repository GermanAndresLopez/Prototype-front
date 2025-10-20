export class InfrastructureModel {
  constructor(data = {}) {
    this.vm = data.vm || null;
    this.network = data.network || null;
    this.storage = data.storage || null;
    this.provider = data.provider || '';
    this.timestamp = data.timestamp || new Date().toISOString();
  }

  isEmpty() {
    return !this.vm && !this.network && !this.storage;
  }

  getProviderLabel() {
    const labels = {
      aws: 'Amazon Web Services',
      azure: 'Microsoft Azure',
      gcp: 'Google Cloud Platform',
      onpremise: 'On-Premise'
    };
    return labels[this.provider?.toLowerCase()] || this.provider;
  }
}
