"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationState = void 0;
var ObservationState;
(function (ObservationState) {
    ObservationState[ObservationState["Idle"] = 0] = "Idle";
    ObservationState[ObservationState["Syncing"] = 1] = "Syncing";
    ObservationState[ObservationState["Synced"] = 2] = "Synced";
    ObservationState[ObservationState["Stopping"] = 3] = "Stopping";
    ObservationState[ObservationState["Stopped"] = 4] = "Stopped";
})(ObservationState || (exports.ObservationState = ObservationState = {}));
