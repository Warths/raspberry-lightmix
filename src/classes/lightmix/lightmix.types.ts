export type ChannelEvent = {
    startTime: number | null
    duration: number | null
    startValue: number | null
    endValue: number | null
}

export type FixtureEvent = {channel: string} & ChannelEvent
export type LightmixEvent = {fixture: string} & FixtureEvent




