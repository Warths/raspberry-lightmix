export var i2c: I2C;

class I2C {
    private memory: { [address: number]: number[] } = {};
    private connectedDevices: Set<number> = new Set();

    constructor(private bus: number) {}

    writeByteSync(address: number, lengths: number, byte: Buffer) {
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
    const i2cBus = require("i2c-bus")
    i2c = i2cBus.openSync(1)
} catch (error: any) {
    i2c = I2C.openSync(1)
}




