import { Fixture } from "../lightmix/fixture";

export class i2CPeripheral {

    interpolate(value: number, minValue: number, maxValue: number, newMinValue: number, newMaxValue: number) {
        return newMinValue + (value - minValue) / (maxValue - minValue) * (newMaxValue - newMinValue);
    }
    
    numberTo2x8Bit(num: number) {
        const highByte = (num >> 8) & 0xFF;
        const lowByte = num & 0xFF;         
    
        return [highByte, lowByte];
    }

    numberTo3x8Bit(num: number) {
        const highByte = (num >> 16) & 0xFF;
        const middleByte = (num >> 8) & 0xFF;
        const lowByte = num & 0xFF;         
    
        return [highByte, middleByte, lowByte];
    }
}

export class RGBWYV extends i2CPeripheral {

    constructor(
        private i2cBus: any, 
        private address: number, 
        private fixture: Fixture
    ) {
        super()
    }

    writeState() {

        const random = Math.floor(Math.random() * 255)
        
        const red = this.numberTo2x8Bit(this.interpolate(this.fixture.getChannel('red').getState(), 0x00, 0xFF, 0x00, 0xFFFF))


        this.i2cBus.i2cWriteSync(this.address, 2, Buffer.from(red))
    }
}