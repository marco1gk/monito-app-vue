<script setup>
import { ref } from "vue";
import { useDevicesStore } from "@/stores/devices";
const store = useDevicesStore();
const id = ref("lab-linux"); const ip = ref("192.168.1.10");
function add(){ store.addDevice({ id: id.value, ip: ip.value }); id.value=""; ip.value=""; }
</script>

<template>
  <div class="flex gap-2">
    <select v-model="store.selectedId">
      <option v-for="d in store.devices" :key="d.id" :value="d.id">{{ d.id }} ({{ d.ip }})</option>
    </select>
    <button v-if="store.selectedId" @click="store.removeDevice(store.selectedId)">Remove</button>
    <input v-model="id" placeholder="id"/>
    <input v-model="ip" placeholder="ip or host"/>
    <button @click="add">Add</button>
  </div>
</template>

