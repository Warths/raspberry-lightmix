import { execPath } from "process";

class I2C {
    private memory: { [address: number]: number[] } = {};
    private connectedDevices: Set<number> = new Set();

    constructor(private bus: number) {}

    i2cWriteSync(address: number, length: number, byte: Buffer) {
        if (!this.memory[address]) {
            this.memory[address] = [];
        }
    }

    readByteSync(address: number, command: number): number {
        const byte = this.memory[address]?.[command] ?? 0;
        return byte;
    }

    closeSync() {
    }

    scanSync(): number[] {
        const addresses = Array.from(this.connectedDevices);
        return addresses;
    }

    static openSync(bus: number) {
        return new I2C(bus);
    }
}

export var i2cFactory: (no: number) => I2C = (no: number) => {
    try {
        const i2cBus = require('i2c-bus');
        const i2c = i2cBus.openSync(no);
        i2c.i2cWriteSync(0x10, 2, Buffer.from([255, no]))
        return i2c
    } catch (error: any) {
        return I2C.openSync(no)
    }
}
 




