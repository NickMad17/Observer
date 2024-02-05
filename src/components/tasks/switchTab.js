import context from "../../store/context";
import store from "../../store/store";


export const switchTab = (currentActive,nameTabs) => {
    currentActive = nameTabs !== "Теория" ? nameTabs : "theory";
}