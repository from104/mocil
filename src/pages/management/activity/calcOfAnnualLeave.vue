<script setup  lang="ts">
import { C } from 'app/dist/spa/assets/index.c323b3ef';
import{ ref} from 'vue'

const name = ref('');
const dateOfEmployment = ref('');
const monthExcludes = ref(0);
</script>

<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-input
          v-model="name"
          label="Name"
          filled
          clearable
          :rules="[val => val.length > 0 || 'Name is required']"
        />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="dateOfEmployment"
          label="Date of employment"
          type="date"
          filled
          clearable
          :rules="[val => val.length > 0 || 'Date of employment is required']"
        />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="monthExcludes"
          label="Month excludes"
          type="number"
          filled
          clearable
          :rules="[val => val >= 0 && val > 1000 || 'Month excludes is required']"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
