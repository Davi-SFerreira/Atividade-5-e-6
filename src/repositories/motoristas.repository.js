const pool = require('../database/db');

class MotoristasRepository {
  _mapRow(row) {
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      placaVeiculo: row.placa_veiculo,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM motoristas ORDER BY id');
    return rows.map(this._mapRow);
  }

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM motoristas WHERE id = $1', [id]);
    return this._mapRow(rows[0]);
  }

  async findByCpf(cpf) {
    const { rows } = await pool.query('SELECT * FROM motoristas WHERE cpf = $1', [cpf]);
    return this._mapRow(rows[0]);
  }

  async save(motorista) {
    try {
      if (motorista.id) {
        const { rows } = await pool.query(
          `UPDATE motoristas
           SET nome = $1, cpf = $2, placa_veiculo = $3, status = $4, updated_at = NOW()
           WHERE id = $5
           RETURNING *`,
          [motorista.nome, motorista.cpf, motorista.placaVeiculo, motorista.status, motorista.id]
        );
        return this._mapRow(rows[0]);
      } else {
        const { rows } = await pool.query(
          `INSERT INTO motoristas (nome, cpf, placa_veiculo, status)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [motorista.nome, motorista.cpf, motorista.placaVeiculo, motorista.status || 'ATIVO']
        );
        return this._mapRow(rows[0]);
      }
    } catch (err) {
      if (err.code === '23505') {
        const error = new Error('CPF já cadastrado.');
        error.statusCode = 409;
        throw error;
      }
      throw err;
    }
  }

  async findEntregasByMotoristaId(motoristaId, status) {
    let query = 'SELECT * FROM entregas WHERE motorista_id = $1';
    const params = [motoristaId];
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    const { rows } = await pool.query(query, params);
    return rows.map(row => ({
      id: row.id,
      descricao: row.descricao,
      origem: row.origem,
      destino: row.destino,
      status: row.status,
      motoristaId: row.motorista_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}

module.exports = MotoristasRepository;