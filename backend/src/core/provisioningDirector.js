class ProvisioningDirector {
  constructor() {
    this.builder = null;
  }

  setBuilder(builder) {
    this.builder = builder;
  }

  async construct(params) {
    const { choice, builderType, specs } = params;
    if (this.builder) {
      this.builder.reset();
      if (choice) this.builder.setFlavor(choice);
      if (specs) {
        if (specs.region || specs.size || specs.name) {
          this.builder.setVMSpec(specs);
        }
        this.builder.setNetworkSpec(specs);
        this.builder.setStorageSpec(specs);
      }
      await this.builder.buildNetwork();
      await this.builder.buildStorage();
      await this.builder.buildVM();
    }
  }

  getResult() {
    return this.builder ? this.builder.getResult() : null;
  }
}

ProvisioningDirector.MACHINE_TYPES = {
    AWS: {
      "General Purpose": {
        "t3.medium": { vcpu: 2, ram: 4 },
        "m5.large": { vcpu: 2, ram: 8 },
        "m5.xlarge": { vcpu: 4, ram: 16 },
      },
      "Memory-Optimized": {
        "r5.large": { vcpu: 2, ram: 16 },
        "r5.xlarge": { vcpu: 4, ram: 32 },
        "r5.2xlarge": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "c5.large": { vcpu: 2, ram: 4 },
        "c5.xlarge": { vcpu: 4, ram: 8 },
        "c5.2xlarge": { vcpu: 8, ram: 16 },
      },
    },
    AZURE: {
      "General Purpose": {
        "D2s_v3": { vcpu: 2, ram: 8 },
        "D4s_v3": { vcpu: 4, ram: 16 },
        "D8s_v3": { vcpu: 8, ram: 32 },
      },
      "Memory-Optimized": {
        "E2s_v3": { vcpu: 2, ram: 16 },
        "E4s_v3": { vcpu: 4, ram: 32 },
        "E8s_v3": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "F2s_v2": { vcpu: 2, ram: 4 },
        "F4s_v2": { vcpu: 4, ram: 8 },
        "F8s_v2": { vcpu: 8, ram: 16 },
      },
    },
    GCP: {
      "General Purpose": {
        "e2-standard-2": { vcpu: 2, ram: 8 },
        "e2-standard-4": { vcpu: 4, ram: 16 },
        "e2-standard-8": { vcpu: 8, ram: 32 },
      },
      "Memory-Optimized": {
        "n2-highmem-2": { vcpu: 2, ram: 16 },
        "n2-highmem-4": { vcpu: 4, ram: 32 },
        "n2-highmem-8": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "n2-highcpu-2": { vcpu: 2, ram: 2 },
        "n2-highcpu-4": { vcpu: 4, ram: 4 },
        "n2-highcpu-8": { vcpu: 8, ram: 8 },
      },
    },
    ONPREM: {
      "Standard": {
        "onprem-std1": { vcpu: 2, ram: 4 },
        "onprem-std2": { vcpu: 4, ram: 8 },
        "onprem-std3": { vcpu: 8, ram: 16 },
      },
      "Memory-Optimized": {
        "onprem-mem1": { vcpu: 2, ram: 16 },
        "onprem-mem2": { vcpu: 4, ram: 32 },
        "onprem-mem3": { vcpu: 8, ram: 64 },
      },
      "Compute-Optimized": {
        "onprem-cpu1": { vcpu: 2, ram: 2 },
        "onprem-cpu2": { vcpu: 4, ram: 4 },
        "onprem-cpu3": { vcpu: 8, ram: 8 },
      },
    },
  };

ProvisioningDirector.REGIONS = {
  AWS: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
  AZURE: ['eastus', 'westeurope', 'southeastasia', 'westus2'],
  GCP: ['us-central1', 'europe-west1', 'asia-east1', 'us-west1'],
  ONPREM: ['datacenter-1', 'datacenter-2', 'datacenter-3']
};

ProvisioningDirector.STORAGE_TYPES = {
  AWS: ['gp3', 'io2', 'st1', 'sc1'],
  AZURE: ['Premium_LRS', 'Standard_LRS', 'StandardSSD_LRS'],
  GCP: ['pd-standard', 'pd-ssd', 'pd-balanced'],
  ONPREM: ['local-ssd', 'network-storage', 'san-storage']
};

module.exports = ProvisioningDirector;
