"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetQueueEventKey = exports.QueueEventKey = exports.QUEUE_EVENT_HANDLER_METADATA = exports.GetQueueInjectToken = exports.QUEUE_INJECT_TOKEN = exports.QueueSubType = void 0;
const EventHandler_1 = require("../../core/src/event/EventHandler");
const Dependency_1 = require("../../core/src/di/Dependency");
const Metadata_1 = require("../../core/src/metadata/Metadata");
var QueueSubType;
(function (QueueSubType) {
    QueueSubType[QueueSubType["Publisher"] = 0] = "Publisher";
    QueueSubType[QueueSubType["Subscriber"] = 1] = "Subscriber";
})(QueueSubType = exports.QueueSubType || (exports.QueueSubType = {}));
exports.QUEUE_INJECT_TOKEN = (0, Dependency_1.GetInjectToken)('Sys:Queue');
function GetQueueInjectToken(key, subType) {
    let subTypeKey = 'Publisher';
    if (subType === QueueSubType.Subscriber)
        subTypeKey = 'Subscriber';
    return (0, Dependency_1.GetInjectToken)(`${exports.QUEUE_INJECT_TOKEN}:${key}:${subTypeKey}`);
}
exports.GetQueueInjectToken = GetQueueInjectToken;
exports.QUEUE_EVENT_HANDLER_METADATA = `${EventHandler_1.EVENT_HANDLER_METADATA}:Queue`;
function QueueEventKey(topic, eventKey) {
    if (!eventKey)
        eventKey = topic;
    const eventFunc = (0, EventHandler_1.EventKey)(eventKey);
    return (target) => {
        eventFunc(target);
        (0, Metadata_1.DefineMetadata)(exports.QUEUE_EVENT_HANDLER_METADATA, {
            topic,
            eventKey: eventKey ?? topic,
        }, target);
    };
}
exports.QueueEventKey = QueueEventKey;
function GetQueueEventKey(target) {
    return (0, Metadata_1.GetMetadata)(exports.QUEUE_EVENT_HANDLER_METADATA, target);
}
exports.GetQueueEventKey = GetQueueEventKey;
//# sourceMappingURL=Queue.js.map