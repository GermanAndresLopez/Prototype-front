const ProvisioningDirector = require('../core/provisioningDirector');
const AWSCloudBuilder = require('../builders/awsCloudBuilder');
const AzureCloudBuilder = require('../builders/azureCloudBuilder');
const GCPCloudBuilder = require('../builders/gcpCloudBuilder');
const OnPremiseCloudBuilder = require('../builders/onPremiseCloudBuilder');

class ProvisionController {
  constructor(factories) {
    this.factories = factories;
    this.director = new ProvisioningDirector();
    this.templates = {}; // in-memory templates
  }

  _selectBuilder(provider) {
    const p = (provider || '').toLowerCase();
    switch(p) {
      case 'aws': return (factory) => new AWSCloudBuilder(factory);
      case 'azure': return (factory) => new AzureCloudBuilder(factory);
      case 'gcp': return (factory) => new GCPCloudBuilder(factory);
      case 'onpremise': return (factory) => new OnPremiseCloudBuilder(factory);
      default: throw new Error('Proveedor no soportado: ' + provider);
    }
  }

  async provision(provider, builderType='standard', choice, specs={}) {
    if(!provider) throw new Error('provider is required');
    const key = provider.toLowerCase();
    const factory = this.factories[key];
    if(!factory) throw new Error('Factory not found for provider ' + provider);

    const builderFactory = this._selectBuilder(provider);
    const builder = builderFactory(factory);

    this.director.setBuilder(builder);
    await this.director.construct({ choice, builderType, specs });
    const result = this.director.getResult();
    this.lastResult = result;
    return result;
  }

  saveTemplate(name, infra) {
    if(!name) throw new Error('template name required');
    const toSave = infra || this.lastResult;
    if(!toSave) throw new Error('no infra to save');
    this.templates[name] = toSave;
    return { status: 'ok', saved: name };
  }

  async cloneTemplate(name, overrides) {
    const template = this.templates[name];
    if(!template) throw new Error('template not found: ' + name);
    const vmClone = template.vm.clone();
    const netClone = template.network.clone();
    const storageClone = template.storage.clone();
    Object.assign(vmClone, overrides.vm || {});
    Object.assign(netClone, overrides.network || {});
    Object.assign(storageClone, overrides.storage || {});
    return { status: 'success', vm: vmClone, network: netClone, storage: storageClone };
  }
}

module.exports = ProvisionController;
