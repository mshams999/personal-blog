import { authorizeFromEnv, cloudinaryEnv, createSignHandler } from './lib/handlers.js'

const env = cloudinaryEnv()

export default createSignHandler({
    authorize: authorizeFromEnv,
    ...env,
})
