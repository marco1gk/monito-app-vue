import { defineStore } from "pinia";
const KEY = "snmp_devices_v1";
const load = () => JSON.parse(localStorage.getItem(KEY) || "[]");
const save = (devices) => localStorage.setItem(KEY, JSON.stringify(devices));

export const useDevicesStore = defineStore("devices", {
  state: () => ({ devices: load(), selectedId: "" }),
  getters: {
    selected(state) {
      return state.devices.find((d) => d.id === state.selectedId) || null;
    },
  },
  actions: {
    addDevice(device) {
      this.devices.push(device);
      save(this.devices);
      if (!this.selectedId) this.selectedId = device.id;
    },
    removeDevice(id) {
      this.devices = this.devices.filter((d) => d.id !== id);
      save(this.devices);
      if (this.selectedId === id) this.selectedId = this.devices[0]?.id || "";
    },
    select(id) {
      this.selectedId = id;
    },
  },
});
