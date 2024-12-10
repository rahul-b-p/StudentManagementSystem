"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
const generateId = () => {
    const timestamp = Date.now().toString(16);
    const randomString = crypto.randomUUID();
    const uniqueId = (randomString + timestamp).slice(-23);
    return uniqueId;
};
exports.generateId = generateId;
