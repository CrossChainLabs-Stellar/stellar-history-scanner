import { SimulationStep } from '../Simulation';
export interface SerializedSimulationStep {
    userActions: any[];
    protocolActions: any[];
    previousStepHash: string;
}
/**
 * Class for serializing and deserializing SimulationStep objects
 */
export declare class SimulationStepSerializer {
    /**
     * Convert a SimulationStep to a JSON-serializable object
     */
    toJSON(step: SimulationStep): SerializedSimulationStep;
    /**
     * Create a SimulationStep from a serialized object
     * Note: This creates a partial SimulationStep with null references for nextStep and previousStep
     * These should be linked appropriately by the Simulation class
     */
    fromJSON(json: SerializedSimulationStep): SimulationStep;
    private deserializeUserAction;
    private deserializeProtocolAction;
}
//# sourceMappingURL=SimulationStepSerializer.d.ts.map