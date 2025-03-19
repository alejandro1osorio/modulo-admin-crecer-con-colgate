<template>
  <div class="container-button">
    <button class="btn-download" @click="downloadExcel">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="20px" height="20px" class="icon-excel">
        <path d="M2 3v18h20V3H2zm18 16H4V5h16v14zM7.5 7.5h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-8h5v2h-5v-2zm0 4h5v2h-5v-2zm0 4h5v2h-5v-2z"></path>
      </svg>
      DESCARGAR INFORME GENERAL
    </button>
  </div>
</template>

<script>
import Swal from "sweetalert2"; 

export default {
  methods: {
    async downloadExcel() {
      try {
        Swal.fire({
          title: 'Generando archivo...',
          text: 'Por favor espera mientras preparamos la descarga.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await fetch('http://localhost:8084/api/users/download');
        if (!response.ok) {
          throw new Error('Error al descargar el archivo');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'informe_general.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Descarga completada',
          text: 'El archivo se descargó correctamente.',
        });
      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al descargar el archivo.',
        });
        console.error('Error descargando el archivo:', error);
      }
    },
  },
};
</script>

<style scoped>
.container-button {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: flex-end; /* Alinea el botón a la derecha */
}

.btn-download {
  display: flex;
  align-items: center;
  gap: 8px; /* Espacio entre el ícono y el texto */
  background-color: #2E7D32;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-download:hover {
  background-color: #1B5E20;
  transform: translateY(-2px);
}

.btn-download:active {
  transform: scale(0.95);
}

.icon-excel {
  fill: white; /* Color del SVG */
  transition: transform 0.3s ease;
}

.btn-download:hover .icon-excel {
  transform: scale(1.2); /* Efecto de agrandamiento del ícono */
}
</style>
