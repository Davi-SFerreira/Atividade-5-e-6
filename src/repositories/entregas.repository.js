/**
 * CONTRATO: IEntregasRepository
 * @typedef {Object} IEntregasRepository
 * @property {function(Object): Array} listarTodos - Aceita { status, motoristaId }
 * @property {function(number): Object|null} buscarPorId
 * @property {function(Object): Object} criar
 * @property {function(number, Object): Object} atualizar
 */

export class EntregasRepository {
  constructor(database) {
    this.db = database;
  }

  listarTodos(filtros = {}) {
    let entregas = this.db.getEntregas();
    if (filtros.status) {
      entregas = entregas.filter(e => e.status === filtros.status);
    }
    if (filtros.motoristaId) {
      entregas = entregas.filter(e => e.motoristaId === Number(filtros.motoristaId));
    }
    return entregas;
  }

  buscarPorId(id) {
    return this.db.getEntregas().find(e => e.id === Number(id)) || null;
  }

  criar(dados) {
    const novaEntrega = { id: this.db.generateEntregaId(), ...dados };
    this.db.getEntregas().push(novaEntrega);
    return novaEntrega;
  }

  atualizar(id, dadosAtualizados) {
    const entregas = this.db.getEntregas();
    const index = entregas.findIndex(e => e.id === Number(id));
    if (index !== -1) {
      entregas[index] = { ...entregas[index], ...dadosAtualizados };
      return entregas[index];
    }
    return null;
  }
}