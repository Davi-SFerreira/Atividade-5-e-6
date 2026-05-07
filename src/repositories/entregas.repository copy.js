const prisma = require('../database/bd.js');

class EntregasRepository {

  async listarTodos (){
    return prisma.entregas.findMany()
  }

  async buscarPorId (id){
    const entrega = await prisma.entregas.findUnique({
      where: {id:id}
    })

    if (!entrega) return null

    return entrega
  }

  async criar (dados){
    const novaEntrega = await prisma.entregas.create({
      data:dados
    })

    return novaEntrega
  }

  async atualizar (id, dados){
    const{historico, ...camposEntrega} = dados
    const atualiza = await prisma.entregas.update({
      where: {id:id}, data: camposEntrega
    })

    if (historico){
      await prisma.entregas.create({
        data:{
          descricao: historico, entregaId: id
        }
      })
    }
    return atualiza
  }
}

module.exports = EntregasRepository;