export class Database {
  constructor() {
    this.entregas = [];
    this.motoristas = [];
    this.nextEntregaId = 1;
    this.nextMotoristaId = 1;
  }

  getEntregas() { return this.entregas; }
  getMotoristas() { return this.motoristas; }

  generateEntregaId() { return this.nextEntregaId++; }
  generateMotoristaId() { return this.nextMotoristaId++; }
}