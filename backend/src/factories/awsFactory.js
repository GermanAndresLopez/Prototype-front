const CloudResourceFactory = require('./cloudResourceFactory');
const AWSVM = require('../models/aws/awsVM');
const AWSNetworking = require('../models/aws/awsNetworking');
const AWSStorage = require('../models/aws/awsStorage');
class AWS_Factory extends CloudResourceFactory {
  crearNetworking(spec){ return new AWSNetworking(spec); }
  crearStorage(spec){ return new AWSStorage(spec); }
  crearVM(spec){ return new AWSVM(spec); }
}
module.exports = AWS_Factory;
