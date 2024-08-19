import { Fixture } from "../lightmix/fixture";

export class RGBWYV {

    constructor(
        private i2cBus: any, 
        private address: number, 
        private fixture: Fixture
    ) {
    }

    writeState() {
        this.fixture.getState()
        const random = Math.floor(Math.random() * 255)
        this.i2cBus.i2cWriteSync(this.address, 2, Buffer.from([random, random]))
    }
}