"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActionParamsMetadata = exports.RequestBody = exports.RequestQuery = exports.RequestParamType = void 0;
const core_1 = require("@newbility/core");
const METADATA_ACTION_PARAMS = (0, core_1.GetMetadataKey)('Sys:ActionParams');
var RequestParamType;
(function (RequestParamType) {
    RequestParamType[RequestParamType["Body"] = 0] = "Body";
    RequestParamType[RequestParamType["Param"] = 1] = "Param";
})(RequestParamType = exports.RequestParamType || (exports.RequestParamType = {}));
function RequestQuery(paramName) {
    return (target, key, index) => {
        const paramTypes = (0, core_1.GetMetadata)('design:paramtypes', target, key);
        const params = GetActionParamsMetadata(target[key]);
        params.unshift({ in: 'query', key: paramName, index: index, type: paramTypes[index] });
        (0, core_1.DefineMetadata)(METADATA_ACTION_PARAMS, params, target[key]);
    };
}
exports.RequestQuery = RequestQuery;
function RequestBody() {
    return (target, key, index) => {
        const paramTypes = (0, core_1.GetMetadata)('design:paramtypes', target, key);
        const params = GetActionParamsMetadata(target[key]);
        params.push({ in: 'body', index: index, type: paramTypes[index] });
        (0, core_1.DefineMetadata)(METADATA_ACTION_PARAMS, params, target[key]);
    };
}
exports.RequestBody = RequestBody;
function GetActionParamsMetadata(target) {
    return (0, core_1.GetMetadata)(METADATA_ACTION_PARAMS, target) || [];
}
exports.GetActionParamsMetadata = GetActionParamsMetadata;
//# sourceMappingURL=RequestData.js.map