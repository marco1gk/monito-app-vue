<script setup>
import { ref, computed } from "vue";
import { useDevicesStore } from "../stores/devices";

const store = useDevicesStore();

const cpu = ref(null);
const loading = ref(false);
const error = ref("");

const label = computed(() =>
  store.selected ? `${store.selected.id} (${store.selected.ip})` : "No device seleccionado"
);

async function refresh() {
  const dev = store.selected;
  if (!dev) {
    error.value = "Selecciona un dispositivo en la barra lateral";
    return;
  }
  loading.value = true;
  error.value = "";
  cpu.value = null;
  try {
    const r = await fetch(
      `http://192.168.10.228:6969/api/snmp/system/descr?ip=${encodeURIComponent(
        dev.ip
      )}&community=public`
    );
    if (!r.ok) throw new Error("response not ok");
    cpu.value = await r.json();
  } catch (err) {
    error.value = "No se pudo obtener info: " + (err.message || "");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Home</h2>
    <p>Dispositivo: <strong>{{ label }}</strong></p>
    <button @click="refresh" :disabled="loading">
      {{ loading ? "Cargando..." : "Fetch CPU" }}
    </button>

    <div v-if="error" style="color:red; margin-top:8px;">{{ error }}</div>
    <div v-if="cpu" class="cpu-container">
      <div class="fetch-card">
        <div><strong>Target:</strong> {{ cpu.target }}</div>
        <div><strong>OID:</strong> {{ cpu.oid }}</div>
        <div>
          <strong>Value:</strong>
          <span title="{{ cpu.value }}">
            {{ cpu.value.length > 80 ? cpu.value.slice(0, 80) + "..." : cpu.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  margin-top: 8px;
  padding: 6px 12px;
  background: #0369a1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
.fetch-card {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.fetch-card strong {
  color: #2563eb;
}
</style>
