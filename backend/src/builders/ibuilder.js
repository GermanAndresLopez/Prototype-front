class ICloudBuilder {
  buildNetwork(){ throw new Error('Not implemented'); }
  buildStorage(){ throw new Error('Not implemented'); }
  buildVM(){ throw new Error('Not implemented'); }
  getResult(){ throw new Error('Not implemented'); }
  cloneConfiguration(){ throw new Error('Not implemented'); }
}
module.exports = ICloudBuilder;
