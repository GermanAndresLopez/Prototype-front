class AWSStorage {
  constructor(spec={}){
    const { region, volumeType=null, sizeGB=null, encrypted=false } = spec;
    if(!region) throw new Error('AWS storage: region required');
    if(!sizeGB) throw new Error('AWS storage: sizeGB required');
    this.region = region; this.volumeType = volumeType; this.sizeGB = sizeGB; this.encrypted = !!encrypted;
    this.id = 'disk-aws-' + Date.now();
  }
  clone(){ return new AWSStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = AWSStorage;
