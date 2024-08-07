import { App } from './classes/lightmix/app'

function bootstrap() {
    const app = new App()
    app.init()
    app.run()
}

bootstrap()