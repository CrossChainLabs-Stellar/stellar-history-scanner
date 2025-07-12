"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleInterfacer = void 0;
const readline = __importStar(require("readline"));
const simulation_1 = require("../simulation");
const federated_voting_1 = require("../federated-voting");
class ConsoleInterfacer {
    consoleAdjacencyMatrixVisualizer;
    scenarioLoader;
    rl;
    simulation;
    federatedVotingContext; //todo: could me made more generic, but not a priority right now
    constructor(consoleAdjacencyMatrixVisualizer, scenarioLoader) {
        this.consoleAdjacencyMatrixVisualizer = consoleAdjacencyMatrixVisualizer;
        this.scenarioLoader = scenarioLoader;
        this.federatedVotingContext = federated_voting_1.FederatedVotingContextFactory.create();
        this.simulation = new simulation_1.Simulation(this.federatedVotingContext);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('Welcome to the Stellar Federated Voting Protocol simulation.');
        console.log('------------------------------------------------------------');
        this.showCommands();
        console.log(''); // empty line
        this.rl.setPrompt('Enter command: \n> ');
        this.rl.prompt();
        this.rl
            .on('line', (input) => {
            this.handleCommand(input);
            this.rl.prompt();
        })
            .on('close', () => {
            console.log('Simulation ended.');
            process.exit(0);
        });
    }
    showNodeConnections() {
        this.consoleAdjacencyMatrixVisualizer.visualize(this.federatedVotingContext.overlayConnections);
    }
    showNodeTrustConnections() {
        const nodesWithQuorumSets = this.federatedVotingContext.publicKeysWithQuorumSets;
        const getQuorumSetMembers = (quorumSet) => {
            return quorumSet.validators.concat(quorumSet.innerQuorumSets.map(getQuorumSetMembers).flat());
        };
        this.consoleAdjacencyMatrixVisualizer.visualize(nodesWithQuorumSets.map((node) => ({
            publicKey: node.publicKey,
            connections: getQuorumSetMembers(node.quorumSet)
        })));
    }
    /**
     * @todo: implement autoplay
     */
    showCommands() {
        console.log(''); // empty line
        console.log('-- Available commands --');
        console.log('*) start: Start the simulation with a default scenario');
        console.log('*) next: Proceed to the next step in the simulation');
        console.log('*) list: Show available commands');
        console.log('*) vote PublicKey Statement: Vote on a statement');
        console.log('*) nodes:list --qsets > List all nodes in the simulation, optionally showing their quorum sets');
        console.log('*) nodes:inspect PublicKey --qset > show node information, optionally showing its quorum set');
        console.log('*) nodes:inspect:slices PublicKey > show the quorum slices of the specified node');
        console.log('*) nodes:inspect:v-blocking-sets PublicKey > show the possible VBlockingSets of the specified node');
        console.log('*) nodes:history PublicKey > show the output of the specified node previous step');
        console.log('*) connection:list > List all connections between nodes in an adjacency matrix');
        console.log('*) connections:add > PublicKey PublicKey: Add a connection between two nodes');
        console.log('*) connections:remove PublicKey PublicKey > Remove a connection between two nodes');
        console.log('*) nodes:add PublicKey QuorumSet > Add a node with a given public key and quorum set');
        console.log('*) nodes:remove PublicKey > Remove a node from the simulation (and its connections)');
        console.log('*) overlay:trust > Show all trust connections between nodes in an adjacency matrix');
        console.log('*) simulation:back > Go back to the previous step in the simulation');
        console.log('*) simulation:next > Go to the next step in the simulation');
        console.log('*) simulation:commands > Show the commands that will be executed in the next step');
        console.log('*) simulation:scenario:export > Export the current simulation scenario');
        console.log('*) simulation:step number > Go to a specific step in the simulation');
        console.log('*) q - Quit the simulation');
    }
    startSimulation() {
        console.log('\n-- Loading default scenario --\n');
        const scenario = simulation_1.FederatedVotingScenarioFactory.createBasicConsensus();
        const result = this.scenarioLoader.loadScenario(scenario);
        this.simulation = result.simulation;
        this.federatedVotingContext = result.protocolContext;
        console.log('Pending user actions');
        console.log("\n-- Enter 'next' to start federated consensus -- \n");
    }
    nextStep() {
        this.simulation.executeStep();
    }
    listNodes(showQSets) {
        if (showQSets) {
            this.listNodesWithQuorumSets();
        }
        console.log(this.federatedVotingContext.nodes);
    }
    listNodesWithQuorumSets() {
        console.log(this.federatedVotingContext.publicKeysWithQuorumSets);
    }
    handleCommand(command) {
        const args = command.trim().split(' ');
        switch (args[0]) {
            case 'start':
                this.startSimulation();
                break;
            case 'next':
                this.nextStep();
                break;
            case 'list':
                this.showCommands();
                break;
            case 'nodes:list':
                this.listNodes(args.includes('--qsets'));
                break;
            case 'nl':
                this.listNodes(args.includes('--qsets'));
                break;
            case 'connections:list':
                this.showNodeConnections();
                break;
            case 'cl':
                this.showNodeConnections();
                break;
            case 'overlay:trust':
                this.showNodeTrustConnections();
                break;
            case 'ot':
                this.showNodeTrustConnections();
                break;
            case 'nodes:inspect':
                this.inspectNode(args[1], args.includes('--qset'));
                break;
            case 'ni':
                this.inspectNode(args[1], args.includes('--qset'));
                break;
            case 'simulation:undo':
                this.simulation.goBackOneStep();
                break;
            case 'su':
                this.simulation.goBackOneStep();
                break;
            case 'simulation:pending-user-actions':
                console.log(this.simulation.pendingUserActions());
                break;
            case 'simulation:pending-protocol-actions':
                console.log(this.simulation.pendingProtocolActions());
                break;
            case 'q':
                console.log('Exiting simulation...');
                this.rl.close();
                break;
            default:
                console.log('Invalid command. Enter "list" to see available commands.\n');
        }
    }
    inspectNode(publicKey, includeQSet) {
        const nodeInfo = this.federatedVotingContext.nodes.find((node) => node.publicKey === publicKey);
        if (nodeInfo) {
            console.log(JSON.stringify(nodeInfo, null, 2));
        }
        else {
            console.log(`Node with public key ${publicKey} not found.`);
        }
    }
}
exports.ConsoleInterfacer = ConsoleInterfacer;
