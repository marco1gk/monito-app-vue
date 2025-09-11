<script setup>
import DevicePicker from "@/components/DevicePicker.vue";
import { computed, ref } from "vue";
import { useDevicesStore } from "@/stores/devices";
const store = useDevicesStore();
const cpu = ref([]);

async function refresh() {
  const dev = store.selected;
  if (!dev) return;
  const r = await fetch(`/api/monito/cpu?ip=${encodeURIComponent(dev.ip)}`);
  cpu.value = await r.json();
}
const label = computed(() => store.selected ? store.selected.id : "No device");
</script>

<template>
  <DevicePicker />
  <div class="mt-4">
    <button @click="refresh">Fetch CPU</button>
    <p>Device: {{ label }}</p>
    <pre>{{ cpu }}</pre>
  </div>
</template>
