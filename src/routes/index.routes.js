import { Router } from 'express';
import { Database } from '../database/database.js';
import { EntregasRepository } from '../repositories/entregas.repository.js';
import { MotoristasRepository } from '../repositories/motoristas.repository.js';
import { EntregasService } from '../services/entregas.service.js';
import { MotoristasService } from '../services/motoristas.service.js';
import { EntregasController } from '../controllers/entregas.controller.js';
import { MotoristasController } from '../controllers/motoristas.controller.js';

const rotas = Router();

// ==========================================
// COMPOSIÇÃO DE DEPENDÊNCIAS (BOOTSTRAP)
// ==========================================
const database = new Database();

// Repositories
const entregasRepo = new EntregasRepository(database);
const motoristasRepo = new MotoristasRepository(database);

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