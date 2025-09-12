<template>
    <div class="layout">
      <Sidebar @open-form="showForm = true" />
      <main class="main">
        <router-view />
      </main>
  
      <DeviceForm v-if="showForm" @added="showForm = false" />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import Sidebar from "../components/Sidebar.vue";
  import DeviceForm from "../components/DeviceForm.vue";
  
  const showForm = ref(false);
  </script>
  
  <style scoped>
  .layout { display: flex; height: 100vh; }
  .main { flex: 1; padding: 18px; overflow: auto; }
  </style>
  