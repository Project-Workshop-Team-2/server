import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyMultipart from '@fastify/multipart'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify, { type FastifyInstance } from 'fastify'
import {
	createJsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import type { AppInstance } from './core/types/index.js'
import { env } from './env.js'
import { registerDependenies } from './infrastructure/parentDiConfig.js'
import { getRoutes } from './modules/index.js'

export class App {
	private app: AppInstance

	constructor() {
		this.app = fastify({
			logger: {
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
					},
				},
			},
		})
	}

	private async registerPlugins(): Promise<void> {
		this.app.setValidatorCompiler(validatorCompiler)
		this.app.setSerializerCompiler(serializerCompiler)

		await this.app.register(fastifyCors, {
			origin: [env.WEBSITE_BASE_URL],
			credentials: true,
			methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		})

		await this.app.register(fastifyHelmet)

		await this.app.register(fastifySwagger, {
			transform: createJsonSchemaTransform({
				skipList: [
					'/documentation',
					'/documentation/initOAuth',
					'/documentation/json',
					'/documentation/uiConfig',
					'/documentation/yaml',
					'/documentation/*',
					'/documentation/static/*',
					'*',
				],
			}),
			openapi: {
				info: {
					title: 'GatherFlow Backend',
					version: '0.0.0',
				},
			},
		})

		await this.app.register(fastifySwaggerUi, {
			routePrefix: '/api',
		})

		await this.app.register(fastifyAwilixPlugin, {
			disposeOnClose: true,
			asyncDispose: true,
			asyncInit: true,
			eagerInject: true,
			disposeOnResponse: true,
		})

		await this.app.register(fastifyCookie, {
			secret: env.COOKIE_SECRET,
			hook: 'preHandler',
		})

		await this.app.register(fastifyRateLimit, {
			max: 100,
			ban: 150,
			timeWindow: 15 * 1000,
			allowList: ['127.0.0.1'],
		})

		await this.app.register(fastifyMultipart, { attachFieldsToBody: true })

		registerDependenies(diContainer, { app: this.app })
	}

	private registerRoutes(): void {
		const { routes } = getRoutes()

		for (const route of routes) {
			this.app.withTypeProvider<ZodTypeProvider>().route(route)
		}
	}

	async bootstrap(): Promise<FastifyInstance> {
		try {
			await this.registerPlugins()

			this.app.after(() => {
				this.registerRoutes()
			})

			await this.app.ready()
			return this.app
		} catch (err) {
			this.app.log.error('Error while initializing app: ', err)
			throw err
		}
	}
}
