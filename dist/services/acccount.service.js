"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = void 0;
const winston_util_1 = require("../utils/winston.util");
const deleteUserAccount = () => {
    try {
        const users = yield findUsers();
        const userDeleteIndex = users.findIndex(item => item.id == id);
        if (userDeleteIndex !== -1) {
            users.splice(userDeleteIndex, 1);
            const todos = yield findTodos();
            const updatedTodos = todos.filter(item => item.userId !== id);
            const data = yield readData();
            data.todos = updatedTodos;
            data.users = users;
            yield writeData(data);
            true;
        }
        return false;
    }
    catch (error) {
        winston_util_1.loggers.error(error);
        throw new Error("Can't Delete Account due to an error");
    }
};
exports.deleteUserAccount = deleteUserAccount;
