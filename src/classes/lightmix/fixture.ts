import { Channel } from "./channel";
import { FixtureState } from "./types";


export class Fixture {
    constructor(
        private channels: Record<string, Channel> = {}
    ) {}

    createChannel(channelId: string, initialValue = 0) {
        this.channels[channelId] = new Channel(initialValue)
    }

    getState() {
        const state: FixtureState = {} 
        for (const [key, value] of Object.entries(this.channels)) {
            state[key] = value.getState()
        }
        return state
    }
}