import { Channel } from "./lightmix/channel"
import { Fixture } from "./lightmix/peripherals/fixture"
import { LightMix } from "./lightmix/lightmix"
import { LightmixEvent } from "./lightmix/lightmix.types"
import { Tickable } from "./scheduler/tickable"
import express, {Response, Request} from "express"

import { i2cFactory } from "./i2c/i2c"
import { RGBWYV } from "./lightmix/peripherals/RGBWYV"

export class App {
    tickable = new Tickable()
    frame = 0

    lightMix: LightMix
    
    server: express.Application

    constructor() {
        this.lightMix = new LightMix(
            i2cFactory(1),
            {
                "1": new RGBWYV(0x10),
                "2": new RGBWYV(0x11)
            }
        )
        

        this.server = express()
        this.server.use(express.json())
    }


    init() {
        this.tickable.setTickRate(60).addFunction(() => this.sayHello())

        this.server.post("/calibrate", this.calibrate.bind(this))
        this.server.post("/clear", this.clear.bind(this))
        this.server.post("/add-event", this.addEvent.bind(this))

        this.server.listen(3000, () => {
            console.log('Server is running on port 3000');
        })
    }

    run() {
        this.tickable.run()
    }

    sayHello() {
        const sharedRng = Math.random() * 100

        this.lightMix.setAll("shared_rng", () => sharedRng)
        this.lightMix.setAll("dedicated_rng", () => Math.random() * 100)
        this.lightMix.setAll("clock", () => this.frame % 2)

        this.lightMix.updateState(Date.now())

        this.lightMix.writeState()

        this.frame++
    }


    calibrate(req: Request, res: Response) {
        const body = req.body
        
        if (typeof body == "object" && body.hostTime && typeof body.hostTime == "number") {
            this.lightMix.calibrate(body.hostTime)
            return this.success(res)
        } else {
            return this.badRequest(res)
        }

    }

    clear(req: Request, res: Response) {
        this.lightMix.clear()
        this.success(res)
    }

    addEvent(req: Request, res: Response) {
        const body = req.body

        if (!Array.isArray(body)) {
            return this.badRequest(res)
        }

        if (!body.every(event => typeof event === "object")) {
            return this.badRequest(res)
        }

        let events = body.map(event => {
            return {
                fixture: event.fixture,
                channel: event.channel,
                startTime: event.startTime,
                duration: event.duration,
                startValue: event.startValue,
                endValue: event.endValue
            }
        })

        if (!events.every(event => {
            return typeof event.fixture == "string"
                || typeof event.channel == "string"
                || (typeof event.startTime == "number" || event.startTime == null)
                || (typeof event.duration == "number" || event.duration == null)
                || (typeof event.startValue == "number" || event.startValue == null)
                || (typeof event.endValue == "number" || event.endValue == null)
        })) {
            return this.badRequest(res)
        }

        events = events as LightmixEvent[]

        events.forEach(
            event => {
                this.lightMix.addEvent(event)
            }
        )
        
        return this.success(res)



    }

    badRequest(res: Response) {
        res.status(400).json({status: 400, message:"Bad request"})
    }

    success(res: Response) {
        res.status(200).json({status: 200, message:"ok"})
    }
}