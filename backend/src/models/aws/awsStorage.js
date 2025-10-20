class AWSStorage {
  constructor(spec={}){
    const { region, volumeType=null, sizeGB=null, size=null, encrypted=false } = spec;
    let finalSize = sizeGB != null ? sizeGB : size;
    if (typeof finalSize === 'string' && finalSize.trim() !== '') {
      const n = Number(finalSize);
      finalSize = Number.isFinite(n) ? n : finalSize;
    }
    if(!region) throw new Error('AWS storage: region required');
    if(finalSize == null || finalSize === '') throw new Error('AWS storage: sizeGB required');
    this.region = region; this.volumeType = volumeType; this.sizeGB = finalSize; this.encrypted = !!encrypted;
    this.id = 'disk-aws-' + Date.now();
  }
  clone(){ return new AWSStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = AWSStorage;
