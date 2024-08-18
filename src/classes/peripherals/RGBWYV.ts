import { Fixture } from "../lightmix/fixture";

import * as i2c from "i2c-bus";

export class RGBWYV {
    bus:  i2c.I2CBus
    constructor(
        private i2cBus: any, 
        private address: number, 
        private fixture: Fixture
    ) {
        this.bus = i2c.openSync(1)
    }

    writeState() {
        this.fixture.getState()
        const state = (Math.random() * 255).toFixed(0)
        console.log(state)
        this.i2cBus.writeByteSync(this.address, 0x01, state)
    }
}