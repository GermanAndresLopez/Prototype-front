class OnPremiseVM {
  constructor(spec={}){
    const { recurso_cpu=null, ram=null, disco=null, red_fisica=null, vcpus=null, memoryGB=null, name=null } = spec;
  this.id = 'vm-onprem-' + Date.now(); this.estado='running'; this.proveedor='OnPremise';
    this.name = name || null;
    this.recurso_cpu = recurso_cpu; this.ram = ram; this.disco = disco; this.red_fisica = red_fisica; this.vcpus = vcpus; this.memoryGB = memoryGB;
  }
  clone(){ return new OnPremiseVM(JSON.parse(JSON.stringify(this))); }
}
module.exports = OnPremiseVM;
