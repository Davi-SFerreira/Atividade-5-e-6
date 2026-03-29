export class MotoristasController {
  constructor(service) {
    this.service = service;
  }

  criar = (req, res) => {
    try {
      const motorista = this.service.criar(req.body);
      res.status(201).json(motorista);
    } catch (error) {
      const statusHttp = error.message.includes('409') ? 409 : 400;
      res.status(statusHttp).json({ erro: error.message.split(': ')[1] });
    }
  }

  listar = (req, res) => {
    try {
      res.status(200).json(this.service.listar());
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  buscarPorId = (req, res) => {
    try {
      res.status(200).json(this.service.buscarPorId(req.params.id));
    } catch (error) {
      res.status(404).json({ erro: error.message.split(': ')[1] });
    }
  }

  buscarEntregas = (req, res) => {
    try {
      const entregas = this.service.buscarEntregasDoMotorista(req.params.id, req.query.status);
      res.status(200).json(entregas);
    } catch (error) {
      res.status(404).json({ erro: error.message.split(': ')[1] });
    }
  }
}