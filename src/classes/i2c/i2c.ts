export var i2c: I2C;

class I2C {
    private memory: { [address: number]: number[] } = {};
    private connectedDevices: Set<number> = new Set();

    constructor(private bus: number) {}

    writeByteSync(address: number, command: number, byte: number) {
        if (!this.memory[address]) {
            this.memory[address] = [];
        }

        this.memory[address][command] = byte;
        // console.log(
        //     `Mock: Wrote byte 0x${byte.toString(16)} to command 0x${command.toString(
        //         16
        //     )} at address 0x${address.toString(16)} on bus ${this.bus}`
        // );
    }

    readByteSync(address: number, command: number): number {
        const byte = this.memory[address]?.[command] ?? 0;
        // console.log(
        //     `Mock: Read byte 0x${byte.toString(16)} from command 0x${command.toString(
        //         16
        //     )} at address 0x${address.toString(16)} on bus ${this.bus}`
        // );
        return byte;
    }

    closeSync() {
        console.log(`Mock: Closed I2C bus ${this.bus}`);
    }

    scanSync(): number[] {
        const addresses = Array.from(this.connectedDevices);
        console.log(
            `Mock: Scanning I2C bus ${this.bus}, found devices at addresses: ${addresses.map(
                addr => `0x${addr.toString(16)}`
            ).join(', ')}`
        );
        return addresses;
    }

    static openSync(bus: number) {
        console.log(`Mock: Opened I2C bus ${bus}`);
        return new I2C(bus);
    }
}

try {
    const i2cBus = require("i2c-bus")
    i2c = i2cBus.openSync(1)
} catch (error: any) {
    console.warn(error)
    console.warn("Failed to load I2C Bus. Loading Mock..")
    i2c = I2C.openSync(1)
}




