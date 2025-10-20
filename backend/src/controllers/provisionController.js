const ProvisioningDirector = require('../core/provisioningDirector');
const AWSCloudBuilder = require('../builders/awsCloudBuilder');
const AzureCloudBuilder = require('../builders/azureCloudBuilder');
const GCPCloudBuilder = require('../builders/gcpCloudBuilder');
const OnPremiseCloudBuilder = require('../builders/onPremiseCloudBuilder');

const fs = require('fs');
const path = require('path');

class ProvisionController {
  constructor(factories) {
    this.factories = factories;
    this.director = new ProvisioningDirector();
    this.templates = {};
    this.dataDir = path.resolve(__dirname, '..', '..', 'data');
    this.templatesFile = path.join(this.dataDir, 'templates.json');
    this._loadTemplatesFromDisk();
    this.infrastructuresFile = path.join(this.dataDir, 'infrastructures.json');
    this.infrastructures = {};
    this._loadInfrastructuresFromDisk();
  }

  _loadTemplatesFromDisk() {
    try {
      if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
      if (!fs.existsSync(this.templatesFile)) {
        fs.writeFileSync(this.templatesFile, JSON.stringify({}), 'utf8');
      }
      const raw = fs.readFileSync(this.templatesFile, 'utf8');
      this.templates = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Error loading templates from disk:', err);
      this.templates = {};
    }
  }

  _saveTemplatesToDisk() {
    try {
      if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.templatesFile, JSON.stringify(this.templates, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving templates to disk:', err);
    }
  }

  _loadInfrastructuresFromDisk() {
    try {
      if (!fs.existsSync(this.infrastructuresFile)) {
        fs.writeFileSync(this.infrastructuresFile, JSON.stringify({}), 'utf8');
      }
      const raw = fs.readFileSync(this.infrastructuresFile, 'utf8');
      this.infrastructures = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Error loading infrastructures from disk:', err);
      this.infrastructures = {};
    }
  }

  _saveInfrastructuresToDisk() {
    try {
      if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.infrastructuresFile, JSON.stringify(this.infrastructures, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving infrastructures to disk:', err);
    }
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
    try {
      const key = 'infra-' + Date.now();
      this.infrastructures[key] = result;
      this._saveInfrastructuresToDisk();
    } catch (e) {
      console.error('Error persisting infrastructure:', e);
    }
    return result;
  }

  listInfrastructures() {
    return Object.keys(this.infrastructures).map(k => ({ id: k, infra: this.infrastructures[k] }));
  }

  saveTemplate(name, infra) {
    if(!name) throw new Error('template name required');
    const toSave = infra || this.lastResult;
    if(!toSave) throw new Error('no infra to save');
    this.templates[name] = toSave;
    this._saveTemplatesToDisk();
    return { status: 'ok', saved: name };
  }

  listTemplates() {
    
    return Object.keys(this.templates).map(name => ({ name, infra: this.templates[name] }));
  }

  async cloneTemplate(name, overrides) {
    const template = this.templates[name];
    if(!template) throw new Error('template not found: ' + name);
   
    const cloneEntity = (entity) => {
      if (!entity) return null;
      if (typeof entity.clone === 'function') return entity.clone();
      // plain object -> deep copy
      return JSON.parse(JSON.stringify(entity));
    };

    const vmClone = cloneEntity(template.vm);
    const netClone = cloneEntity(template.network);
    const storageClone = cloneEntity(template.storage);

    Object.assign(vmClone, overrides.vm || {});
    Object.assign(netClone, overrides.network || {});
    Object.assign(storageClone, overrides.storage || {});

    const result = { status: 'success', vm: vmClone, network: netClone, storage: storageClone };

    try {
      const key = 'infra-' + Date.now();
      this.infrastructures[key] = { vm: vmClone, network: netClone, storage: storageClone };
      this._saveInfrastructuresToDisk();
      result.id = key;
    } catch (e) {
      console.error('Error persisting cloned infrastructure:', e);
    }

    return result;
  }

  deleteTemplate(name) {
    if (!this.templates[name]) throw new Error('template not found: ' + name);
    delete this.templates[name];
    this._saveTemplatesToDisk();
    return { status: 'ok', deleted: name };
  }

  deleteInfrastructure(id) {
    if (!this.infrastructures[id]) throw new Error('infrastructure not found: ' + id);
    delete this.infrastructures[id];
    this._saveInfrastructuresToDisk();
    return { status: 'ok', deleted: id };
  }
}

module.exports = ProvisionController;
