const ICloudBuilder = require('./ibuilder');
class GCPCloudBuilder extends ICloudBuilder {
  constructor(factory) {
    super();
    this.factory = factory;
    this.reset();
  }
  reset(){ this.networkSpec={}; this.storageSpec={}; this.vmSpec={}; this.network=null; this.storage=null; this.vm=null; }
  setFlavor(choice){ 
    this.vmSpec.machine_type = choice;
    try {
      const pd = require('../core/provisioningDirector');
      const types = pd.MACHINE_TYPES.GCP || {};
      for (const family of Object.keys(types)){
        const map = types[family];
        if (map && map[choice]){
          const { vcpu, ram } = map[choice];
          this.vmSpec.vcpus = vcpu; this.vmSpec.memoryGB = ram;
          const defaultSize = Math.max(30, Math.ceil(ram * 10));
          if (this.storageSpec.size == null && this.storageSpec.sizeGB == null) this.storageSpec.size = defaultSize;
          break;
        }
      }
    } catch(e) {}
  }
  setNetworkSpec(s){ this.networkSpec = Object.assign({}, this.networkSpec, s); }
  setStorageSpec(s){ this.storageSpec = Object.assign({}, this.storageSpec, s); }
  setVMSpec(s){ this.vmSpec = Object.assign({}, this.vmSpec, s); }
  async buildNetwork(){ this.network = await this.factory.crearNetworking(this.networkSpec); }
  async buildStorage(){ this.storage = await this.factory.crearStorage(this.storageSpec); }
  async buildVM(){ 
    this.vmSpec.region = this.vmSpec.region || (this.network && this.network.region) || (this.storage && this.storage.region);
    this.vmSpec.networkId = this.network && this.network.id;
    this.vmSpec.diskId = this.storage && this.storage.id;
    // Map flavor choice to vcpus and memoryGB if available
    try {
      const pd = require('../core/provisioningDirector');
      const choice = this.vmSpec.machine_type || this.vmSpec.flavor || this.vmSpec.instancia || this.vmSpec.tamaño_maquina;
      if (choice) {
        const types = pd.MACHINE_TYPES.GCP || {};
        for (const family of Object.keys(types)) {
          const map = types[family];
          if (map && map[choice]) {
            const { vcpu, ram } = map[choice];
            this.vmSpec.vcpus = vcpu; this.vmSpec.memoryGB = ram;
            break;
          }
        }
      }
    } catch (e) {}
    this.vm = await this.factory.crearVM(this.vmSpec);
  }
  getResult(){ return { status:'success', vm:this.vm, network:this.network, storage:this.storage }; }
  cloneConfiguration(){ 
    const clone = new GCPCloudBuilder(this.factory);
    clone.network = this.network ? this.network.clone() : null;
    clone.storage = this.storage ? this.storage.clone() : null;
    clone.vm = this.vm ? this.vm.clone() : null;
    clone.networkSpec = JSON.parse(JSON.stringify(this.networkSpec));
    clone.storageSpec = JSON.parse(JSON.stringify(this.storageSpec));
    clone.vmSpec = JSON.parse(JSON.stringify(this.vmSpec));
    return clone;
  }
}
module.exports = GCPCloudBuilder;
