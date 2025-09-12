<template>
    <div class="sidebar">
      <DeviceList />
  
      <div class="sidebar-footer">
        <button class="btn-add-toggle" @click="$emit('open-form')">
          + Agregar dispositivo
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import DeviceList from "./DeviceList.vue";
  </script>
  
  <style scoped>
  .sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 260px;
    border-right: 1px solid #e5e7eb;
    background: #f8fafc;
  }
  .sidebar-footer {
    padding: 12px;
    border-top: 1px solid #e5e7eb;
    background: #fff;
  }
  .btn-add-toggle {
    width: 100%;
    padding: 8px;
    background: #0369a1;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .btn-add-toggle:hover { filter: brightness(0.95); }
  </style>
  