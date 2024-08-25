import { Channel } from "../channel";
import { FixtureEvent } from "../lightmix.types";
import { i2CPeripheral } from "./generic";
import { FixtureState } from "../types";


export class Fixture extends i2CPeripheral {
    constructor(
        private channels: Record<string, Channel> = {}
    ) {
        super()
    }

    createChannel(channelId: string, initialValue = 0) {
        this.channels[channelId] = new Channel(initialValue)
        return this
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

    addEvent(event: FixtureEvent) {
        const channel = this.getChannel(event.channel)
        if (!channel) {
            return
        }
        channel.addEvent(event)
    }

    channelValue8bitTo16bit(name: string) {
        return this.interpolate(this.getChannel(name).getState(), 0, 255, 0, 65535)
    }

    channelValue8bit(name: string) {
        return this.interpolate(this.getChannel(name).getState(), 0, 255, 0, 255)
    }
}