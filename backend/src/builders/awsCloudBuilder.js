const ICloudBuilder = require('./ibuilder');
class AWSCloudBuilder extends ICloudBuilder {
  constructor(factory) {
    super();
    this.factory = factory;
    this.reset();
  }
  reset() {
    this.networkSpec = {};
    this.storageSpec = {};
    this.vmSpec = {};
    this.network = null;
    this.storage = null;
    this.vm = null;
  }
  setFlavor(choice){ this.vmSpec.instancia = choice; }
  setNetworkSpec(s){ this.networkSpec = Object.assign({}, this.networkSpec, s); }
  setStorageSpec(s){ this.storageSpec = Object.assign({}, this.storageSpec, s); }
  setVMSpec(s){ this.vmSpec = Object.assign({}, this.vmSpec, s); }
  async buildNetwork(){ this.network = await this.factory.crearNetworking(this.networkSpec); }
  async buildStorage(){ this.storage = await this.factory.crearStorage(this.storageSpec); }
  async buildVM(){ 
    this.vmSpec.region = this.vmSpec.region || (this.network && this.network.region) || (this.storage && this.storage.region);
    this.vmSpec.networkId = this.network && this.network.id;
    this.vmSpec.diskId = this.storage && this.storage.id;
    this.vm = await this.factory.crearVM(this.vmSpec);
  }
  getResult(){ return { status:'success', vm: this.vm, network: this.network, storage: this.storage }; }
  cloneConfiguration(){ 
    const clone = new AWSCloudBuilder(this.factory);
    clone.network = this.network ? this.network.clone() : null;
    clone.storage = this.storage ? this.storage.clone() : null;
    clone.vm = this.vm ? this.vm.clone() : null;
    clone.networkSpec = JSON.parse(JSON.stringify(this.networkSpec));
    clone.storageSpec = JSON.parse(JSON.stringify(this.storageSpec));
    clone.vmSpec = JSON.parse(JSON.stringify(this.vmSpec));
    return clone;
  }
}
module.exports = AWSCloudBuilder;
