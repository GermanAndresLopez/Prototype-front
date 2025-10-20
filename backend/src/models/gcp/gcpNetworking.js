class GCPNetworking {
  constructor(spec={}){
    const { region, networkName=null, subnetworkName=null, firewallTag=null, publicIP=false } = spec;
    if(!region) throw new Error('GCP network: region required');
    this.region = region; this.networkName = networkName; this.subnetworkName = subnetworkName; this.firewallTag = firewallTag; this.publicIP = !!publicIP;
    this.id = 'net-gcp-' + Date.now();
  }
  clone(){ return new GCPNetworking(JSON.parse(JSON.stringify(this))); }
}
module.exports = GCPNetworking;
