import { FastifyInstance } from "fastify"
import { voting } from "../../utils/voting-pub-sub"
import z from "zod"

export async function pollResults(app: FastifyInstance) {
    app.get('/polls/:pollId/results', { websocket: true }, (connection, request) => {
        // Pub/Sub - Esse pattern é muito utilizado em aplicacoes que lidam com eventos, por exemplo, dada uma ação um email é disparado como resultado, esse email é um evento.
        // Inscrever apenas nas mensagens publicados no canal com o ID da enquete (`pollId`)

        const getPollParams = z.object({
            pollId: z.string().uuid()
        })
    
        const { pollId } = getPollParams.parse(request.params)

        voting.subscribe(pollId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })
    })
}


 