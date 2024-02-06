import socket from "../../services/socket";
import context from "../../store/context";
import store from "../../store/store";

let {currentActive} = store.tasks
const {tasksData} = store.tasks

export const conversionTasks = (editor) => {
    const validData = [];

    for (let task in tasksData) {
        if (
            tasksData[task].visit &&
            tasksData[task]?.content !== "<p><br></p>"
        ) {
            validData.push({
                name: `${task === "theory" ? "theory" : task}`,
                content: `${
                    tasksData[task].content ? tasksData[task].content : ""
                }`,
                type: `${task === "theory" ? "theory" : "exercise"}`,
                language: "html",
            });
        }
    }

    if (validData?.length > 0) {
        console.log("Отправлен сигнал steps/all. Данные:\n", validData);

        context.submitTasks = true;

        socket.emit("steps/all", validData);
    }
}