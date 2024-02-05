import socket from "../../services/socket.js";
import context from "../../store/context.js";
import { initQuill } from "../../services/quill.js";
import { render } from "../../render.js";
import { switchTab } from "./switchTab.js";
import store from "../../store/store.js";
import { saveEditorContents } from "./saveEditorContents.js";
    

//TODO: переименовать 
export const handleSendTasks = () => {
    const {tasksData} = store.tasks
    let {currentActive} = store.tasks
    

    const areaElement = document.getElementById("task-area");
    const sendTaskElement = document.getElementById("send-task");
    const worksBtnElements = document.querySelectorAll(".task-editor__work");

    const editor = initQuill(areaElement);

    areaElement?.addEventListener("click", () => {
        if (context.isSent) {
            context.isSent = false;
            render(context, ["send-tasks"]);
        }
    });

    worksBtnElements?.forEach((btn) => {
        // TODO: switchTabs()
        if (btn.checked) {
            currentActive = btn.value !== "Теория" ? btn.value : "theory";
        }
        //

        editor.container.firstChild.innerHTML =
            tasksData[currentActive]?.content || "";

        btn?.addEventListener("click", () => {
            // защита от лмшних рендеров
            if (btn.value === currentActive){
                return;
            }
            // TODO: привести к единой системе
            context.taskNumber = btn.value !== "Теория" ? btn.value : "theory";
            tasksData[currentActive].visit = false;
            if (!tasksData[currentActive].visit && editor.getContents()) {
                saveEditorContents(editor, tasksData[currentActive])
            }
            console.log(store);
            render(context, ["send-tasks"]);
        });
    });

    sendTaskElement?.addEventListener("click", () => {
        const validData = [];
        // Убрать flag
        let flag; 

        for (let task in tasksData) {
            tasksData[task].visit === true ? (flag = true) : "";
        }

        // TODO: Вынести в отдельную ф-ию
        if (flag) {
            if (editor.getText()?.length > 0) {
                tasksData[currentActive].content =
                    editor.container.firstChild.innerHTML;
                tasksData[currentActive].visit = true;
            }

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

                // TODO: Переименовать isSent
                context.isSent = true;

                socket.emit("steps/all", validData);
            }

            render(context, ["send-tasks"]);
            // вместо этого просто вызываем функцию сохранения в стор
        } else if (editor.getText()?.length > 0) {
            const task = [
                {
                    name: `${currentActive === "theory" ? "theory" : currentActive}`,
                    content: editor.container.firstChild.innerHTML,
                    type: `${currentActive === "theory" ? "theory" : "exercise"}`,
                    language: "html",
                },
            ];

            context.isSent = true;

            console.log("Отправлен сигнал steps/all. Данные:\n", task);
            socket.emit("steps/all", task);

            render(context, ["send-tasks"]);
        }
    });
};
