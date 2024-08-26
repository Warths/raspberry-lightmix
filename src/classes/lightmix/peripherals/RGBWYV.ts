import { I2C } from "../../i2c/i2c";
import { Random } from "../../random/random";
import { Channel } from "../channel";
import { Event } from "../event";
import { Fixture } from "./fixture";

export class RGBWYV extends Fixture {

    constructor(
        private address: number, 
        private numberDistribution: any = {}
    ) {
        super(
            {
                "red": new Channel(255),
                "green": new Channel(255),
                "blue": new Channel(255),
                "white": new Channel(255),
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
                "shared_rng": new Channel(0),
                "dedicated_rng": new Channel(0),
                "wave_shared": new Channel(100),
                "wave_dedicated": new Channel(100),
                "wave_shared_state": new Channel(0),
                "wave_dedicated_state": new Channel(0),
                "wave_shared_through_min_duration": new Channel(1000),
                "wave_shared_through_max_duration": new Channel(1000),
                "wave_shared_crest_min_duration": new Channel(1000),
                "wave_shared_crest_max_duration": new Channel(1000),
                "wave_shared_through_min_value": new Channel(0),
                "wave_shared_through_max_value": new Channel(0),
                "wave_shared_crest_min_value": new Channel(100),
                "wave_shared_crest_max_value": new Channel(100),
                "wave_shared_through_transition_max_duration": new Channel(1000),
                "wave_shared_through_transition_min_duration": new Channel(1000), 
                "wave_shared_crest_transition_max_duration": new Channel(1000), 
                "wave_shared_crest_transition_min_duration": new Channel(1000), 
                "wave_dedicated_through_min_duration": new Channel(500), 
                "wave_dedicated_through_max_duration": new Channel(500), 
                "wave_dedicated_crest_min_duration": new Channel(500), 
                "wave_dedicated_crest_max_duration": new Channel(500), 
                "wave_dedicated_through_min_value": new Channel(100), 
                "wave_dedicated_through_max_value": new Channel(100), 
                "wave_dedicated_crest_min_value": new Channel(100), 
                "wave_dedicated_crest_max_value": new Channel(100), 
                "wave_dedicated_transition_max_duration": new Channel(500), 
                "wave_dedicated_transition_min_duration": new Channel(500), 
                "wave_dedicated_through_transition_max_duration": new Channel(500), 
                "wave_dedicated_through_transition_min_duration": new Channel(500), 
                "wave_dedicated_crest_transition_max_duration": new Channel(500), 
                "wave_dedicated_crest_transition_min_duration": new Channel(500), 
                "clock": new Channel(0) 
            }
        );
    }

    writeState(i2c: I2C) {
        this.updateWave();
        this.updateDedicatedWave();

        let red = this.channelValue8bitTo16bit("red");
        let green = this.channelValue8bitTo16bit("green");
        let blue = this.channelValue8bitTo16bit("blue");
        let warmWhite = this.channelValue8bitTo16bit("white");
        let coolWhite = 0;
        let uv = this.channelValue8bitTo16bit("uv");

        let red2 = this.channelValue8bitTo16bit("red2");
        let green2 = this.channelValue8bitTo16bit("green2");
        let blue2 = this.channelValue8bitTo16bit("blue2");
        let warmWhite2 = this.channelValue8bitTo16bit("white2");
        let coolWhite2 = 0;
        let uv2 = this.channelValue8bitTo16bit("uv2");

        let temperature = this.getChannel('temperature').getState();
        let power = this.getChannel('power').getState();

        coolWhite = warmWhite * (temperature / 100);
        warmWhite = warmWhite - coolWhite;

        coolWhite2 = warmWhite2 * (temperature / 100);
        warmWhite2 = warmWhite2 - coolWhite2;

        red *= (power / 100);
        green *= (power / 100);
        blue *= (power / 100);
        warmWhite *= (power / 100);
        coolWhite *= (power / 100);
        uv *= (power / 100);

        red2 *= (power / 100);
        green2 *= (power / 100);
        blue2 *= (power / 100);
        warmWhite2 *= (power / 100);
        coolWhite2 *= (power / 100);
        uv2 *= (power / 100);

        const wave_shared = this.getChannel('wave_shared').getState() / 100
        const wave_dedicated = this.getChannel('wave_dedicated').getState() / 100

        const wave = (wave_shared * wave_dedicated)

        const realRed = (red * wave) + (red2 * (1 - wave))
        const realGreen = (green * wave) + (green2 * (1 - wave))
        const realBlue = (blue * wave) + (blue2 * (1 - wave))
        const realCoolWhite = (coolWhite * wave) + (coolWhite2 * (1 - wave))
        const realWarmWhite = (warmWhite * wave) + (warmWhite2 * (1 - wave))
        const realUv = (uv * wave) + (uv2 * (1 - wave))

        const redBytes = this.numberTo2x8Bit(realRed)
        const greenBytes = this.numberTo2x8Bit(realGreen)
        const blueBytes = this.numberTo2x8Bit(realBlue)
        const coolWhiteBytes = this.numberTo2x8Bit(realCoolWhite)
        const warmWhiteBytes = this.numberTo2x8Bit(realWarmWhite)
        const uvBytes = this.numberTo2x8Bit(realUv)

        const byteArray = [
            ...redBytes,
            ...greenBytes,
            ...blueBytes,
            ...coolWhiteBytes,
            ...warmWhiteBytes,
            ...uvBytes
        ]

        i2c.i2cWriteSync(this.address, byteArray.length, Buffer.from(byteArray));
    }

    updateWave() {
        const wave_shared = this.getChannel('wave_shared');

        if (wave_shared.getCurrentEvent() === null) {
            const shared_rng = this.getChannel('shared_rng').getState();
            const rng = new Random(shared_rng);
            const state = this.getChannel('wave_shared_state').getState();

            const wave_shared_through_min_value = this.getChannel("wave_shared_through_min_value").getState();
            const wave_shared_through_max_value = this.getChannel("wave_shared_through_max_value").getState();
            const wave_shared_through_transition_min_duration = this.getChannel("wave_shared_through_transition_min_duration").getState();
            const wave_shared_through_transition_max_duration = this.getChannel("wave_shared_through_transition_max_duration").getState();
            const wave_shared_through_min_duration = this.getChannel("wave_shared_through_min_duration").getState();
            const wave_shared_through_max_duration = this.getChannel("wave_shared_through_max_duration").getState();
            const wave_shared_crest_min_value = this.getChannel("wave_shared_crest_min_value").getState();
            const wave_shared_crest_max_value = this.getChannel("wave_shared_crest_max_value").getState();
            const wave_shared_crest_transition_min_duration = this.getChannel("wave_shared_crest_transition_min_duration").getState();
            const wave_shared_crest_transition_max_duration = this.getChannel("wave_shared_crest_transition_max_duration").getState();
            const wave_shared_crest_min_duration = this.getChannel("wave_shared_crest_min_duration").getState();
            const wave_shared_crest_max_duration = this.getChannel("wave_shared_crest_max_duration").getState();

            if (wave_shared_through_min_value == wave_shared_through_max_value && wave_shared_crest_min_value == wave_shared_crest_max_value && wave_shared_through_max_value == wave_shared_crest_max_value) {
                this.getChannel('wave_shared_state').setState(0);
            }

            if (state == 0) {
                const endValue = this.interpolate(rng.getOne(), 0, 100, wave_shared_through_min_value, wave_shared_through_max_value);
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_shared_through_transition_min_duration, wave_shared_through_transition_max_duration);
                this.getChannel("wave_shared").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: endValue
                    }
                );
                this.getChannel('wave_shared_state').setState(1);
            } else if (state == 1) {
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_shared_through_min_duration, wave_shared_through_max_duration);
                this.getChannel("wave_shared").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: null
                    }
                );
                this.getChannel('wave_shared_state').setState(2);
            } else if (state == 2) {
                const endValue = this.interpolate(rng.getOne(), 0, 100, wave_shared_crest_min_value, wave_shared_crest_max_value);
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_shared_crest_transition_min_duration, wave_shared_crest_transition_max_duration);
                this.getChannel("wave_shared").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: endValue
                    }
                );
                this.getChannel('wave_shared_state').setState(3);
            } else if (state == 3) {
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_shared_crest_min_duration, wave_shared_crest_max_duration);
                this.getChannel("wave_shared").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: null
                    }
                );
                this.getChannel('wave_shared_state').setState(0);
            }
        }
    }

    updateDedicatedWave() {
        const wave_dedicated = this.getChannel('wave_dedicated');

        if (wave_dedicated.getCurrentEvent() === null) {
            const dedicated_rng = this.getChannel('dedicated_rng').getState();
            const rng = new Random(dedicated_rng);
            const state = this.getChannel('wave_dedicated_state').getState();

            const wave_dedicated_through_min_value = this.getChannel("wave_dedicated_through_min_value").getState();
            const wave_dedicated_through_max_value = this.getChannel("wave_dedicated_through_max_value").getState();
            const wave_dedicated_through_transition_min_duration = this.getChannel("wave_dedicated_through_transition_min_duration").getState();
            const wave_dedicated_through_transition_max_duration = this.getChannel("wave_dedicated_through_transition_max_duration").getState();
            const wave_dedicated_through_min_duration = this.getChannel("wave_dedicated_through_min_duration").getState();
            const wave_dedicated_through_max_duration = this.getChannel("wave_dedicated_through_max_duration").getState();
            const wave_dedicated_crest_min_value = this.getChannel("wave_dedicated_crest_min_value").getState();
            const wave_dedicated_crest_max_value = this.getChannel("wave_dedicated_crest_max_value").getState();
            const wave_dedicated_crest_transition_min_duration = this.getChannel("wave_dedicated_crest_transition_min_duration").getState();
            const wave_dedicated_crest_transition_max_duration = this.getChannel("wave_dedicated_crest_transition_max_duration").getState();
            const wave_dedicated_crest_min_duration = this.getChannel("wave_dedicated_crest_min_duration").getState();
            const wave_dedicated_crest_max_duration = this.getChannel("wave_dedicated_crest_max_duration").getState();

            if (wave_dedicated_through_min_value == wave_dedicated_through_max_value && wave_dedicated_crest_min_value == wave_dedicated_crest_max_value && wave_dedicated_through_max_value == wave_dedicated_crest_max_value) {
                this.getChannel('wave_dedicated_state').setState(0);
            }

            if (state == 0) {
                const endValue = this.interpolate(rng.getOne(), 0, 100, wave_dedicated_through_min_value, wave_dedicated_through_max_value);
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_dedicated_through_transition_min_duration, wave_dedicated_through_transition_max_duration);
                this.getChannel("wave_dedicated").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: endValue
                    }
                );
                this.getChannel('wave_dedicated_state').setState(1);
            } else if (state == 1) {
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_dedicated_through_min_duration, wave_dedicated_through_max_duration);
                this.getChannel("wave_dedicated").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: null
                    }
                );
                this.getChannel('wave_dedicated_state').setState(2);
            } else if (state == 2) {
                const endValue = this.interpolate(rng.getOne(), 0, 100, wave_dedicated_crest_min_value, wave_dedicated_crest_max_value);
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_dedicated_crest_transition_min_duration, wave_dedicated_crest_transition_max_duration);
                this.getChannel("wave_dedicated").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: endValue
                    }
                );
                this.getChannel('wave_dedicated_state').setState(3);
            } else if (state == 3) {
                const duration = this.interpolate(rng.getOne(), 0, 100, wave_dedicated_crest_min_duration, wave_dedicated_crest_max_duration);
                this.getChannel("wave_dedicated").addEvent(
                    {
                        startTime: null,
                        duration: duration,
                        startValue: null,
                        endValue: null
                    }
                );
                this.getChannel('wave_dedicated_state').setState(0);
            }
        }
    }
}
