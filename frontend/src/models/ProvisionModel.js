export class ProvisionModel {
  constructor(provider = '', builderType = 'standard', choice = '', specs = {}) {
    this.provider = provider;
    this.builderType = builderType;
    this.choice = choice;
    this.specs = specs;
  }

  validate() {
    if (!this.provider) {
      throw new Error('El proveedor es requerido');
    }
    const validProviders = ['aws', 'azure', 'gcp', 'onpremise'];
    if (!validProviders.includes(this.provider.toLowerCase())) {
      throw new Error('Proveedor no válido. Opciones: aws, azure, gcp, onpremise');
    }
    return true;
  }

  toJSON() {
    return {
      provider: this.provider,
      builderType: this.builderType,
      choice: this.choice,
      specs: this.specs
    };
  }
}
