import { Context, InMemoryEventCollector, Node, PublicKey, QuorumSet, UserAction } from '../core';
import { Message } from './Message';
import { ProtocolAction } from '../core/ProtocolAction';
import { FederatedVotingProtocolState } from './protocol/FederatedVotingProtocolState';
import { FederatedVotingProtocol } from './protocol/FederatedVotingProtocol';
import { Statement } from './protocol';
import { Overlay, Payload } from '../overlay/Overlay';
export interface FederatedVotingContextState {
    protocolStates: FederatedVotingProtocolState[];
    safetyDisruptingNodes: Set<string>;
    livenessDisruptingNodes: Set<string>;
}
export declare class FederatedVotingContext extends InMemoryEventCollector//todo: composition
 implements Context {
    private federatedVotingProtocol;
    private overlay;
    private state;
    constructor(federatedVotingProtocol: FederatedVotingProtocol, overlay: Overlay);
    reset(): void;
    getState(): FederatedVotingContextState;
    executeActions(protocolActions: ProtocolAction[], userActions: UserAction[]): ProtocolAction[];
    addNode(node: Node): ProtocolAction[];
    addConnection(a: PublicKey, b: PublicKey): ProtocolAction[];
    removeConnection(a: PublicKey, b: PublicKey): ProtocolAction[];
    removeNode(publicKey: string): ProtocolAction[];
    updateQuorumSet(publicKey: PublicKey, quorumSet: QuorumSet): ProtocolAction[];
    getProtocolState(publicKey: PublicKey): FederatedVotingProtocolState | null;
    vote(publicKey: PublicKey, statement: Statement): ProtocolAction[];
    private processVoteBroadcastRequests;
    canVote(publicKey: PublicKey): boolean;
    forgeMessage(message: Message): ProtocolAction[];
    broadcast(broadcaster: PublicKey, payload: Payload, neighborBlackList: PublicKey[]): ProtocolAction[];
    gossip(gossiper: PublicKey, payload: Payload, neighborBlackList: PublicKey[]): ProtocolAction[];
    receiveMessage(message: Message, isDisrupted: boolean): ProtocolAction[];
    get nodes(): Node[];
    get publicKeysWithQuorumSets(): {
        publicKey: PublicKey;
        quorumSet: QuorumSet;
    }[];
    get overlayConnections(): {
        publicKey: PublicKey;
        connections: PublicKey[];
    }[];
    get overlayIsGossipEnabled(): boolean;
    get overlayIsFullyConnected(): boolean;
    getOverlaySettings(): {
        gossipEnabled: boolean;
        fullyConnected: boolean;
    };
}
//# sourceMappingURL=FederatedVotingContext.d.ts.map