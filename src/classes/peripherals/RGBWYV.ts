import { Fixture } from "../lightmix/fixture";


import { i2c } from "../i2c/i2c";

export class RGBWYV {

    constructor(
        private i2cBus: any, 
        private address: number, 
        private fixture: Fixture
    ) {
    }

    writeState() {
        this.fixture.getState()
        i2c.writeByteSync(this.address, 2, Buffer.from([128, 128]))
    }
}