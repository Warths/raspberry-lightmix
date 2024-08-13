import { Channel } from "./channel";
import { Fixture } from "./fixture";

export class Event {
    private initialized = false;
    private ended = false
    private state = 0

    constructor(
        private startValue: number | null,
        private endValue: number | null,
        private startTime: number | null,
        private duration: number | null
    ) {}

    init(channel: Channel) {
        if (this.startValue === null) {
            this.startValue = channel.getState()
        }

        if (this.endValue === null) {
            this.endValue = channel.getState()
        }

        if (this.duration === null) {
            this.duration = 0
        }
        this.initialized = true
    }

    getState() {
        return this.state
    }

    isReady() {
        return this.initialized
    }

    isEnded() {
        return this.ended
    }

    updateState(time: number) {
        this.state = this.computeState(time)
    }


    computeState(time: number) {
        if (this.duration === null || this.startValue === null || this.endValue === null) {
            throw new Error()
        }

        if (this.startTime === null) {
            this.startTime = time
        }

        if (this.startTime > time) {
            return this.startValue
        }


        if (this.startTime + this.duration < time) {
            this.ended = true
            return this.endValue
        }

        const progress = Math.max(0, Math.min(1, (time - this.startTime) / this.duration))
        
        const interpolatedProgress = this.quadraticInterpolation(progress)

        return (this.endValue - this.startValue) * interpolatedProgress + this.startValue

    }

    quadraticInterpolation(coefficient: number) {
        if (coefficient < 0.5) {
            return 2 * coefficient * coefficient;
        } else {
            return -2 * (coefficient - 1) * (coefficient - 1) + 1;
        }
    }

    getStartTime() {
        return this.startTime
    }

    applyTimeDelta(delta: number) {
        if (this.startTime !== null) {
            this.startTime -= delta
        }
    }
}