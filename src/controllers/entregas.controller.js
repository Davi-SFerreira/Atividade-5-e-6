export class EntregasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const entrega = this.service.criar(req.body);
      res.status(201).json(entrega);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  listar = (req, res) => {
    try {
      const { status } = req.query;
      const entregas = this.service.listar(status);
      res.status(200).json(entregas);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  buscarPorId = (req, res) => {
    try {
      const entrega = this.service.buscarPorId(req.params.id);
      res.status(200).json(entrega);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  avancarStatus = (req, res) => {
    try {
      const entregaAtualizada = this.service.avancarStatus(req.params.id);
      res.status(200).json(entregaAtualizada);
    } catch (error) {
      const statusHttp = error.message.includes('não encontrada') ? 404 : 400;
      res.status(statusHttp).json({ erro: error.message });
    }
  }

  cancelar = (req, res) => {
    try {
      const entregaCancelada = this.service.cancelar(req.params.id);
      res.status(200).json(entregaCancelada);
    } catch (error) {
      const statusHttp = error.message.includes('não encontrada') ? 404 : 400;
      res.status(statusHttp).json({ erro: error.message });
    }
  }

  buscarHistorico = (req, res) => {
    try {
      const historico = this.service.buscarHistorico(req.params.id);
      res.status(200).json(historico);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  atribuirMotorista = (req, res) => {
    try {
      const entrega = this.service.atribuir(req.params.id, req.body.motoristaId);
      res.status(200).json(entrega);
    } catch (error) {
      let statusHttp = 400;
      if (error.message.includes('404')) statusHttp = 404;
      if (error.message.includes('422')) statusHttp = 422;
      
      res.status(statusHttp).json({ erro: error.message.split(': ')[1] || error.message });
    }
  }
}