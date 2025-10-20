class AzureNetworking {
  constructor(spec={}){
    const { region, virtualNetwork=null, subnetName=null, networkSecurityGroup=null, publicIP=false } = spec;
    if(!region) throw new Error('Azure network: region required');
    this.region = region; this.virtualNetwork = virtualNetwork; this.subnetName = subnetName; this.networkSecurityGroup = networkSecurityGroup; this.publicIP = !!publicIP;
    this.id = 'net-azure-' + Date.now();
  }
  clone(){ return new AzureNetworking(JSON.parse(JSON.stringify(this))); }
}
module.exports = AzureNetworking;
