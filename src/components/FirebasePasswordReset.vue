<script setup LANG="ts">
import { ref } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from 'src/firebase';

const email = ref('');
const emailRef = ref(null);
const emailRules = [
  (val) => !!val || '이메일 주소를 넣으세요.',
  (val) => /.+@.+\..+/.test(val) || '이메일 주소가 아닙니다.',
];

const onSubmit = async () => {
  if (emailRef.value.hasError) {
    return;
  }
  await sendPasswordResetEmail(auth, email.value)
    .then(() => {
      // Signed in
      alert('암호 재설정 메일을 보냈습니다.');
      location.href = '/login';
    })
    .catch((error) => {
      // console.log(error.code);
      // 에러 메세지 한글로 매칭
      switch (error.code) {
        case 'auth/user-not-found':
          alert('존재하지 않는 사용자입니다.');
          break;
        default:
          alert(
            `암호 재설정 메일를 보내는데 실패했습니다. Error: ${error.message}`
          );
          break;
      }
    });
};

const onReset = () => {
  email.value = '';
  emailRef.value.resetValidation();
};
</script>

<template>
  <q-card flat bordered style="width: 350px">
    <q-card-section class="q-pb-none">
      <div class="text-center text-h5">암호 재설정 메일 보내기</div>
    </q-card-section>
    <q-card-section class="row">
      <q-form @submit="onSubmit" @reset="onReset" class="col-12">
        <q-input
          v-model="email"
          ref="emailRef"
          class="col-12"
          label="이메일"
          type="email"
          :rules="emailRules"
        />
        <div class="col-12 row wrap q-my-sm">
          <div class="col-6 q-pr-sm">
            <q-btn
              label="메일 보내기"
              class="full-width"
              color="primary"
              type="submit"
            />
          </div>
          <div class="col-6 q-pl-sm">
            <q-btn
              label="초기화"
              class="full-width"
              color="secondary"
              type="reset"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-center text-h6">암호가 기억 났나요?</div>
      <div class="text-center">
        <router-link to="/login">로그인 하기</router-link>
      </div>
    </q-card-section>
  </q-card>
</template>
