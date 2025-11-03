<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useDevicesStore } from "../stores/devices";

const store = useDevicesStore();

const snmpUsers = ref(null);
const loadingUsers = ref(false);
const errorUsers = ref("");
const lastUpdateUsers = ref(null);
let intervalUsers = null;

async function refreshUsers() {
  const dev = store.selected;
  if (!dev) return; 
  loadingUsers.value = true;
  errorUsers.value = "";

  try {
    const r = await fetch(
      `http://192.168.10.44:6969/api/snmp/users?ip=${encodeURIComponent(dev.ip)}&community=seguro`
    );
    if (!r.ok) throw new Error("response not ok");

    const data = await r.json();
    if (!data || !data.target) throw new Error("Datos inválidos");

    snmpUsers.value = data;
    lastUpdateUsers.value = new Date();
  } catch (err) {
    snmpUsers.value = null;
    lastUpdateUsers.value = null;
    errorUsers.value = "No se pudo obtener info de usuarios: " + (err.message || "");
  } finally {
    loadingUsers.value = false;
  }
}

watch(
  () => store.selected,
  (newDevice) => {
    clearInterval(intervalUsers);
    if (newDevice) {
      refreshUsers();
      intervalUsers = setInterval(refreshUsers, 3000);
    } else {
      snmpUsers.value = null;
      lastUpdateUsers.value = null;
    }
  },
  { immediate: true } 
);

onUnmounted(() => {
  clearInterval(intervalUsers);
});
</script>

<template>
  <div v-if="store.selected" class="card">
    <h2>
      Usuarios y Procesos
      <span v-if="loadingUsers" class="spinner-outer"></span>
    </h2>
    <div v-if="errorUsers" class="error">{{ errorUsers }}</div>
    <div v-if="snmpUsers">
      <div><strong>Usuarios conectados:</strong> {{ snmpUsers.numUsers }}</div>
      <div><strong>Procesos totales:</strong> {{ snmpUsers.numProcesses }}</div>
      <div v-if="lastUpdateUsers" class="last-update">
        Última actualización: {{ lastUpdateUsers.toLocaleTimeString() }}
      </div>
    </div>
  </div>
</template>
