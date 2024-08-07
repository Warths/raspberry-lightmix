export class App {
    tickable = new Tickable()

    init() {
        this.tickable
        .setTickRate(60)
        .addFunction(() => this.sayHello())
    }

    run() {
        this.tickable.run()
    }

    sayHello() {
        console.log("Hello")
    }



}

export class Tickable {
    tickedFunctions: Function[] = []
    intervalInMilliseconds = 1000
    lastTick = 0
    alive = true
    
    constructor() {}

    setTickRate(ratePerSeconds: number) {
        this.setInterval(1000 / ratePerSeconds)
        return this
    }

    setInterval(intervalInMilliseconds: number) {
        this.intervalInMilliseconds = intervalInMilliseconds
        return this
    }

    addFunction(func: Function) {
        this.tickedFunctions.push(func)
        return this
    }

    run() {
        this.lastTick = Date.now()
        this.tickedFunctions.forEach(func => func())
        
        const elapsedTime = Date.now() - this.lastTick
        const waitTime = this.intervalInMilliseconds - elapsedTime
        if (waitTime < 0) {
            console.warn(`WARNING ! Tick took ${elapsedTime} ms. Shoud not take more than ${this.intervalInMilliseconds}`)
        }

        if (this.alive) {
            setTimeout(() => this.run(), waitTime)
        }

    }
}