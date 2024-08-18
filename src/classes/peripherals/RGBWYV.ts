import { Fixture } from "../lightmix/fixture";

export class RGBWYV {
    constructor(
        private i2cBus: any, 
        private address: number, 
        private fixture: Fixture
    ) {}

    writeState() {
        this.fixture.getState()
        const state = (Math.random() * 255).toFixed(0)
        console.log(state)
        this.i2cBus.writeByteSync(this.address, 0x00, 0x10)
    }
}