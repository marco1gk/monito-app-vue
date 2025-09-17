<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { useDevicesStore } from "../stores/devices";
import ApexChart from "vue3-apexcharts";

const store = useDevicesStore();
const storage = ref([]);
const loadingStorage = ref(false);
const errorStorage = ref("");
const lastUpdateStorage = ref(null);
let intervalStorage = null;

async function refreshStorage() {
  const dev = store.selected;
  if (!dev) return;

  loadingStorage.value = true;
  errorStorage.value = "";

  try {
    const r = await fetch(
      `http://192.168.1.64:6969/api/snmp/hrstorage?ip=${encodeURIComponent(dev.ip)}&community=public`
    );
    if (!r.ok) throw new Error("response not ok");

    const newData = await r.json();
    if (!newData || !newData.data) throw new Error("Datos inválidos");

    storage.value = newData.data;
    lastUpdateStorage.value = new Date();
  } catch (err) {
    storage.value = [];
    lastUpdateStorage.value = null;
    errorStorage.value = "No se pudo obtener almacenamiento: " + (err.message || "");
  } finally {
    loadingStorage.value = false;
  }
}

// RAM y Swap
const ramData = computed(() => storage.value.find(s => s.type === "ram"));
const swapData = computed(() => storage.value.find(s => s.type === "virtualMemory"));

const ramPct = computed(() => ramData.value ? Math.round((ramData.value.usedBytes / ramData.value.totalBytes) * 100) : 0);
const swapPct = computed(() => swapData.value ? Math.round((swapData.value.usedBytes / swapData.value.totalBytes) * 100) : 0);

const ramLabel = computed(() => ramData.value ? `${(ramData.value.usedBytes/(1024*1024*1024)).toFixed(2)} / ${(ramData.value.totalBytes/(1024*1024*1024)).toFixed(2)} GB` : "");
const swapLabel = computed(() => swapData.value ? `${(swapData.value.usedBytes/(1024*1024*1024)).toFixed(2)} / ${(swapData.value.totalBytes/(1024*1024*1024)).toFixed(2)} GB` : "");

const ramOptions = computed(() => ({
  chart: { height: 200, type: "radialBar" },
  plotOptions: {
    radialBar: {
      hollow: { size: "60%" },
      dataLabels: {
        value: { formatter: val => val + "%" },
        name: { show: true, formatter: () => ramLabel.value }
      }
    }
  },
  labels: ["RAM"],
  colors: ["#ef4444"]
}));

const swapOptions = computed(() => ({
  chart: { height: 200, type: "radialBar" },
  plotOptions: {
    radialBar: {
      hollow: { size: "60%" },
      dataLabels: {
        value: { formatter: val => val + "%" },
        name: { show: true, formatter: () => swapLabel.value }
      }
    }
  },
  labels: ["Swap"],
  colors: ["#3b82f6"]
}));

const diskChartData = computed(() => {
  const disks = storage.value.filter(s => s.type === "fixedDisk");
  return {
    series: [
      { name: "Usado (GB)", data: disks.map(d => (d.usedBytes / (1024*1024*1024)).toFixed(2)) },
      { name: "Libre (GB)", data: disks.map(d => (d.freeBytes / (1024*1024*1024)).toFixed(2)) }
    ],
    chartOptions: {
      chart: { type: "bar", height: 300, stacked: true },
      plotOptions: { bar: { horizontal: true } },
      xaxis: { categories: disks.map(d => `Disk ${d.index}`) },
      colors: ["#ef4444", "#22c55e"],
      legend: { position: "top" },
      dataLabels: { enabled: true }
    }
  };
});

watch(
  () => store.selected,
  (newDevice) => {
    clearInterval(intervalStorage);
    if (newDevice) {
      refreshStorage();
      intervalStorage = setInterval(refreshStorage, 5000);
    } else {
      storage.value = [];
      lastUpdateStorage.value = null;
      errorStorage.value = "";
    }
  },
  { immediate: true }
);

onUnmounted(() => clearInterval(intervalStorage));
</script>

<template>
  <div class="storage-monitor">
    <div v-if="!store.selected" class="placeholder">
      Sitio web monitor
    </div>
    <div v-else>
      <h2>
        Memoria y Swap
        <span v-if="loadingStorage" class="spinner-outer"></span>
      </h2>

      <div v-if="errorStorage" class="error">{{ errorStorage }}</div>

      <div class="charts-container" v-if="storage.length">
        <div class="chart-card" v-if="ramData">
          <h3>RAM</h3>
          <ApexChart type="radialBar" :options="ramOptions" :series="[ramPct]" />
        </div>

        <div class="chart-card" v-if="swapData">
          <h3>Swap</h3>
          <ApexChart type="radialBar" :options="swapOptions" :series="[swapPct]" />
        </div>

        <div class="chart-card" v-if="diskChartData.series[0].data.length">
          <h3>Discos</h3>
          <ApexChart type="bar" :options="diskChartData.chartOptions" :series="diskChartData.series" />
        </div>
      </div>

      <div v-else class="placeholder">
        No hay datos de almacenamiento disponibles
      </div>

      <div v-if="lastUpdateStorage" class="last-update">
        Última actualización: {{ lastUpdateStorage.toLocaleTimeString() }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.storage-monitor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.chart-card {
  background: #f3f4f6;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  flex: 1 1 300px;
  min-width: 280px;
}

.placeholder {
  padding: 16px;
  background: #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  text-align: center;
}

.last-update {
  margin-top: 8px;
  font-size: 12px;
  color: #555;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
