<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>Mis Dispositivos</h2>
      <p>Selecciona o agrega uno nuevo</p>
    </div>

    <div class="device-list-wrapper">
      <div
        v-for="d in store.devices"
        :key="d.id"
        :class="['device-card', { selected: store.selectedId === d.id }]"
        @click="store.select(d.id)"
      >
        <div class="device-info">
          <span class="device-name">{{ d.id }}</span>
          <span class="device-ip">{{ d.ip }}</span>
        </div>
        <button class="btn-remove" @click.stop="store.removeDevice(d.id)">✕</button>
        </div>
      <div v-if="store.devices.length === 0" class="empty">No hay dispositivos todavía</div>
    </div>

    <div class="sidebar-footer">
      <button class="btn-add-toggle" @click="$emit('open-form')">
        + Agregar dispositivo
      </button>
    </div>
  </div>
</template>

<script setup>
import { useDevicesStore } from "../stores/devices";
const store = useDevicesStore();
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 280px;
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
  box-shadow: inset -2px 0 6px rgba(0,0,0,0.03);
}

.sidebar-header {
  padding: 16px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}
.sidebar-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}
.sidebar-header p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.device-list-wrapper {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  max-height: calc(100% - 120px);
}

.device-list-wrapper::-webkit-scrollbar {
  width: 6px;
}
.device-list-wrapper::-webkit-scrollbar-thumb {
  background-color: #60a5fa;
  border-radius: 3px;
}
.device-list-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.device-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.device-card.selected {
  background: #dbeafe;
  border-left: 4px solid #2563eb;
}

.device-info {
  display: flex;
  flex-direction: column;
}
.device-name {
  font-weight: 600;
  font-size: 14px;
}
.device-ip {
  font-size: 12px;
  color: #4b5563;
}

.btn-remove {
  border: none;
  background: transparent;
  color: #ef4444;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.empty {
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  margin-top: 16px;
}

.sidebar-footer {
  padding: 14px 12px;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
}

.btn-add-toggle {
  width: 100%;
  padding: 10px;
  background: #0ea5e9;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.btn-add-toggle:hover {
  background: #0284c7;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
</style>
