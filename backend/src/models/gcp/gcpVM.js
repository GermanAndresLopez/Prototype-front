class GCPVM {
  constructor(spec={}){
    const { machine_type=null, region=null, vcpus=null, memoryGB=null } = spec;
    this.id = 'vm-gcp-' + Date.now(); this.estado='provisionado'; this.proveedor='GCP';
    this.machine_type = machine_type; this.region = region; this.vcpus = vcpus; this.memoryGB = memoryGB;
  }
  clone(){ return new GCPVM(JSON.parse(JSON.stringify(this))); }
}
module.exports = GCPVM;
