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
    this.logsFile = path.join(this.dataDir, 'logs.json');
    this.logs = {};
    this._loadLogsFromDisk();
  }

  _loadLogsFromDisk() {
    try {
      if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
      if (!fs.existsSync(this.logsFile)) {
        fs.writeFileSync(this.logsFile, JSON.stringify({}), 'utf8');
      }
      const raw = fs.readFileSync(this.logsFile, 'utf8');
      this.logs = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Error loading logs from disk:', err);
      this.logs = {};
    }
  }

  _saveLogsToDisk() {
    try {
      if (!fs.existsSync(this.dataDir)) fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(this.logsFile, JSON.stringify(this.logs, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving logs to disk:', err);
    }
  }

  _addLog(entry) {
    try {
      const id = 'log-' + Date.now();
      const logEntry = Object.assign({ id, timestamp: new Date().toISOString() }, entry);
      this.logs[id] = logEntry;
      this._saveLogsToDisk();
      return logEntry;
    } catch (err) {
      console.error('Error adding log:', err);
    }
  }

  listLogs() {
    return Object.keys(this.logs).map(k => this.logs[k]).sort((a,b) => (a.timestamp < b.timestamp ? 1 : -1));
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
      // include provider in persisted infra so UI can show provider later
      const persist = Object.assign({}, result, { provider });
      this.infrastructures[key] = persist;
      this._saveInfrastructuresToDisk();
      // add audit log entry
      this._addLog({ action: 'provision', provider, infraId: key, details: { vm: result.vm, network: result.network, storage: result.storage } });
      // return result enriched with provider as well
      return Object.assign({}, result, { provider });
    } catch (e) {
      console.error('Error persisting infrastructure:', e);
      this._addLog({ action: 'provision', provider, infraId: null, details: { vm: result.vm, network: result.network, storage: result.storage, error: e.message } });
      return Object.assign({}, result, { provider });
    }
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

  const providerFromTemplate = template.provider || (template.vm && (template.vm.proveedor || template.vm.provider)) || null;
  const providerFromOverrides = overrides.provider || null;
  const providerToUse = providerFromOverrides || providerFromTemplate || null;

  const result = { status: 'success', vm: vmClone, network: netClone, storage: storageClone, provider: providerToUse };

    try {
  const key = 'infra-' + Date.now();
  this.infrastructures[key] = { vm: vmClone, network: netClone, storage: storageClone, provider: providerToUse };
      this._saveInfrastructuresToDisk();
      result.id = key;
      // log clone action
      this._addLog({ action: 'clone-template', template: name, infraId: key, provider: providerToUse, overrides });
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

  updateInfrastructureState(id, newState) {
    const infra = this.infrastructures[id];
    if (!infra) throw new Error('infrastructure not found: ' + id);
    if (infra.vm) {
      infra.vm.estado = newState;
      this._saveInfrastructuresToDisk();
      return { status: 'ok', id, state: newState };
    }
    throw new Error('infrastructure has no vm to update');
  }
}

module.exports = ProvisionController;
