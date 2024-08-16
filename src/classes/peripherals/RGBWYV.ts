import { Fixture } from "../lightmix/fixture";

export class RGBWYV {
    constructor(i2cBus: any, address: number, private fixture: Fixture) {}

    writeState() {
        this.fixture.getState()
    }
}