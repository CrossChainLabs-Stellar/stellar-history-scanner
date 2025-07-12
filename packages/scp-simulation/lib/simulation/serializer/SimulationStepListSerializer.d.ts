import { SimulationStep } from '../Simulation';
import { SerializedSimulationStep, SimulationStepSerializer } from './SimulationStepSerializer';
export declare class SimulationStepListSerializer {
    private stepSerializer;
    constructor(stepSerializer: SimulationStepSerializer);
    toJSON(initialSimulationStep: SimulationStep): SerializedSimulationStep[];
    fromJSON(json: SerializedSimulationStep[]): SimulationStep;
}
//# sourceMappingURL=SimulationStepListSerializer.d.ts.map