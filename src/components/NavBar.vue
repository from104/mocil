<script setup lang="ts">
import { ref } from 'vue';

import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';

import { useLoginStore  } from 'src/stores/mocil-store';

const loginStore = useLoginStore();

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
];
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title> 자립생활센터 관리 솔루션 </q-toolbar-title>

      <q-btn label="Logout" color="secondary" @click="loginStore.signOut()" v-if="loginStore.isLoggedIn && loginStore.isEmailVerified"/>
    </q-toolbar>
  </q-header>
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item-label header> Essential Links </q-item-label>

      <EssentialLink
        v-for="link in essentialLinks"
        :key="link.title"
        v-bind="link"
      />
    </q-list>
  </q-drawer>
</template>
