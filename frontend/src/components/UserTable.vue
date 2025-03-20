<template>
    <DownloadButton />
    <div class="table-container">
      <!-- Buscador y Filtros -->
      <div class="filters">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar por correo"
          @input="applyFilters"
          class="search-input"
        />
        <button class="btn" @click="applyFilters">Buscar</button>
        <select v-model="selectedDistribuidor" @change="applyFilters" class="select-input">
          <option value="">Todos los Distribuidores</option>
          <option v-for="dist in uniqueDistribuidores" :key="dist" :value="dist">
            {{ dist }}
          </option>
        </select>
        <select v-model="selectedRegion" @change="applyFilters" class="select-input">
          <option value="">Todas las Regiones</option>
          <option v-for="region in uniqueRegiones" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
        <select v-model="selectedZona" @change="applyFilters" class="select-input">
          <option value="">Todas las Zonas</option>
          <option v-for="zona in uniqueZonas" :key="zona" :value="zona">
            {{ zona }}
          </option>
        </select>
        <select
          v-model="selectedPuntoVenta"
          @change="applyFilters"
          class="select-input"
        >
          <option value="">Todos los Puntos de Venta</option>
          <option v-for="punto in uniquePuntosVenta" :key="punto" :value="punto">
            {{ punto }}
          </option>
        </select>
      </div>
  
      <!-- Tabla -->
      <table class="styled-table">
        <thead>
          <tr>
            <th style="width: 200px;">Correo</th>
            <th>Distribuidor</th>
            <th>Región</th>
            <th>Zonas</th>
            <th>Puntos de Venta</th>
            <th>Celular</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedData" :key="user.correo">
            <td>{{ user.correo }}</td>
            <td>{{ user.distribuidor }}</td>
            <td>{{ user.region }}</td>
            <td>{{ user.zona }}</td>
            <td>{{ user.punto_venta }}</td>
            <td>{{ user.celular }}</td>
            <td>{{ formatDate(user.fecha_registro) }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Paginación -->
      <div class="pagination">
        <button
          class="btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button
          class="btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import DownloadButton from './DownloadButton.vue';
  
  export default {
    components: {
      DownloadButton,
    },
    data() {
      return {
        users: [],
        filteredUsers: [],
        currentPage: 1,
        itemsPerPage: 15,
        searchTerm: "",
        selectedDistribuidor: "",
        selectedRegion: "",
        selectedZona: "",
        selectedPuntoVenta: "",
      };
    },
    computed: {
      uniqueDistribuidores() {
        return [...new Set(this.users.map((user) => user.distribuidor))];
      },
      uniqueRegiones() {
        return [...new Set(this.users.map((user) => user.region))];
      },
      uniqueZonas() {
        return [...new Set(this.users.map((user) => user.zona))];
      },
      uniquePuntosVenta() {
        return [...new Set(this.users.map((user) => user.punto_venta))];
      },
      totalPages() {
        return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
      },
      paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredUsers.slice(start, end);
      },
    },
    methods: {
      async fetchUsers() {
        try { 
          const response = await axios.get("https://administracion.crececoncolgate.col1.co/api/users"); /* https://pruebas2.kagencia.com/api/users - http://localhost:5000 */
          this.users = response.data;
          this.filteredUsers = this.users;
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },
      applyFilters() {
        this.filteredUsers = this.users.filter((user) => {
          const matchesSearch =
            user.correo.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesDistribuidor =
            !this.selectedDistribuidor ||
            user.distribuidor === this.selectedDistribuidor;
          const matchesRegion =
            !this.selectedRegion || user.region === this.selectedRegion;
          const matchesZona =
            !this.selectedZona || user.zona === this.selectedZona;
          const matchesPuntoVenta =
            !this.selectedPuntoVenta || user.punto_venta === this.selectedPuntoVenta;
  
          return (
            matchesSearch &&
            matchesDistribuidor &&
            matchesRegion &&
            matchesZona &&
            matchesPuntoVenta
          );
        });
        this.currentPage = 1; // Reinicia a la primera página después de aplicar filtros
      },
      changePage(page) {
        if (page > 0 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
      formatDate(dateString) {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return new Date(dateString).toLocaleDateString("es-ES", options);
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
  
  <style scoped>
/* Contenedor principal */
.table-container {
  margin: 20px auto;
  padding: 10px;
  max-width: 90%;
  overflow-x: auto;
  font-family: Arial, sans-serif;
}

/* Estilo de los filtros */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.search-input {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 200px;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #D71B16;
  outline: none;
}

.select-input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-width: 150px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.select-input:focus {
  border-color: #D71B16;
  outline: none;
}

.btn {
  padding: 8px 15px;
  background-color: #D71B16;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #D71B16;
}

.btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Estilo de la tabla */
.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.styled-table thead tr {
  background-color: #D71B16;
  color: #ffffff;
  text-align: left;
  font-weight: bold;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #D71B16;
}

.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}

.styled-table th {
  text-transform: uppercase;
}

/* Paginación */
.pagination {
  margin: 10px 0;
  text-align: center;
}

.pagination span {
  margin: 0 10px;
  font-size: 16px;
  color: #333;
}
</style>