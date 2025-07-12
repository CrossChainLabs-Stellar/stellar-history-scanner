"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEventCollector = void 0;
/**
 * Simple event collector that can be used to collect events from multiple domain sources
 * and then drain them to be processed by a single event handler.
 *
 * This works because no real time constraints are placed on the events. This is just a simulation and events need only to be processed when the
 * domain logic is complete.
 */
class InMemoryEventCollector {
    events;
    constructor() {
        this.events = [];
    }
    registerEvent(event) {
        this.events.push(event);
    }
    registerEvents(events) {
        this.events.push(...events);
    }
    drainEvents() {
        const events = this.events;
        this.events = [];
        return events;
    }
    getEvents() {
        return this.events;
    }
}
exports.InMemoryEventCollector = InMemoryEventCollector;
