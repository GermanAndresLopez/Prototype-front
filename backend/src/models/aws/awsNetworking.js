class AWSNetworking {
  constructor(spec={}){
    const { region, vpcId=null, subnet=null, idSecurityGroup=null, publicIP=false } = spec;
    if(!region) throw new Error('AWS network: region required');
    this.region = region; this.vpcId = vpcId; this.subnet = subnet; this.idSecurityGroup = idSecurityGroup; this.publicIP = !!publicIP;
    this.id = 'net-aws-' + Date.now();
  }
  clone(){ return new AWSNetworking(JSON.parse(JSON.stringify(this))); }
}
module.exports = AWSNetworking;
