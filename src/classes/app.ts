import { Channel } from "./lightmix/channel"
import { Fixture } from "./lightmix/fixture"
import { LightMix } from "./lightmix/lightmix"
import { LightmixEvent } from "./lightmix/lightmix.types"
import { Tickable } from "./scheduler/tickable"
import express, {Response, Request} from "express"



export class App {
    tickable = new Tickable()
    frame = 0

    lightMix: LightMix
    
    server: express.Application
    
    constructor() {
        this.lightMix = new LightMix(
            {
                "1": new Fixture(
                    {
                        "red": new Channel(0),
                        "green": new Channel(0),
                        "blue": new Channel(0),
                        "white": new Channel(0),
                        "uv": new Channel(0),
                        "red2": new Channel(0),
                        "green2": new Channel(0),
                        "blue2": new Channel(0),
                        "white2": new Channel(0),
                        "uv2": new Channel(0),
                        "temperature": new Channel(100),
                        "power": new Channel(100),
                        "pan": new Channel(0),
                        "tilt": new Channel(0),
                        "wave_shared_rng": new Channel(0),
                        "wave_shared_trough_min_duration": new Channel(0),
                        "wave_shared_trough_max_duration": new Channel(0),
                        "wave_shared_crest_min_duration": new Channel(0),
                        "wave_shared_crest_max_duration": new Channel(0),
                        "wave_shared_transition_max_duration": new Channel(0),
                        "wave_shared_transition_min_duration": new Channel(0),
                        "wave_dedicated_rng": new Channel(0),
                        "wave_dedicated_trough_min_duration": new Channel(0),
                        "wave_dedicated_trough_max_duration": new Channel(0),
                        "wave_dedicated_crest_min_duration": new Channel(0),
                        "wave_dedicated_crest_max_duration": new Channel(0),
                        "wave_dedicated_transition_max_duration": new Channel(0),
                        "wave_dedicated_transition_min_duration": new Channel(0),
                        "clock": new Channel(0)
                    }
                )
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

        this.lightMix.setAll("wave_shared_rng", () => sharedRng)
        this.lightMix.setAll("wave_dedicated_rng", () => Math.random() * 100)
        this.lightMix.setAll("clock", () => this.frame % 2)

        this.lightMix.updateState(Date.now())

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
