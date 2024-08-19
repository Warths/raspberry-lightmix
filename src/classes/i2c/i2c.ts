export var i2c: I2C;

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

try {
    console.log("HEY")
    const i2cBus = require('i2c-bus');
    const i2c = i2cBus.openSync(1);
    i2c.i2cWriteSync(0x10, 2, Buffer.from([255, 255]))
} catch (error: any) {
    i2c = I2C.openSync(1)
}




