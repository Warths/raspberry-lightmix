import { Fixture } from "./fixture";
import { LightmixEvent } from "./lightmix.types";
import { LightMixState } from "./types";


export class LightMix {

    timeOffset = Date.now()

    constructor(private fixtures: Record<string, Fixture>) {}

    getState(): LightMixState {
        const state: LightMixState = {} 
        for (const [key, value] of Object.entries(this.fixtures)) {
            state[key] = value.getState()
        }
        return state
    }

    printState(): void {
        const state = this.getState();
        const stateStrings: string[] = [];
        const valueLength = 7; 

        for (const [key, values] of Object.entries(state)) {
            const valueStrings = Object.entries(values)
                .map(([subKey, subValue]) => {
                    const formattedValue = subValue.toFixed(2).padStart(valueLength, ' ');
                    return `${subKey}: ${formattedValue}`;
                })
                .join(', ');
            stateStrings.push(`Fixture ${key}: { ${valueStrings} }`);
        }

        console.log(stateStrings.join(' | '));
    }

    updateState(time: number): void {
        time = time - this.timeOffset
        for (const fixture of Object.values(this.fixtures)) {
            fixture.updateState(time)
        }
    }
    
    setState(fixtureName: string, channelName: string, value: number) {
        const fixture = this.getFixture(fixtureName)
        fixture.setState(channelName, value)
    }

    setAll(channelName: string, value: () => number) {
        const fixtures = []
        for(const fixture of Object.values(this.fixtures)) {
            fixture.setState(channelName, value())
        }
    }

    getFixture(fixtureName: string) {
        return this.fixtures[fixtureName]
    }

    calibrate(hostTime: number) {
        const currentTime = Date.now()
        const newTimeOffset = currentTime - hostTime

        const delta = newTimeOffset - this.timeOffset

        this.timeOffset = newTimeOffset

        for(const fixture of Object.values(this.fixtures)) {
            fixture.applyTimeDelta(delta)
        }
    }

    clear() {
        for(const fixture of Object.values(this.fixtures)) {
            fixture.clear()
        }    
    }

    addEvent(event: LightmixEvent) {
        const fixture = this.getFixture(event.fixture)
        if (!fixture) {
            return 
        }
        fixture.addEvent(event)
    }

}