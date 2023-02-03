<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/firebase'
import { useQuasar } from 'quasar';
import { useLoginStore  } from 'src/stores/mocil-store';

const $q = useQuasar();

const loginStore = useLoginStore();

onAuthStateChanged(auth, (user) => {
  $q.loading.show();
  loginStore.loggedInUser = user;
  setTimeout(() => {
    $q.loading.hide();
  }, 1000);
});
</script>

<template>
  <router-view />
</template>

