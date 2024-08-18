import { Fixture } from "../lightmix/fixture";


const { spawn } = require('child_process')


export class RGBWYV {

    constructor(
        private i2cBus: any, 
        private address: number, 
        private fixture: Fixture
    ) {
    }

    writeState() {
        this.fixture.getState()
        spawn("/usr/sbin/i2cset -y 1 0x10 0xff 0xff i")
    }
}