import store from "../../store/store";

export const saveEditorContents = (editor, task) => {
    task.content = editor.container.firstChild.innerHTML;
    task.visit = true;
} 