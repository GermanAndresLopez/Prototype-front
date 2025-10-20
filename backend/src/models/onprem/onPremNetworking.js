class OnPremiseNetworking {
  constructor(spec={}){
    const { region, physicalInterface=null, vlanId=null, firewallPolicy=null, publicIP=false } = spec;
    if(!region) throw new Error('OnPrem network: region required');
    this.region = region; this.physicalInterface = physicalInterface; this.vlanId = vlanId; this.firewallPolicy = firewallPolicy; this.publicIP = !!publicIP;
    this.id = 'net-onprem-' + Date.now();
  }
  clone(){ return new OnPremiseNetworking(JSON.parse(JSON.stringify(this))); }
}
module.exports = OnPremiseNetworking;
