import type { Resolver } from 'awilix'
import type { FastifyBaseLogger, FastifyInstance, RouteOptions } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import type http from 'node:http'
import type { Config } from './config.js'

type AppInstance = FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseDiConfig<T> = Record<keyof T, Resolver<any>>

interface CommonDependencies {
	config: Config
	logger: FastifyBaseLogger
}

type Route = RouteOptions<
	http.Server,
	http.IncomingMessage,
	http.ServerResponse,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any,
	ZodTypeProvider
>

interface Routes {
	routes: Route[]
}

interface ExternalDependencies {
	app: AppInstance
}

type InjectableDependencies<T> = T & CommonDependencies

export type {
	AppInstance,
	BaseDiConfig,
	CommonDependencies,
	ExternalDependencies,
	InjectableDependencies,
	Route,
	Routes,
}
