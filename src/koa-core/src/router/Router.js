"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRouterInfo = exports.GetRouterPath = exports.Router = void 0;
const core_1 = require("@newbility/core");
const Controller_1 = require("../controller/Controller");
const METADATA_ROUTER_INFO = (0, core_1.GetMetadataKey)('Sys:RouterInfo');
function Router(data) {
    return (target) => {
        let routerInfo = { path: `/${(0, Controller_1.GetControllerName)(target).toLowerCase()}` };
        if (data) {
            if (typeof data === 'string')
                routerInfo.path = data;
            else {
                if (data.path)
                    routerInfo.path = data.path;
                if (data.desc)
                    routerInfo.desc = data.desc;
            }
        }
        SetRouterInfo(target, routerInfo);
    };
}
exports.Router = Router;
function GetRouterPath(target) {
    const routerInfo = GetRouterInfo(target);
    return routerInfo?.path;
}
exports.GetRouterPath = GetRouterPath;
function GetRouterInfo(target) {
    return (0, core_1.GetMetadata)(GetMetadataToken(), target);
}
exports.GetRouterInfo = GetRouterInfo;
function SetRouterInfo(target, routerInfo) {
    (0, core_1.DefineMetadata)(GetMetadataToken(), routerInfo, target);
}
function GetMetadataToken() {
    return `${METADATA_ROUTER_INFO}`;
}
//# sourceMappingURL=Router.js.map