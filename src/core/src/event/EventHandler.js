"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = exports.IsEventHandler = exports.GetEventKey = exports.EventKey = exports.EVENT_HANDLER_METADATA = void 0;
const Dependency_1 = require("../di/Dependency");
const Metadata_1 = require("../metadata/Metadata");
exports.EVENT_HANDLER_METADATA = (0, Metadata_1.GetMetadataKey)('Sys:EventHandler');
function EventKey(key) {
    return (target) => {
        (0, Metadata_1.DefineMetadata)(exports.EVENT_HANDLER_METADATA, key, target);
    };
}
exports.EventKey = EventKey;
function GetEventKey(target) {
    return (0, Metadata_1.GetMetadata)(exports.EVENT_HANDLER_METADATA, target);
}
exports.GetEventKey = GetEventKey;
function IsEventHandler(target) {
    return !!GetEventKey(target);
}
exports.IsEventHandler = IsEventHandler;
let EventHandler = class EventHandler {
};
EventHandler = __decorate([
    (0, Dependency_1.Abstract)()
], EventHandler);
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map