export class Channel {
    private events:  Event[] = []
    
    constructor(
        private state: number = 0
    ) {}

    getState() {
        return this.state
    }
}