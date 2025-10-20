class AzureStorage {
  constructor(spec={}){
    // Accept either `sizeGB` or `size` (some callers use `size`)
    const { region, diskSku=null, sizeGB=null, size=null, managedDisk=false } = spec;
    // prefer explicit sizeGB, fall back to size
    let finalSize = sizeGB != null ? sizeGB : size;
    // try to coerce strings to number
    if (typeof finalSize === 'string' && finalSize.trim() !== '') {
      const n = Number(finalSize);
      finalSize = Number.isFinite(n) ? n : finalSize;
    }
    if(!region) throw new Error('Azure storage: region required');
    if(finalSize == null || finalSize === '') throw new Error('Azure storage: sizeGB required');
    this.region = region;
    this.diskSku = diskSku;
    this.sizeGB = finalSize;
    this.managedDisk = !!managedDisk;
    this.id = 'disk-azure-' + Date.now();
  }
  clone(){ return new AzureStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = AzureStorage;
