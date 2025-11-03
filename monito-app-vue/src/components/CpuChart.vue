<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const { selectedDevice } = defineProps({
  selectedDevice: Object,
});

const cpuData = ref([]);
const average = ref(0);
let intervalCpu = null;

async function fetchCpu() {
  if (!selectedDevice) return;
  try {
    const res = await fetch(
      `http://192.168.10.44:6969/api/snmp/cpu?ip=${encodeURIComponent(
        selectedDevice.ip
      )}&community=seguro`
    );
    if (!res.ok) throw new Error("No response");
    const json = await res.json();
    cpuData.value = json.data.map((d) => d.loadPct);
    average.value = json.average ?? 0;
  } catch (err) {
    console.error("Error al obtener CPU:", err);
    cpuData.value = [];
    average.value = 0;
  }
}

const chartData = computed(() => ({
  labels: cpuData.value.map((_, i) => `CPU ${i}`),
  datasets: [
    {
      label: "Carga CPU (%)",
      data: cpuData.value,
      backgroundColor: "#f87171",
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: { legend: { position: "bottom" } },
  scales: {
    y: {
      beginAtZero: true,
      max: 100, 
      ticks: {
        stepSize: 20, 
        callback: function(value) {
          return value + "%"; 
        }
      },
      title: {
        display: true,
        text: "Uso de CPU (%)"
      }
    },
    x: {
      title: {
        display: true,
        text: "Núcleos / CPUs"
      }
    }
  }
};


watch(
  () => selectedDevice,
  (newDev) => {
    clearInterval(intervalCpu);
    if (newDev) {
      fetchCpu();
      intervalCpu = setInterval(fetchCpu, 2000);
    } else {
      cpuData.value = [];
      average.value = 0;
    }
  },
  { immediate: true }
);

onUnmounted(() => clearInterval(intervalCpu));
</script>

<template>
  <div class="cpu-chart-card" v-if="selectedDevice">
    <h2>CPU en tiempo real</h2>
    <div>Promedio: {{ average.toFixed(2) }}%</div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.cpu-chart-card {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}
</style>
