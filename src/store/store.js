
const serverFromLS = localStorage.getItem("SERVER");
const roomIdFromLS = localStorage.getItem("ROOM_ID");
const hostIdFromLS = localStorage.getItem("HOST_ID");

class Store {
    is_first_loading = true;
    server = serverFromLS ? serverFromLS : "";
    room_id = roomIdFromLS ? +roomIdFromLS : null;
    host_id = hostIdFromLS ? +hostIdFromLS : null;
    host_name = "Host";
    active_user_id = null;
    users = {};
    files = [];
    tasks = {
        tasksData: {
            1: {
                visit: false,
            },
            2: {
                visit: false,
            },
            3: {
                visit: false,
            },
            4: {
                visit: false,
            },
            5: {
                visit: false,
            },
            6: {
                visit: false,
            },
            7: {
                visit: false,
            },
            8: {
                visit: false,
            },
            theory: {
                visit: false,
            },
        },
        currentActive: 1,
    }
}

const store = new Store();

export default store;
