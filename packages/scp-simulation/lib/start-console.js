"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_interface_1 = require("./console-interface");
const simulation_1 = require("./simulation");
new console_interface_1.ConsoleInterfacer(new console_interface_1.ConsoleAdjacencyMatrixVisualization(), new simulation_1.ScenarioLoader());
