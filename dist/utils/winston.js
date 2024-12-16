"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggers = void 0;
const winston_1 = __importDefault(require("winston"));
exports.loggers = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp }) => {
        // Handle objects, arrays, numbers, etc.
        const formattedMessage = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;
        return `${timestamp} [${level}]: ${formattedMessage}`;
    })),
    transports: [new winston_1.default.transports.Console()],
});
