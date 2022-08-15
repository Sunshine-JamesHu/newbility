"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDependModules = exports.DependsOn = void 0;
const Metadata_1 = require("../metadata/Metadata");
const METADATA_TOKEN = (0, Metadata_1.GetMetadataKey)('Sys:DependsOn');
function DependsOn(...module) {
    return (target) => {
        (0, Metadata_1.DefineMetadata)(METADATA_TOKEN, module, target);
    };
}
exports.DependsOn = DependsOn;
function GetDependModules(target) {
    return (0, Metadata_1.GetMetadata)(METADATA_TOKEN, target);
}
exports.GetDependModules = GetDependModules;
//# sourceMappingURL=DependsOn.js.map