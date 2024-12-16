import { loggers } from "../utils/winston.util";
import { readData, writeData } from "./file.service";
import { findStudents} from "./student.service"
import { findUsers } from "./user.service";




export const deleteUserAccount = async(id:string) => {
    try {
        const users = await findUsers();
        const userDeleteIndex = users.findIndex(item => item.id == id);
        if (userDeleteIndex !== -1) {
            users.splice(userDeleteIndex, 1);
            const students = await findStudents();
            const updatedTodos = students.filter(item => item.userId !== id);
            const data = await readData();
            data.students = updatedTodos;
            data.users = users;
            await writeData(data);

            return true;
        }
        return false;
    } catch (error) {
        loggers.error(error);
        throw new Error("Can't Delete Account due to an error");
    }
}

