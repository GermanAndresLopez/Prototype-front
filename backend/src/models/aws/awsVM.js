class AWSVM {
  constructor(spec={}){
    const { instancia=null, region=null, vcpus=null, memoryGB=null, memoryOptimization=false, diskOptimization=false, keyPairName=null, name=null } = spec;
  this.id = 'vm-aws-' + Date.now();
  this.estado = 'running'; this.proveedor = 'AWS';
    this.name = name || null;
    this.instancia = instancia; this.region = region; this.vcpus = vcpus; this.memoryGB = memoryGB;
    this.memoryOptimization = !!memoryOptimization; this.diskOptimization = !!diskOptimization; this.keyPairName = keyPairName;
  }
  clone(){ return new AWSVM(JSON.parse(JSON.stringify(this))); }
}
module.exports = AWSVM;
