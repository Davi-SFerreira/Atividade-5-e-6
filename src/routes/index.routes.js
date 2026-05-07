import { Router } from 'express';
//import { Database } from '../database/bd.js';
const EntregasRepository = require ('../repositories/entregas.repository copy.js');
const MotoristasRepository = require ('../repositories/motoristas.repository copy.js');
import { EntregasService } from '../services/entregas.service.js';
import { MotoristasService } from '../services/motoristas.service.js';
import { EntregasController } from '../controllers/entregas.controller.js';
import { MotoristasController } from '../controllers/motoristas.controller.js';

const rotas = Router();

// ==========================================
// COMPOSIÇÃO DE DEPENDÊNCIAS (BOOTSTRAP)
// ==========================================
//const database = new Database();

// Repositories
const entregasRepo = new EntregasRepository();
const motoristasRepo = new MotoristasRepository();

// Services (Injeção via contratos)
const entregasService = new EntregasService(entregasRepo, motoristasRepo);
const motoristasService = new MotoristasService(motoristasRepo, entregasRepo);

// Controllers
const entregasController = new EntregasController(entregasService);
const motoristasController = new MotoristasController(motoristasService);

// ==========================================
// MAPEAMENTO DE ROTAS - ENTREGAS
// ==========================================
rotas.post('/api/entregas', entregasController.criar);
rotas.get('/api/entregas', entregasController.listar);
rotas.get('/api/entregas/:id', entregasController.buscarPorId);
rotas.patch('/api/entregas/:id/avancar', entregasController.avancarStatus);
rotas.patch('/api/entregas/:id/cancelar', entregasController.cancelar);
rotas.get('/api/entregas/:id/historico', entregasController.buscarHistorico);
rotas.patch('/api/entregas/:id/atribuir', entregasController.atribuirMotorista);

// ==========================================
// MAPEAMENTO DE ROTAS - MOTORISTAS
// ==========================================
rotas.post('/api/motoristas', motoristasController.criar);
rotas.get('/api/motoristas', motoristasController.listar);
rotas.get('/api/motoristas/:id', motoristasController.buscarPorId);
rotas.get('/api/motoristas/:id/entregas', motoristasController.buscarEntregas);

export default rotas;

const RelatoriosController = require('../controllers/RelatoriosController');
const relatoriosController = new RelatoriosController();

// Adicione essas duas linhas junto das outras rotas:
router.get('/relatorios/entregas-por-status', (req, res) => relatoriosController.entregasPorStatus(req, res));
router.get('/relatorios/motoristas-ativos', (req, res) => relatoriosController.motoristasAtivos(req, res));