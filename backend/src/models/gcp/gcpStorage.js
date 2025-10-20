class GCPStorage {
  constructor(spec={}){
    const { region, diskType=null, sizeGB=null, size=null, autoDelete=false } = spec;
    let finalSize = sizeGB != null ? sizeGB : size;
    if (typeof finalSize === 'string' && finalSize.trim() !== '') {
      const n = Number(finalSize);
      finalSize = Number.isFinite(n) ? n : finalSize;
    }
    if(!region) throw new Error('GCP storage: region required');
    if(finalSize == null || finalSize === '') throw new Error('GCP storage: sizeGB required');
    this.region = region; this.diskType = diskType; this.sizeGB = finalSize; this.autoDelete = !!autoDelete;
    this.id = 'disk-gcp-' + Date.now();
  }
  clone(){ return new GCPStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = GCPStorage;
