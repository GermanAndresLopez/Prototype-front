class GCPStorage {
  constructor(spec={}){
    const { region, diskType=null, sizeGB=null, autoDelete=false } = spec;
    if(!region) throw new Error('GCP storage: region required');
    if(!sizeGB) throw new Error('GCP storage: sizeGB required');
    this.region = region; this.diskType = diskType; this.sizeGB = sizeGB; this.autoDelete = !!autoDelete;
    this.id = 'disk-gcp-' + Date.now();
  }
  clone(){ return new GCPStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = GCPStorage;
