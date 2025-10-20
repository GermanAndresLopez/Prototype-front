const CloudResourceFactory = require('./cloudResourceFactory');
const GCPVM = require('../models/gcp/gcpVM');
const GCPNetworking = require('../models/gcp/gcpNetworking');
const GCPStorage = require('../models/gcp/gcpStorage');
class GCP_Factory extends CloudResourceFactory {
  crearNetworking(spec){ return new GCPNetworking(spec); }
  crearStorage(spec){ return new GCPStorage(spec); }
  crearVM(spec){ return new GCPVM(spec); }
}
module.exports = GCP_Factory;
