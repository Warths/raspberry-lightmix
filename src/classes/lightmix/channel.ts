import { Event } from "./event"

export class Channel {
    private events:  Event[] = [
        new Event(100, 0, null, 10000)
    ]
    
    constructor(
        private state: number = 0
    ) {}

    getState() {
        return this.state
    }

    updateState(time: number) {
        const currentEvent = this.getCurrentEvent()

        if (currentEvent === null) {
            return 
        }

        if (currentEvent.isReady()) {
            currentEvent.init(this)
        }

        currentEvent.updateState(time)
        this.state = currentEvent.getState()

        if  (currentEvent.isEnded()) {
            this.removeEvent(currentEvent)
        }

        
    }

    getCurrentEvent(): Event | null {
        let earliestEvent: Event | null = null;

        for (const event of this.events) {
            const startTime = event.getStartTime();

            if (startTime === null) {
                return event;
            } else {
                if (!earliestEvent || startTime < earliestEvent.getStartTime()!) {
                    earliestEvent = event;
                }
            }
        }

        return earliestEvent;
    }

    removeEvent(eventToRemove: Event): void {
        this.events = this.events.filter(event => event !== eventToRemove);
    } 
}