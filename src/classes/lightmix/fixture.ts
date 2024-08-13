import { Channel } from "./channel";
import { FixtureState } from "./types";


export class Fixture {
    constructor(
        private channels: Record<string, Channel> = {}
    ) {}

    createChannel(channelId: string, initialValue = 0) {
        this.channels[channelId] = new Channel(initialValue)
    }

    getChannel(channelName: string) {
        return this.channels[channelName]
    }

    getState() {
        const state: FixtureState = {} 
        for (const [key, value] of Object.entries(this.channels)) {
            state[key] = value.getState()
        }
        return state
    }

    setState(channelName: string, value: number) {
        const channel = this.getChannel(channelName)
        if (channel) {
            channel.setState(value)
        }
    }

    updateState(time: number) {
        for (const channel of Object.values(this.channels)) {
            channel.updateState(time)
        }
    }

    applyTimeDelta(delta: number) {
        for (const channel of Object.values(this.channels)) {
            channel.applyTimeDelta(delta)
        }
    }

    clear() {
        for (const channel of Object.values(this.channels)) {
            channel.clear()
        }
    }
}