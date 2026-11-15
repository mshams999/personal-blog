import {
    authorizeFromEnv,
    createDestroyHandler,
    destroyWithEnv,
} from './lib/handlers.js'
import {
    deleteCleanup,
    deletePhoto,
    readCleanup,
    readPhoto,
    recordCleanup,
} from './lib/firebaseAdmin.js'

export default createDestroyHandler({
    authorize: authorizeFromEnv,
    readPhoto,
    readCleanup,
    deletePhoto,
    deleteCleanup,
    recordCleanup,
    destroyAsset: destroyWithEnv,
})
