<script setup lang="ts">
import NavBar from 'components/NavBar.vue';
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <NavBar />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
