import { Event } from './Event';
/**
 * Simple event collector that can be used to collect events from multiple domain sources
 * and then drain them to be processed by a single event handler.
 *
 * This works because no real time constraints are placed on the events. This is just a simulation and events need only to be processed when the
 * domain logic is complete.
 */
export declare class InMemoryEventCollector implements EventCollector {
    private events;
    constructor();
    protected registerEvent(event: Event): void;
    protected registerEvents(events: Event[]): void;
    drainEvents(): Event[];
    getEvents(): Event[];
}
export interface EventCollector {
    drainEvents(): Event[];
}
//# sourceMappingURL=EventCollector.d.ts.map