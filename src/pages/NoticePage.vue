<script setup lang="ts">
import { useLoginStore } from 'src/stores/mocil-store';

const loginStore = useLoginStore();
</script>

<template>
  <q-page class="row items-center justify-center" padding>
    <!-- //대충 아무 내용 -->
    <q-card>
      <!-- <q-card-section>
        <div class="text-h6">공지사항</div>
      </q-card-section> -->
      <q-card-section>
        <div class="text-h6">사용자 정보</div>
      </q-card-section>
      <q-card-section>
        <q-list bordered>
          <q-item>
            <q-item-section> uid: {{ loginStore.uid }} </q-item-section>
          </q-item>
          <q-item>
            <q-item-section> email: {{ loginStore.email }} </q-item-section>
          </q-item>
          <q-item>
            <q-item-section> name: {{ loginStore.userName }} </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              role: {{ loginStore.role }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>
