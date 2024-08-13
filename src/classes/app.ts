import { Channel } from "./lightmix/channel"
import { Fixture } from "./lightmix/fixture"
import { LightMix } from "./lightmix/lightmix"
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
                        // "green": new Channel(0),
                        // "blue": new Channel(0),
                        // "white": new Channel(0),
                        // "uv": new Channel(0),
                        // "red2": new Channel(0),
                        // "green2": new Channel(0),
                        // "blue2": new Channel(0),
                        // "white2": new Channel(0),
                        // "uv2": new Channel(0),
                        // "temperature": new Channel(100),
                        // "power": new Channel(100),
                        // "pan": new Channel(0),
                        // "tilt": new Channel(0),
                        // "wave_shared_rng": new Channel(0),
                        // "wave_shared_trough_min_duration": new Channel(0),
                        // "wave_shared_trough_max_duration": new Channel(0),
                        // "wave_shared_crest_min_duration": new Channel(0),
                        // "wave_shared_crest_max_duration": new Channel(0),
                        // "wave_shared_transition_max_duration": new Channel(0),
                        // "wave_shared_transition_min_duration": new Channel(0),
                        // "wave_dedicated_rng": new Channel(0),
                        // "wave_dedicated_trough_min_duration": new Channel(0),
                        // "wave_dedicated_trough_max_duration": new Channel(0),
                        // "wave_dedicated_crest_min_duration": new Channel(0),
                        // "wave_dedicated_crest_max_duration": new Channel(0),
                        // "wave_dedicated_transition_max_duration": new Channel(0),
                        // "wave_dedicated_transition_min_duration": new Channel(0),
                        // "clock": new Channel(0)
                    }
                )
            }
        )

        this.server = express()
        this.server.use(express.json())
    }


    init() {
        this.tickable.setTickRate(1).addFunction(() => this.sayHello())

        this.server.post("/calibrate", this.calibrate.bind(this))

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
        this.lightMix.printState()

        this.frame++
    }


    calibrate(req: Request, res: Response) {
        const body = req.body
        

        if (typeof body == "object" && body.hostTime && typeof body.hostTime == "number") {
            this.lightMix.calibrate(body.hostTime)
            res.status(200).json({status: 200, message:"ok"})
        } else {
            res.status(400).json({status: 400, message:"Bad request"})
        }

    }

}
