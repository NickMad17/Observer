import socket from "../../services/socket.js";
import context from "../../store/context.js";
import { initQuill } from "../../services/quill.js";
import { render } from "../../render.js";
import store from "../../store/store.js";
import { saveEditorContents } from "./saveEditorContents.js";
import { conversionTasks } from "./conversionTasks.js";
    
let {currentActive} = store.tasks
const {tasksData} = store.tasks

const switchTabs = (btn, editor) => {
    if (btn.checked) {
        currentActive = btn.value !== "Теория" ? btn.value : "theory";
    }

    editor.container.firstChild.innerHTML =
        tasksData[currentActive]?.content || "";
}

//TODO: переименовать 
export const createTasks = () => {

    const areaElement = document.getElementById("task-area");
    const sendTaskElement = document.getElementById("send-task");
    const worksBtnElements = document.querySelectorAll(".task-editor__work");

    const editor = initQuill(areaElement);

    areaElement?.addEventListener("click", () => {
        if (context.submitTasks) {
            context.submitTasks = false;
            render(context, ["send-tasks"]);
        }
    });

    worksBtnElements?.forEach((btn) => {
        switchTabs(btn, editor)

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
            render(context, ["send-tasks"]);
        });
    });

    sendTaskElement?.addEventListener("click", () => {

        if (editor.getText()?.length > 0) {
            saveEditorContents(editor, tasksData[currentActive])
        }   
        conversionTasks(editor)
        render(context, ["send-tasks"]);
    });
};
