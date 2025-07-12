import { SimulationStep } from '../Simulation';
export declare class Scenario {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly isOverlayFullyConnected: boolean;
    readonly isOverlayGossipEnabled: boolean;
    readonly initialSimulationStep: SimulationStep;
    constructor(id: string, name: string, description: string, isOverlayFullyConnected: boolean, isOverlayGossipEnabled: boolean, initialSimulationStep: SimulationStep);
}
//# sourceMappingURL=Scenario.d.ts.map