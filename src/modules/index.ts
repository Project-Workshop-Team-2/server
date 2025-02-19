import type { Routes } from '@/core/types/index.js'

export const getRoutes = (): Routes => ({
	routes: [
		{
			method: 'GET',
			url: '/api/health',
			handler: (_, reply) => {
				const data = {
					uptime: process.uptime(),
					message: 'Healthy!',
					data: new Date(),
				}

				return reply.status(200).send(data)
			},
		},
	],
})
