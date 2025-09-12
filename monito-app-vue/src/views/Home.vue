<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { useDevicesStore } from "../stores/devices";

const store = useDevicesStore();

const cpu = ref(null);
const loading = ref(false);
const error = ref("");
const lastUpdate = ref(null); 
let intervalId = null;

const label = computed(() =>
  store.selected ? `${store.selected.id} (${store.selected.ip})` : "No device seleccionado"
);

async function refresh() {
  const dev = store.selected;
  if (!dev) return;

  loading.value = true;
  error.value = "";

  try {
    const r = await fetch(
      `http://192.168.10.228:6969/api/snmp/system/descr?ip=${encodeURIComponent(
        dev.ip
      )}&community=public`
    );

    if (!r.ok) throw new Error("response not ok");

    const newData = await r.json();

    if (!newData || !newData.target) {
      throw new Error("Datos inválidos");
    }

    cpu.value = newData; 
    lastUpdate.value = new Date(); 

  } catch (err) {
    cpu.value = null;
    lastUpdate.value = null;
    error.value = "No se pudo obtener info: " + (err.message || "");
  } finally {
    loading.value = false;
  }
}


watch(
  () => store.selected,
  (newDevice) => {
    clearInterval(intervalId);
    if (newDevice) {
      refresh();
      intervalId = setInterval(refresh, 1000);
    } else {
      cpu.value = null;
      lastUpdate.value = null;
    }
  }
);

onUnmounted(() => clearInterval(intervalId));
</script>

<template>
  <div>
    <h2> 
        home
      <span v-if="loading" class="spinner-outer"></span>
    </h2>

    <p>Dispositivo: <strong>{{ label }}</strong></p>
    <div v-if="error" style="color:red; margin-top:8px;">{{ error }}</div>

    <div v-if="!store.selected" style="margin-top: 12px; color: #555;">
      Selecciona un dispositivo para ver información
    </div>

    <div class="cpu-container" v-if="cpu">
      <div class="fetch-card">
        <div><strong>Target:</strong> {{ cpu.target }}</div>
        <div><strong>OID:</strong> {{ cpu.oid }}</div>
        <div>
          <strong>Value:</strong>
          <span :title="cpu.value">
            {{ cpu.value.length > 80 ? cpu.value.slice(0, 80) + "..." : cpu.value }}
          </span>
        </div>
        <div v-if="lastUpdate" class="last-update">
          Última actualización: {{ lastUpdate.toLocaleTimeString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fetch-card {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-height: 100px;
}

.spinner-outer {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #2563eb;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-left: 8px;
  vertical-align: middle;
}

.last-update {
  margin-top: 8px;
  font-size: 11px;
  color: #555;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
