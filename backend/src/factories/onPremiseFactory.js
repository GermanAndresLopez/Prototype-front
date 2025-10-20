const CloudResourceFactory = require('./cloudResourceFactory');
const OnPremiseVM = require('../models/onprem/onPremVM');
const OnPremiseNetworking = require('../models/onprem/onPremNetworking');
const OnPremiseStorage = require('../models/onprem/onPremStorage');
class OnPremise_Factory extends CloudResourceFactory {
  crearNetworking(spec){ return new OnPremiseNetworking(spec); }
  crearStorage(spec){ return new OnPremiseStorage(spec); }
  crearVM(spec){ return new OnPremiseVM(spec); }
}
module.exports = OnPremise_Factory;
