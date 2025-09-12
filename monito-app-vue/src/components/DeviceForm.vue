<template>
    <div class="modal-backdrop" @click.self="$emit('added')">
      <div class="modal">
        <h3>Agregar dispositivo</h3>
        <input v-model="id" placeholder="Nombre" class="input" />
        <input v-model="ip" placeholder="IP o host" class="input" />
  
        <div class="form-actions">
          <button class="btn-add" @click="add">Guardar</button>
          <button class="btn-cancel" @click="$emit('added')">Cancelar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useDevicesStore } from "../stores/devices";
  const store = useDevicesStore();
  
  const id = ref("");
  const ip = ref("");
  
  const emit = defineEmits(["added"]);
  
  function add() {
    if (!id.value || !ip.value) return;
    store.addDevice({ id: id.value, ip: ip.value });
    store.select(id.value);
    id.value = "";
    ip.value = "";
    emit("added");
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  
  .modal {
    background: white;
    padding: 24px;
    border-radius: 12px;
    width: 320px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  
    text-align: center;      
  }
  
  .modal h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  .input {
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    width: 100%;             
    box-sizing: border-box;
  }
  
  .form-actions {
    display: flex;
    justify-content: center; 
    gap: 12px;
  }
  
  .btn-add { 
    background: #16a34a; 
    color: white; 
    padding: 8px 16px; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
  }
  .btn-cancel { 
    background: #ef4444; 
    color: white; 
    padding: 8px 16px; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
  }
  
  .btn-add:hover { background: #15803d; }
  .btn-cancel:hover { background: #dc2626; }
  </style>
  
  