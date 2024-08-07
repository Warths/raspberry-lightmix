import { Channel } from "./channel"
import { Fixture } from "./fixture"
import { LightMix } from "./lightmix"

export class App {
    tickable = new Tickable()

    lightMix = new LightMix(
        {
            "1": new Fixture(
                {
                    "r": new Channel(0),
                    "g": new Channel(0),
                    "b": new Channel(0),
                    "w": new Channel(0),
                    "t": new Channel(100),
                    "uv": new Channel(0),
                    "pow": new Channel(100)
                }
            ),
            "2": new Fixture(
                {
                    "r": new Channel(0),
                    "g": new Channel(0),
                    "b": new Channel(0),
                    "w": new Channel(0),
                    "t": new Channel(100),
                    "uv": new Channel(0),
                    "pow": new Channel(100)
                }
            ),
            "3": new Fixture(
                {
                    "r": new Channel(0),
                    "g": new Channel(0),
                    "b": new Channel(0),
                    "w": new Channel(0),
                    "t": new Channel(100),
                    "uv": new Channel(0),
                    "pow": new Channel(100)
                }
            ),
            "4": new Fixture(
                {
                    "r": new Channel(0),
                    "g": new Channel(0),
                    "b": new Channel(0),
                    "w": new Channel(0),
                    "t": new Channel(100),
                    "uv": new Channel(0),
                    "pow": new Channel(100)
                }
            )
        }
    )

    init() {
        this.tickable
        .setTickRate(60)
        .addFunction(() => this.sayHello())
    }

    run() {
        this.tickable.run()
    }

    sayHello() {
        this.lightMix.updateState(Date.now())
        this.lightMix.getState()
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