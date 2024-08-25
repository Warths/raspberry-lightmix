export class Random {

    constructor(private state: number) {
         
    }

    getOne() {
        const randomNumber = this.generateUniqueNumber(this.state)
        this.state = randomNumber
        return randomNumber
    }

    hashNumber(input: string): number {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    
    generateUniqueNumber(input: number): number {
        input /= 100
        const inputStr = input.toString();
        const hash = this.hashNumber(inputStr);
        const uniqueNumber = hash % 1000000;
        return uniqueNumber / 10000;
    }

}

