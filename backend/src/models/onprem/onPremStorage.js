class OnPremiseStorage {
  constructor(spec={}){
    const { region, storagePool=null, sizeGB=null, size=null, raidLevel=null } = spec;
    let finalSize = sizeGB != null ? sizeGB : size;
    if (typeof finalSize === 'string' && finalSize.trim() !== '') {
      const n = Number(finalSize);
      finalSize = Number.isFinite(n) ? n : finalSize;
    }
    if(!region) throw new Error('OnPrem storage: region required');
    if(finalSize == null || finalSize === '') throw new Error('OnPrem storage: sizeGB required');
    this.region = region; this.storagePool = storagePool; this.sizeGB = finalSize; this.raidLevel = raidLevel;
    this.id = 'disk-onprem-' + Date.now();
  }
  clone(){ return new OnPremiseStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = OnPremiseStorage;
