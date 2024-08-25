import { I2C } from "../../i2c/i2c";

export abstract class i2CPeripheral {
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

    writeState(i2c: I2C) {}
}