const prisma = require('../database/bd.js');

class MotoristasRepository {
  async listarTodos (){
    return prisma.motoristas.findMany()
  }

  async buscarPorId (id){
    const entrega = await prisma.motoristas.findUnique({
      where: {id:id}
    })

    if (!entrega) return null

    return entrega
  }

  async buscarPorCpf (Cpf){
    const motorista = await prisma.motoristas.findUnique({
      where: {Cpf:Cpf}
    })

    if (!motorista) return null

    return motorista
  }

  async criar (dados){
    const novaEntrega = await prisma.motoristas.create({
      data:dados
    })

    return novaEntrega
  }

  async atualizar (id, dados){
    const atualiza = await prisma.motoristas.update({
      where: {id:id}, data: dados
    })

    return atualiza
  }
}

module.exports = MotoristasRepository;