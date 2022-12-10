import { defineStore} from "pinia";

export const UserStore = defineStore("admin", {
    state: () => {
        return {
            token: "",
        };
    },

    actions: {},
    getters: {},
});