<template>
  <div class="confirmation-modal">
    <div class="modal-content">
      <p>¿Estás seguro de que deseas eliminar este usuario?</p>
      <button @click="confirm">Confirmar</button>
      <button @click="cancel">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    confirm() {
      this.$emit('confirmed');
    },
    cancel() {
      this.$emit('canceled');
    }
  }
};
</script>
<style scoped>
/* Estilos para tu modal de confirmación */
.confirmation-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Arial', sans-serif; /* Fuente Arial */
  border: 1px solid #ccc;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.212);

}

.modal-content {
  text-align: center;
}

.button-container {
  margin-top: 20px;
}

.confirm-button,
.cancel-button {
  padding: 10px;
  margin: 0 10px;
  cursor: pointer;
}

.confirm-button {
  background-color: #28a745;
  color: #fff;
  border: none;
}

.cancel-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
}
</style>