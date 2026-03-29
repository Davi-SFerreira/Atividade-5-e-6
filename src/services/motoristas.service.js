export class MotoristasService {
  /**
   * @param {IMotoristasRepository} motoristasRepository 
   * @param {IEntregasRepository} entregasRepository
   */
  constructor(motoristasRepository, entregasRepository) {
    this.motoristasRepo = motoristasRepository;
    this.entregasRepo = entregasRepository;
  }

  criar(dados) {
    const { nome, cpf, placaVeiculo } = dados;

    if (!nome || !cpf || !placaVeiculo) {
      throw new Error("400: Nome, CPF e Placa são obrigatórios.");
    }

    if (this.motoristasRepo.buscarPorCPF(cpf)) {
      throw new Error("409: CPF já cadastrado no sistema.");
    }

    return this.motoristasRepo.criar({ 
      nome, 
      cpf, 
      placaVeiculo, 
      status: 'ATIVO' 
    });
  }

  listar() {
    return this.motoristasRepo.listarTodos();
  }

  buscarPorId(id) {
    const motorista = this.motoristasRepo.buscarPorId(id);
    if (!motorista) throw new Error("404: Motorista não encontrado.");
    return motorista;
  }

  buscarEntregasDoMotorista(motoristaId, status) {
    this.buscarPorId(motoristaId); // Valida se o motorista existe
    return this.entregasRepo.listarTodos({ motoristaId, status });
  }
}