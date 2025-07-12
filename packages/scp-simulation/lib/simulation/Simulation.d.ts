import { Event, Context, UserAction, ProtocolAction } from '../core';
export interface SimulationStep {
    userActions: UserAction[];
    protocolActions: ProtocolAction[];
    previousEvents: Event[];
    nextStep: SimulationStep | null;
    previousStep: SimulationStep | null;
    previousStepHash: string;
}
export declare class Simulation {
    private context;
    private initialStep;
    private currentStep;
    constructor(context: Context, initialStep?: SimulationStep);
    getFullEventLog(): Event[][];
    getLatestEvents(): Event[];
    addUserAction(action: UserAction): void;
    pendingUserActions(): UserAction[];
    cancelPendingUserAction(userAction: UserAction): void;
    pendingProtocolActions(): ProtocolAction[];
    executeStep(): void;
    hasNextStep(): boolean;
    hasPreviousStep(): boolean;
    goBackOneStep(): void;
    private replayState;
    goToFirstStep(): void;
    getInitialStep(): SimulationStep;
}
export declare function calculateStepHash(step: SimulationStep, isOverlayFullyConnected: boolean, isOverlayGossipEnabled: boolean): string;
//# sourceMappingURL=Simulation.d.ts.map