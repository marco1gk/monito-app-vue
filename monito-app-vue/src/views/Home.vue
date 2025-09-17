<script setup>
import StorageCharts from "../components/StorageCharts.vue";
import { ref, computed, watch, onUnmounted } from "vue";
import { useDevicesStore } from "../stores/devices";

const store = useDevicesStore();

const sysInfo = ref(null);
const loadingSys = ref(false);
const errorSys = ref("");
const lastUpdateSys = ref(null);
let intervalSys = null;

const label = computed(() =>
  store.selected ? `${store.selected.id} (${store.selected.ip})` : "No device seleccionado"
);

async function refreshSys() {
  const dev = store.selected;
  if (!dev) return;
  loadingSys.value = true;
  errorSys.value = "";

  try {
    const r = await fetch(
      `http://192.168.1.64:6969/api/snmp/system/descr?ip=${encodeURIComponent(
        dev.ip
      )}&community=public`
    );
    if (!r.ok) throw new Error("response not ok");

    const newData = await r.json();
    if (!newData || !newData.target) throw new Error("Datos inválidos");

    sysInfo.value = newData;
    lastUpdateSys.value = new Date();
  } catch (err) {
    sysInfo.value = null;
    lastUpdateSys.value = null;
    errorSys.value = "No se pudo obtener info: " + (err.message || "");
  } finally {
    loadingSys.value = false;
  }
}

const processes = ref([]);
const loadingProc = ref(false);
const errorProc = ref("");
const lastUpdateProc = ref(null);
let intervalProc = null;

async function refreshProcesses() {
  const dev = store.selected;
  if (!dev) return;
  loadingProc.value = true;
  errorProc.value = "";

  try {
    const r = await fetch(
      `http://192.168.1.64:6969/api/snmp/hrswrun?ip=${encodeURIComponent(
        dev.ip
      )}&community=public`
    );
    if (!r.ok) throw new Error("response not ok");

    const newData = await r.json();
    if (!newData || !newData.data) throw new Error("Datos inválidos");

    processes.value = newData.data;
    lastUpdateProc.value = new Date();
  } catch (err) {
    processes.value = [];
    lastUpdateProc.value = null;
    errorProc.value = "No se pudo obtener procesos: " + (err.message || "");
  } finally {
    loadingProc.value = false;
  }
}
watch(
  () => store.selected,
  (newDevice) => {
    clearInterval(intervalSys);
    clearInterval(intervalProc);

    if (newDevice) {
      refreshSys();
      refreshProcesses();
      intervalSys = setInterval(refreshSys, 3000);
      intervalProc = setInterval(refreshProcesses, 3000);
    } else {
      sysInfo.value = null;
      lastUpdateSys.value = null;
      processes.value = [];
      lastUpdateProc.value = null;
    }
  }
);

onUnmounted(() => {
  clearInterval(intervalSys);
  clearInterval(intervalProc);
});
</script>

<template>
  <div class="monitor-container">
    <div v-if="!store.selected" class="empty-selection">
      Selecciona un dispositivo para ver la información del sistema, procesos y memoria.
    </div>
    <div v-else class="card">
      <h2>
        Información del Sistema
        <span v-if="loadingSys" class="spinner-outer"></span>
      </h2>
      <p><strong>Dispositivo:</strong> {{ label }}</p>
      <div v-if="errorSys" class="error">{{ errorSys }}</div>

      <div v-if="sysInfo" class="sys-info">
        <div><strong>Target:</strong> {{ sysInfo.target }}</div>
        <div><strong>OID:</strong> {{ sysInfo.oid }}</div>
        <div>
          <strong>Value:</strong>
          <span :title="sysInfo.value">
            {{ sysInfo.value.length > 80 ? sysInfo.value.slice(0, 80) + "..." : sysInfo.value }}
          </span>
        </div>
        <div v-if="lastUpdateSys" class="last-update">
          Última actualización: {{ lastUpdateSys.toLocaleTimeString() }}
        </div>
      </div>
    </div>
    <div v-if="store.selected" class="card process-section">
      <h2>
        Procesos SNMP
        <span v-if="loadingProc" class="spinner-outer"></span>
      </h2>
      <div v-if="errorProc" class="error">{{ errorProc }}</div>

      <div v-if="processes.length" class="table-wrapper">
        <table class="process-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Ruta</th>
              <th>Status</th>
              <th>CPU Ticks</th>
              <th>Mem (KB)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in processes" :key="p.index">
              <td>{{ p.index }}</td>
              <td>{{ p.name }}</td>
              <td>{{ p.path || "-" }}</td>
              <td>{{ p.status }}</td>
              <td>{{ p.cpuTicks }}</td>
              <td>{{ p.memKB }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="lastUpdateProc" class="last-update">
          Última actualización: {{ lastUpdateProc.toLocaleTimeString() }}
        </div>
      </div>
    </div>
    <StorageCharts :selectedDevice="store.selected" />
  </div>
</template>

<style scoped>
.monitor-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

.sys-info div {
  margin-bottom: 8px;
}

.process-section {
  padding: 16px;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.process-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.process-table th,
.process-table td {
  padding: 10px;
  text-align: left;
}

.process-table thead {
  background: #2563eb;
  color: white;
  position: sticky;
  top: 0;
}

.process-table tbody tr:nth-child(even) {
  background: #f3f4f6;
}

.process-table tbody tr:hover {
  background: #e0f2fe;
}

.process-table td {
  border-bottom: 1px solid #ddd;
}

.error {
  color: red;
  margin-top: 8px;
}

.spinner-outer {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #2563eb;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: 8px;
  vertical-align: middle;
}

.last-update {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
}

.empty-selection {
  text-align: center;
  margin-top: 50px;
  font-size: 14px;
  color: #6b7280;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
