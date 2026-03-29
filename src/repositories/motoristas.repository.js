/**
 * CONTRATO: IMotoristasRepository
 * @typedef {Object} IMotoristasRepository
 * @property {function(): Array} listarTodos
 * @property {function(number): Object|null} buscarPorId
 * @property {function(string): Object|null} buscarPorCPF
 * @property {function(Object): Object} criar
 * @property {function(number, Object): Object} atualizar
 */

export class MotoristasRepository {
  constructor(database) {
    this.db = database;
  }

  listarTodos() {
    return this.db.getMotoristas();
  }

  buscarPorId(id) {
    return this.db.getMotoristas().find(m => m.id === Number(id)) || null;
  }

  buscarPorCPF(cpf) {
    return this.db.getMotoristas().find(m => m.cpf === cpf) || null;
  }

  criar(dados) {
    const novoMotorista = { id: this.db.generateMotoristaId(), ...dados };
    this.db.getMotoristas().push(novoMotorista);
    return novoMotorista;
  }

  atualizar(id, dadosAtualizados) {
    const motoristas = this.db.getMotoristas();
    const index = motoristas.findIndex(m => m.id === Number(id));
    if (index !== -1) {
      motoristas[index] = { ...motoristas[index], ...dadosAtualizados };
      return motoristas[index];
    }
    return null;
  }
}