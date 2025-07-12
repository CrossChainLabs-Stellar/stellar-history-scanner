import { PublicKey } from '.';
import { Message } from '../federated-voting';
import { Payload } from '../overlay/Overlay';
import { EventCollector } from './EventCollector';
import { Node } from './Node';
import { ProtocolAction } from './ProtocolAction';
import { QuorumSet } from './QuorumSet';
import { UserAction } from './UserAction';
export interface Context extends EventCollector {
    executeActions(protocolActions: ProtocolAction[], userActions: UserAction[]): ProtocolAction[];
    reset(): void;
    receiveMessage(message: Message, isDisrupted: boolean): ProtocolAction[];
    broadcast(broadcaster: PublicKey, payload: Payload, neighborBlackList: PublicKey[]): ProtocolAction[];
    gossip(gossiper: PublicKey, payload: Payload, neighborBlackList: PublicKey[]): ProtocolAction[];
    addNode(node: Node): ProtocolAction[];
    addConnection(a: PublicKey, b: PublicKey): ProtocolAction[];
    removeNode(publicKey: string): ProtocolAction[];
    removeConnection(a: PublicKey, b: PublicKey): ProtocolAction[];
    updateQuorumSet(publicKey: string, quorumSet: QuorumSet): ProtocolAction[];
    getOverlaySettings(): {
        gossipEnabled: boolean;
        fullyConnected: boolean;
    };
}
//# sourceMappingURL=Context.d.ts.map