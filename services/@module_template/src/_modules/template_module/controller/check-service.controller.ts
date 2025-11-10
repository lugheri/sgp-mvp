import { FastifyReply, FastifyRequest } from 'fastify'

export const checkLive = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    reply.status(200).send({
      status: 'online',
      service: 'template-service',
      version: '5.0.0',
      success: true,
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}
