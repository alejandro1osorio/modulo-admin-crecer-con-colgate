<template>
  <div>
    <h1 class="title">Modulo Administrativo</h1>
    <UserTable />
  </div>
</template>

<script>
import UserTable from './components/UserTable.vue';

export default {
  components: { UserTable },
};
</script>

<style>
.title {
  font-family: 'ColgateReady-BoldItalic';
  text-align: center;
  color: #D71B16;
  font-weight: bold;
}
</style>