class OnPremiseStorage {
  constructor(spec={}){
    const { region, storagePool=null, sizeGB=null, raidLevel=null } = spec;
    if(!region) throw new Error('OnPrem storage: region required');
    if(!sizeGB) throw new Error('OnPrem storage: sizeGB required');
    this.region = region; this.storagePool = storagePool; this.sizeGB = sizeGB; this.raidLevel = raidLevel;
    this.id = 'disk-onprem-' + Date.now();
  }
  clone(){ return new OnPremiseStorage(JSON.parse(JSON.stringify(this))); }
}
module.exports = OnPremiseStorage;
