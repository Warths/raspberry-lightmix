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
        this.i2cBus.writeByteSync(this.address, 0x00, 0xff)
    }
}