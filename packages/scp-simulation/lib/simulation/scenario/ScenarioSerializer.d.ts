import { SimulationStepListSerializer } from '../serializer/SimulationStepListSerializer';
import { Scenario } from './Scenario';
export declare class ScenarioSerializer {
    private simulationStepListSerializer;
    constructor(simulationStepListSerializer: SimulationStepListSerializer);
    toJSON(scenario: Scenario): {
        serializeVersion: string;
        id: string;
        name: string;
        description: string;
        isOverlayFullyConnected: boolean;
        isOverlayGossipEnabled: boolean;
        simulationSteps: import("../serializer/SimulationStepSerializer").SerializedSimulationStep[];
    };
    fromJSON(json: any): Scenario;
}
//# sourceMappingURL=ScenarioSerializer.d.ts.map