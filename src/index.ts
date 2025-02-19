import { App } from './app.js'

async function startServer() {
	try {
		const app = new App()
		const server = await app.bootstrap()

		await server.listen({ port: 8080, host: '0.0.0.0' })

		console.log(`Server is running on port 8080`)
	} catch (err) {
		console.error('Error starting server:', err)
		process.exit(1)
	}
}

startServer()
