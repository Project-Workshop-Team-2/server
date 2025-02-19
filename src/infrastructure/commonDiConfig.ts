import type { NameAndRegistrationPair } from 'awilix'
import { asFunction } from 'awilix'
import { getConfig } from './config.js'
import type { CommonDependencies, ExternalDependencies } from '@/core/types/index.js'

export const resolveCommonDiConfig = (
	dependencies: ExternalDependencies,
): NameAndRegistrationPair<CommonDependencies> => ({
	logger: asFunction(() => {
		return dependencies.app.log
	}).singleton(),
	config: asFunction(() => {
		return getConfig()
	}).singleton(),
})
