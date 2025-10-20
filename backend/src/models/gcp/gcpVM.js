class GCPVM {
  constructor(spec={}){
    const { machine_type=null, region=null, vcpus=null, memoryGB=null, name=null } = spec;
  this.id = 'vm-gcp-' + Date.now(); this.estado='running'; this.proveedor='GCP';
    this.name = name || null;
    this.machine_type = machine_type; this.region = region; this.vcpus = vcpus; this.memoryGB = memoryGB;
  }
  clone(){ return new GCPVM(JSON.parse(JSON.stringify(this))); }
}
module.exports = GCPVM;
