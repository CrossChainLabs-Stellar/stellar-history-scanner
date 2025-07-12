import { InMemoryEventCollector } from '../core';
import { Message, Vote } from '../federated-voting';
import { ReceiveMessage } from '../federated-voting/action/protocol/ReceiveMessage';
import { Gossip } from './action/Gossip';
export type PublicKey = string;
export type OverlayAction = ReceiveMessage | Gossip;
export type Payload = Vote;
export declare class Overlay extends InMemoryEventCollector {
    nodes: Set<PublicKey>;
    connections: Map<PublicKey, Set<PublicKey>>;
    private _fullyConnected;
    private _gossipEnabled;
    constructor(fullyConnected?: boolean, gossipEnabled?: boolean);
    private exchanges;
    private getExchangeKey;
    private markExchanged;
    private hasExchangedPayload;
    private removeExchanges;
    get fullyConnected(): boolean;
    get gossipEnabled(): boolean;
    reset(): void;
    addNode(node: PublicKey): void;
    removeNode(node: PublicKey): void;
    addConnection(a: PublicKey, b: PublicKey): void;
    removeConnection(a: PublicKey, b: PublicKey): void;
    broadcast(broadcaster: PublicKey, payload: Payload, neighborBlackList?: PublicKey[]): OverlayAction[];
    receiveMessage(message: Message, isDisrupted: boolean): OverlayAction[];
    gossip(sender: PublicKey, payload: Payload, neighborBlackList: PublicKey[]): OverlayAction[];
    sendMessage(message: Message, isForged?: boolean): OverlayAction;
    private makeFullyConnected;
    private markSent;
    private markReceived;
    private hasSentToAllNeighbors;
}
//# sourceMappingURL=Overlay.d.ts.map