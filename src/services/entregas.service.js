export class EntregasService {
  /**
   * @param {IEntregasRepository} entregasRepository 
   * @param {IMotoristasRepository} motoristasRepository
   */
  constructor(entregasRepository, motoristasRepository) {
    this.entregasRepo = entregasRepository;
    this.motoristasRepo = motoristasRepository;
  }

  _gerarDataISO() {
    return new Date().toISOString();
  }

  criar(dados) {
    const { descricao, origem, destino } = dados;

    if (!descricao || !origem || !destino) {
      throw new Error("400: Descrição, origem e destino são obrigatórios.");
    }

    if (origem === destino) {
      throw new Error("400: A origem e o destino não podem ser iguais.");
    }

    // NOVA REGRA: O Service busca todas as entregas e faz a filtragem (Respeitando o contrato do Repository)
    const entregasAtivas = this.entregasRepo.listarTodos().filter(
      e => e.status !== 'ENTREGUE' && e.status !== 'CANCELADA'
    );
    
    const existeDuplicada = entregasAtivas.find(
      e => e.descricao === descricao && e.origem === origem && e.destino === destino
    );

    if (existeDuplicada) {
      throw new Error("400: Já existe uma entrega ativa com estes mesmos dados.");
    }

    const novaEntrega = {
      descricao,
      origem,
      destino,
      status: 'CRIADA',
      historico: [
        {
          data: this._gerarDataISO(),
          descricao: 'Entrega criada'
        }
      ]
    };

    return this.entregasRepo.criar(novaEntrega);
  }

  listar(status) {
    return this.entregasRepo.listarTodos({ status });
  }

  buscarPorId(id) {
    const entrega = this.entregasRepo.buscarPorId(id);
    if (!entrega) throw new Error("404: Entrega não encontrada.");
    return entrega;
  }

  avancarStatus(id) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE' || entrega.status === 'CANCELADA') {
      throw new Error(`400: Não é possível avançar uma entrega com status ${entrega.status}.`);
    }

    let novoStatus;
    let descricaoEvento;

    if (entrega.status === 'CRIADA') {
      novoStatus = 'EM_TRANSITO';
      descricaoEvento = 'Entrega saiu para trânsito';
    } else if (entrega.status === 'EM_TRANSITO') {
      novoStatus = 'ENTREGUE';
      descricaoEvento = 'Entrega finalizada com sucesso';
    }

    const historicoAtualizado = [...entrega.historico, {
      data: this._gerarDataISO(),
      descricao: descricaoEvento
    }];

    return this.entregasRepo.atualizar(id, { 
      status: novoStatus, 
      historico: historicoAtualizado 
    });
  }

  cancelar(id) {
    const entrega = this.buscarPorId(id);

    if (entrega.status === 'ENTREGUE') {
      throw new Error("400: Não é possível cancelar uma entrega que já foi finalizada.");
    }

    if (entrega.status === 'CANCELADA') {
      throw new Error("400: A entrega já se encontra cancelada.");
    }

    const historicoAtualizado = [...entrega.historico, {
      data: this._gerarDataISO(),
      descricao: 'Entrega cancelada'
    }];

    return this.entregasRepo.atualizar(id, { 
      status: 'CANCELADA', 
      historico: historicoAtualizado 
    });
  }

  buscarHistorico(id) {
    const entrega = this.buscarPorId(id);
    return entrega.historico;
  }

  atribuir(entregaId, motoristaId) {
    const entrega = this.entregasRepo.buscarPorId(entregaId);
    if (!entrega) throw new Error("404: Entrega não encontrada.");
    
    if (entrega.status !== 'CRIADA') {
      throw new Error("422: Só é permitido atribuir motoristas a entregas com status CRIADA.");
    }

    const motorista = this.motoristasRepo.buscarPorId(motoristaId);
    if (!motorista) throw new Error("404: Motorista não encontrado.");

    if (motorista.status !== 'ATIVO') {
      throw new Error("422: Não é permitido atribuir entrega a um motorista INATIVO.");
    }

    const historicoAtualizado = [...entrega.historico, {
      data: this._gerarDataISO(),
      descricao: `Motorista ${motorista.nome} (ID: ${motorista.id}) atribuído à entrega.`
    }];

    return this.entregasRepo.atualizar(entregaId, { 
      motoristaId, 
      historico: historicoAtualizado 
    });
  }
}