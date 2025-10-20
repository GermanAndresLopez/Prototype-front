export class TemplateModel {
  constructor(name = '', infra = null) {
    this.name = name;
    this.infra = infra;
  }

  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('El nombre del template es requerido');
    }
    if (!this.infra) {
      throw new Error('La infraestructura es requerida para guardar el template');
    }
    return true;
  }

  toJSON() {
    return {
      name: this.name,
      infra: this.infra
    };
  }
}

export class CloneTemplateModel {
  constructor(name = '', overrides = {}) {
    this.name = name;
    this.overrides = overrides;
  }

  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('El nombre del template es requerido para clonar');
    }
    return true;
  }

  toJSON() {
    return {
      name: this.name,
      overrides: this.overrides
    };
  }
}
