"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActionInfo = exports.GetHttpMethodStr = exports.HttpRequest = exports.HttpOptions = exports.HttpDelete = exports.HttpPut = exports.HttpPost = exports.HttpGet = exports.HttpMethod = void 0;
const core_1 = require("@newbility/core");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 0] = "GET";
    HttpMethod[HttpMethod["POST"] = 1] = "POST";
    HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
    HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
    HttpMethod[HttpMethod["OPTIONS"] = 4] = "OPTIONS";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
const METADATA_ACTION_INFO = (0, core_1.GetMetadataKey)('Sys:ActionInfo');
function HttpGet(data) {
    return HttpRequest(HttpMethod.GET, data);
}
exports.HttpGet = HttpGet;
function HttpPost(data) {
    return HttpRequest(HttpMethod.POST, data);
}
exports.HttpPost = HttpPost;
function HttpPut(data) {
    return HttpRequest(HttpMethod.PUT, data);
}
exports.HttpPut = HttpPut;
function HttpDelete(data) {
    return HttpRequest(HttpMethod.DELETE, data);
}
exports.HttpDelete = HttpDelete;
function HttpOptions(data) {
    return HttpRequest(HttpMethod.OPTIONS, data);
}
exports.HttpOptions = HttpOptions;
function HttpRequest(httpMethod, data) {
    return (target, key, descriptor) => {
        let actionName = key;
        let desc = undefined;
        if (data) {
            if (typeof data === 'string')
                actionName = data;
            else {
                if (data.name)
                    actionName = data.name;
                if (data.desc)
                    desc = data.desc;
            }
        }
        if (!data)
            data = key;
        const actionInfo = {
            name: GetActionName(actionName),
            httpMethod: httpMethod,
            desc: desc,
        };
        SetActionInfo(descriptor.value, actionInfo);
    };
}
exports.HttpRequest = HttpRequest;
function GetHttpMethodStr(httpMethod) {
    let methodStr = 'get';
    switch (httpMethod) {
        case HttpMethod.POST:
            methodStr = 'post';
            break;
        case HttpMethod.PUT:
            methodStr = 'put';
            break;
        case HttpMethod.DELETE:
            methodStr = 'delete';
            break;
        case HttpMethod.OPTIONS:
            methodStr = 'options';
            break;
        default:
            methodStr = 'get';
            break;
    }
    return methodStr;
}
exports.GetHttpMethodStr = GetHttpMethodStr;
function GetActionInfo(action) {
    return (0, core_1.GetMetadata)(METADATA_ACTION_INFO, action);
}
exports.GetActionInfo = GetActionInfo;
function GetActionName(actionName) {
    actionName = `${actionName[0].toLowerCase()}${actionName.substring(1, actionName.length)}`;
    return actionName;
}
function SetActionInfo(target, actionInfo) {
    (0, core_1.DefineMetadata)(METADATA_ACTION_INFO, actionInfo, target);
}
//# sourceMappingURL=Request.js.map