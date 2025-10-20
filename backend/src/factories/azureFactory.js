const CloudResourceFactory = require('./cloudResourceFactory');
const AzureVM = require('../models/azure/azureVM');
const AzureNetworking = require('../models/azure/azureNetworking');
const AzureStorage = require('../models/azure/azureStorage');
class Azure_Factory extends CloudResourceFactory {
  crearNetworking(spec){ return new AzureNetworking(spec); }
  crearStorage(spec){ return new AzureStorage(spec); }
  crearVM(spec){ return new AzureVM(spec); }
}
module.exports = Azure_Factory;
