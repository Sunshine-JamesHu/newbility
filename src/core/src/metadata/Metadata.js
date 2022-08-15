"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMetadataKey = exports.GetMetadata = exports.DefineMetadata = exports.Metadata = void 0;
const Metadata = Reflect.metadata;
exports.Metadata = Metadata;
const DefineMetadata = Reflect.defineMetadata;
exports.DefineMetadata = DefineMetadata;
const GetMetadata = Reflect.getMetadata;
exports.GetMetadata = GetMetadata;
function GetMetadataKey(key) {
    return `Metadata:${key}`;
}
exports.GetMetadataKey = GetMetadataKey;
//# sourceMappingURL=Metadata.js.map