import { ScenarioLoader } from '../simulation';
import { ConsoleAdjacencyMatrixVisualization } from './ConsoleAdjacencyMatrixVisualizer';
export declare class ConsoleInterfacer {
    private consoleAdjacencyMatrixVisualizer;
    private scenarioLoader;
    private rl;
    private simulation;
    private federatedVotingContext;
    constructor(consoleAdjacencyMatrixVisualizer: ConsoleAdjacencyMatrixVisualization, scenarioLoader: ScenarioLoader);
    private showNodeConnections;
    private showNodeTrustConnections;
    /**
     * @todo: implement autoplay
     */
    private showCommands;
    private startSimulation;
    private nextStep;
    private listNodes;
    private listNodesWithQuorumSets;
    private handleCommand;
    private inspectNode;
}
//# sourceMappingURL=ConsoleInterfacer.d.ts.map