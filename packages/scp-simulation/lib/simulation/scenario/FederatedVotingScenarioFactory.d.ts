import { Scenario } from './Scenario';
import { ScenarioSerializer } from './ScenarioSerializer';
export declare class FederatedVotingScenarioFactory {
    private scenarioSerializer;
    constructor(scenarioSerializer: ScenarioSerializer);
    static createBasicConsensus(): Scenario;
    loadJSONScenario(json: any): Scenario;
    loadAll(): Scenario[];
}
//# sourceMappingURL=FederatedVotingScenarioFactory.d.ts.map