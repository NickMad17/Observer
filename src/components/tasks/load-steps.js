import socket from "../../services/socket.js";
import context from "../../store/context.js";
import { allTasks } from "../../utils/all-tasks.js";
import { render } from "../../render.js";
import store from "../../store/store.js";

export const loadSteps = () => {
    const {tasksData} = store.tasks
    socket.on("steps/load", (data) => {
        console.log("Получен сигнал steps/load. Данные:");
        console.log(data);

        const tasksLenght = context.taskCountMode ? 8 : 4;

        // Переписать на использование стора 
        data.map((task) => {
            task.visit = false;
        });

        data.forEach((task) => {
            if (task.name === "theory" || +task.name <= tasksLenght) {
                tasksData[task.name] = task;
            }
        });

        context.taskContent = {
            visit: true,
            content: tasksData[context.taskNumber].content,
        };

        render(context, ["send-tasks"]);
    });
};
