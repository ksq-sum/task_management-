import { defineStore } from "pinia";
import { MesState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";
import projectData from "@/assets/json/project.json"; // 导入 JSON 数据

export const proMesStore = defineStore({
  id: "proMes",
  state: (): MesState => ({
    token: "",
    projectData: projectData // 将 JSON 数据存储在 State 中
  }),
  getters: {
    getProTypes: state => state.projectData.pro_type,
    getProLevels: state => state.projectData.pro_level,
    getPartyAsComp: state => state.projectData.party_asComp
  },
  actions: {},
  persist: piniaPersistConfig("proMes")
});
