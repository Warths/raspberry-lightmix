import { Fixture } from "./fixture";
import { LightMixState } from "./types";


export class LightMix {
    constructor(private fixtures: Record<string, Fixture>) {}

    getState(): LightMixState {
        const state: LightMixState = {} 
        for (const [key, value] of Object.entries(this.fixtures)) {
            state[key] = value.getState()
        }
        return state
    }
    
    updateState(time: number): void {
        for (const fixture of Object.values(this.fixtures)) {
            fixture.updateState(time)
        }
    }
}