const pool = require('../database/db');

class RelatoriosController {
  async entregasPorStatus(req, res) {
    try {
      const { rows } = await pool.query(
        'SELECT status, COUNT(*) as total FROM entregas GROUP BY status'
      );
      const resultado = {};
      rows.forEach(row => {
        resultado[row.status] = parseInt(row.total);
      });
      return res.json(resultado);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async motoristasAtivos(req, res) {
    try {
      const { rows } = await pool.query(`
        SELECT m.id AS "motoristaId", m.nome, COUNT(e.id) AS "entregasEmAberto"
        FROM motoristas m
        INNER JOIN entregas e ON e.motorista_id = m.id
        WHERE e.status NOT IN ('ENTREGUE', 'CANCELADA')
        GROUP BY m.id, m.nome
        HAVING COUNT(e.id) > 0
        ORDER BY m.id
      `);
      return res.json(rows.map(r => ({
        motoristaId: r.motoristaId,
        nome: r.nome,
        entregasEmAberto: parseInt(r.entregasEmAberto),
      })));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RelatoriosController;