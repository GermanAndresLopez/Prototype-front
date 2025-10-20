class AzureVM {
  constructor(spec={}){
    const { tamaño_maquina=null, resource_group=null, imagen=null, vcpus=null, memoryGB=null } = spec;
    this.id = 'vm-azure-' + Date.now(); this.estado='provisionado'; this.proveedor='Azure';
    this.tamaño_maquina = tamaño_maquina; this.resource_group = resource_group; this.imagen = imagen; this.vcpus = vcpus; this.memoryGB = memoryGB;
  }
  clone(){ return new AzureVM(JSON.parse(JSON.stringify(this))); }
}
module.exports = AzureVM;
