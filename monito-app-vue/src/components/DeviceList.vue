<template>
    <div class="device-list">
      <h3 class="title">Dispositivos usados</h3>
  
      <ul>
        <li
          v-for="d in store.devices"
          :key="d.id"
          :class="['device-item', { selected: store.selectedId === d.id }]"
          @click="store.select(d.id)"
        >
          <div class="device-info">
            <div class="device-name">{{ d.id }}</div>
            <div class="device-ip">{{ d.ip }}</div>
          </div>
          <button class="btn-remove" @click.stop="store.removeDevice(d.id)">✕</button>
        </li>
      </ul>
  
      <div v-if="store.devices.length === 0" class="empty">No hay dispositivos todavía</div>
    </div>
  </template>
  
  <script setup>
  import { useDevicesStore } from "../stores/devices";
  const store = useDevicesStore();
  </script>
  
  <style scoped>
  .device-list {
    padding: 12px;
    flex: 1;
    overflow-y: auto;
    max-height: 60vh;
  
    scrollbar-width: thin;
    scrollbar-color: #60a5fa #e5e7eb;
  }
  
  .device-list::-webkit-scrollbar {
    width: 10px;
  }
  .device-list::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 6px;
  }
  .device-list::-webkit-scrollbar-thumb {
    background-color: #60a5fa;
    border-radius: 6px;
    border: 2px solid #e5e7eb;
    transition: background-color 0.3s ease;
  }
  .device-list::-webkit-scrollbar-thumb:hover {
    background-color: #2563eb;
  }
  
  .title { margin-bottom: 8px; font-weight: 700; font-size: 14px; }
  ul { list-style: none; padding: 0; margin: 0; }
  .device-item {
    display: flex; justify-content: space-between; align-items: center;
    background: #f3f4f6; padding: 8px; border-radius: 6px; margin-bottom: 8px;
    cursor: pointer;
  }
  .device-item.selected { background: #dbeafe; }
  .device-info { display: flex; flex-direction: column; }
  .device-name { font-weight: 600; font-size: 13px; }
  .device-ip { font-size: 12px; color: #374151; }
  .btn-remove { border: none; background: transparent; color: #ef4444; cursor: pointer; }
  .empty { color: #6b7280; font-size: 13px; margin-top: 12px; }
  </style>
  