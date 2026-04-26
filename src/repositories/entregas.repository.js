const pool = require('../database/db');

class EntregasRepository {
  _mapRow(row) {
    if (!row) return null;
    return {
      id: row.id,
      descricao: row.descricao,
      origem: row.origem,
      destino: row.destino,
      status: row.status,
      motoristaId: row.motorista_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      historico: [],
    };
  }

  async findAll(filters = {}) {
    let query = 'SELECT * FROM entregas WHERE 1=1';
    const params = [];
    if (filters.status) {
      params.push(filters.status);
      query += ` AND status = $${params.length}`;
    }
    if (filters.motoristaId) {
      params.push(filters.motoristaId);
      query += ` AND motorista_id = $${params.length}`;
    }
    query += ' ORDER BY id';
    const { rows } = await pool.query(query, params);
    return rows.map(this._mapRow);
  }

  async findById(id) {
    const { rows: entregaRows } = await pool.query(
      'SELECT * FROM entregas WHERE id = $1',
      [id]
    );
    if (!entregaRows[0]) return null;
    const entrega = this._mapRow(entregaRows[0]);

    const { rows: eventos } = await pool.query(
      'SELECT * FROM eventos_entrega WHERE entrega_id = $1 ORDER BY created_at',
      [id]
    );
    entrega.historico = eventos.map(e => ({
      id: e.id,
      tipo: e.tipo,
      descricao: e.descricao,
      criadoEm: e.created_at,
    }));
    return entrega;
  }

  async save(entrega) {
    if (entrega.id) {
      const { rows } = await pool.query(
        `UPDATE entregas
         SET descricao = $1, origem = $2, destino = $3, status = $4,
             motorista_id = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [entrega.descricao, entrega.origem, entrega.destino, entrega.status, entrega.motoristaId || null, entrega.id]
      );
      const saved = this._mapRow(rows[0]);

      // Sincronizar eventos novos
      if (entrega.historico && entrega.historico.length > 0) {
        for (const evento of entrega.historico) {
          if (!evento.id) {
            await pool.query(
              'INSERT INTO eventos_entrega (entrega_id, tipo, descricao) VALUES ($1, $2, $3)',
              [saved.id, evento.tipo, evento.descricao]
            );
          }
        }
      }
      return this.findById(saved.id);
    } else {
      const { rows } = await pool.query(
        `INSERT INTO entregas (descricao, origem, destino, status, motorista_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [entrega.descricao, entrega.origem, entrega.destino, entrega.status || 'CRIADA', entrega.motoristaId || null]
      );
      const saved = this._mapRow(rows[0]);

      if (entrega.historico && entrega.historico.length > 0) {
        for (const evento of entrega.historico) {
          await pool.query(
            'INSERT INTO eventos_entrega (entrega_id, tipo, descricao) VALUES ($1, $2, $3)',
            [saved.id, evento.tipo, evento.descricao]
          );
        }
      }
      return this.findById(saved.id);
    }
  }

  async findDuplicate(descricao, origem, destino) {
    const { rows } = await pool.query(
      `SELECT * FROM entregas
       WHERE descricao = $1 AND origem = $2 AND destino = $3
         AND status NOT IN ('ENTREGUE', 'CANCELADA')
       LIMIT 1`,
      [descricao, origem, destino]
    );
    return this._mapRow(rows[0]);
  }
}

module.exports = EntregasRepository;