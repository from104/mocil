<script setup LANG="ts">
import { ref } from 'vue';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from 'src/firebase';

const email = ref('');
const emailRef = ref(null);
const emailRules = [
  (val) => !!val || '이메일 주소를 넣으세요.',
  (val) => /.+@.+\..+/.test(val) || '이메일 주소가 아닙니다.',
];

const password = ref('');
const passwordRef = ref(null);
const passwordRules = [
  (val) => !!val || '암호를 넣으세요.',
  (val) => val.length >= 6 || '암호는 6자 이상이어야 합니다.',
];

const onSubmit = async () => {
  if (emailRef.value.hasError || passwordRef.value.hasError) {
    return;
  }
  await signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      if (!user.emailVerified) {
        alert('이메일 인증을 해주세요.');
        signOut(auth);
        return;
      }
      location.href = '/';
    })
    .catch((error) => {
      // console.log(error.code);
      // 에러 메세지 한글로 매칭
      switch (error.code) {
        case 'auth/user-not-found':
          alert('존재하지 않는 사용자입니다.');
          break;
        case 'auth/wrong-password':
          alert('암호가 틀렸습니다.');
          break;
        default:
          alert(`로그인에 실패했습니다. Error: ${error.message}`);
          break;
      }
    });
};

const onReset = () => {
  email.value = '';
  emailRef.value.resetValidation();

  password.value = '';
  passwordRef.value.resetValidation();
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider).catch((error) => {
    switch (error.code) {
      case 'auth/account-exists-with-different-credential':
        alert('이미 다른 인증 방법으로 가입한 계정입니다.');
        break;
      default:
        alert(`로그인에 실패했습니다. Error: ${error.message}`);
        break;
    }
  });
  // router.push('/');
  location.href = '/';
};
</script>

<template>
  <q-card flat bordered style="width: 350px">
    <q-card-section class="q-pb-none">
      <div class="text-center text-h5">로그인</div>
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
        <q-input
          v-model="password"
          ref="passwordRef"
          class="col-12"
          label="암호"
          type="password"
          :rules="passwordRules"
        />
        <div class="col-12 row wrap q-my-sm">
          <div class="col-6 q-pr-sm">
            <q-btn
              label="로그인"
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
      <div class="text-center text-h6">아직 계정이 없나요?</div>
      <div class="text-center">
        <router-link to="/signup">계정 만들기</router-link>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-center text-h6">암호를 잊었나요?</div>
      <div class="text-center">
        <router-link to="/password-reset">암호 재설정</router-link>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-separator />
      <q-btn
        label="구글로 로그인"
        icon="mdi-google"
        class="full-width q-my-sm text-black"
        color="grey-2"
        @click="signInWithGoogle"
      />
    </q-card-section>
  </q-card>
</template>
