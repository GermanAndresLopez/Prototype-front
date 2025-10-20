class AzureStorage {
  constructor(spec={}){
    const { region, diskSku=null, sizeGB=null, managedDisk=false } = spec;
    if(!region) throw new Error('Azure storage: region required');
    if(!sizeGB) throw new Error('Azure storage: sizeGB required');
    this.region = region; this.diskSku = diskSku; this.sizeGB = sizeGB; this.managedDisk = !!managedDisk;
    this.id = 'disk-azure-' + Date.now();
  }
  clone(){ return new AzureStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = AzureStorage;
