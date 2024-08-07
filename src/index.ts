import { App } from './classes/app'

function bootstrap() {
    const app = new App()
    app.init()
    app.run()
}

bootstrap()