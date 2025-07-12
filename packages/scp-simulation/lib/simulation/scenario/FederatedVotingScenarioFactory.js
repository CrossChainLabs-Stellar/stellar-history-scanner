"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedVotingScenarioFactory = void 0;
const core_1 = require("../../core");
const federated_voting_1 = require("../../federated-voting");
const Scenario_1 = require("./Scenario");
const accepting_not_enough_safety_json_1 = __importDefault(require("./data/accepting-not-enough-safety.json"));
const accepting_not_enough_liveness_json_1 = __importDefault(require("./data/accepting-not-enough-liveness.json"));
const accepting_not_enough_liveness_gossip_fix_json_1 = __importDefault(require("./data/accepting-not-enough-liveness-gossip-fix.json"));
const network_split_ill_behaved_node_json_1 = __importDefault(require("./data/network-split-ill-behaved-node.json"));
const network_split_partial_json_1 = __importDefault(require("./data/network-split-partial.json"));
const network_safe_ill_behaved_node_json_1 = __importDefault(require("./data/network-safe-ill-behaved-node.json"));
const voting_stuck_because_votes_json_1 = __importDefault(require("./data/voting-stuck-because-votes.json"));
const voting_stuck_because_node_crashes_json_1 = __importDefault(require("./data/voting-stuck-because-node-crashes.json"));
const voting_stuck_for_befouled_node_json_1 = __importDefault(require("./data/voting-stuck-for-befouled-node.json"));
const voting_succeeded_despite_node_crash_json_1 = __importDefault(require("./data/voting-succeeded-despite-node-crash.json"));
const overlay_ring_json_1 = __importDefault(require("./data/overlay-ring.json"));
const voting_stuck_overlay_partition_json_1 = __importDefault(require("./data/voting-stuck-overlay-partition.json"));
const confirming_is_enough_liveness_json_1 = __importDefault(require("./data/confirming-is-enough-liveness.json"));
class FederatedVotingScenarioFactory {
    scenarioSerializer;
    constructor(scenarioSerializer) {
        this.scenarioSerializer = scenarioSerializer;
    }
    static createBasicConsensus() {
        const quorumSet = new core_1.QuorumSet(2, ['Alice', 'Bob', 'Chad'], []);
        const steve = new core_1.Node('Steve', new core_1.QuorumSet(2, ['Bob', 'Chad', 'Steve'], []));
        const daisy = new core_1.Node('Daisy', new core_1.QuorumSet(2, ['Steve', 'Chad', 'Daisy'], []));
        const userActions = [
            new federated_voting_1.AddNode('Alice', quorumSet),
            new federated_voting_1.AddNode('Bob', quorumSet),
            new federated_voting_1.AddNode('Chad', quorumSet),
            new federated_voting_1.AddNode('Steve', steve.quorumSet),
            new federated_voting_1.AddNode('Daisy', daisy.quorumSet),
            new federated_voting_1.VoteOnStatement('Alice', 'pizza'),
            new federated_voting_1.VoteOnStatement('Bob', 'pizza'),
            new federated_voting_1.VoteOnStatement('Chad', 'burger'),
            new federated_voting_1.VoteOnStatement('Steve', 'burger'),
            new federated_voting_1.VoteOnStatement('Daisy', 'burger')
        ];
        return new Scenario_1.Scenario('basic-agreement', 'Successful agreement scenario', 'In this scenario, nodes will reach agreement', true, false, {
            userActions: userActions,
            protocolActions: [],
            previousEvents: [],
            previousStep: null,
            previousStepHash: '',
            nextStep: null
        });
    }
    loadJSONScenario(json) {
        try {
            return this.scenarioSerializer.fromJSON(json);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new Error('Failed to create scenario', { cause: e });
            }
            throw new Error('Failed to create scenario');
        }
    }
    loadAll() {
        return [
            FederatedVotingScenarioFactory.createBasicConsensus(),
            this.loadJSONScenario(voting_stuck_because_votes_json_1.default),
            this.loadJSONScenario(voting_succeeded_despite_node_crash_json_1.default),
            this.loadJSONScenario(voting_stuck_because_node_crashes_json_1.default),
            this.loadJSONScenario(voting_stuck_for_befouled_node_json_1.default),
            this.loadJSONScenario(voting_stuck_overlay_partition_json_1.default),
            this.loadJSONScenario(accepting_not_enough_liveness_json_1.default),
            this.loadJSONScenario(accepting_not_enough_liveness_gossip_fix_json_1.default),
            this.loadJSONScenario(confirming_is_enough_liveness_json_1.default),
            this.loadJSONScenario(accepting_not_enough_safety_json_1.default),
            this.loadJSONScenario(network_split_ill_behaved_node_json_1.default),
            this.loadJSONScenario(network_split_partial_json_1.default),
            this.loadJSONScenario(network_safe_ill_behaved_node_json_1.default),
            this.loadJSONScenario(overlay_ring_json_1.default)
        ];
    }
}
exports.FederatedVotingScenarioFactory = FederatedVotingScenarioFactory;
