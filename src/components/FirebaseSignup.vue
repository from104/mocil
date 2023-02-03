<script setup LANG="ts">
import { ref } from 'vue';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
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

const onSubmit =async () => {
  if (emailRef.value.hasError || passwordRef.value.hasError) {
    return;
  }
  await createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log(
      //   user ? `Create account success: ${user.email}` : 'Create Account Failed'
      // );
      if (!user.emailVerified) {
        await sendEmailVerification(user)
          .then(() => {
            // Email verification sent!
            alert(`이메일 인증을 위해 ${user.email}로 이메일을 보냈습니다.`);
            signOut(auth);
            location.href = '/login';
          })
          .catch((error) => {
            // console.log(errorCode, errorMessage);
            switch (error.code) {
              case 'auth/too-many-requests':
                alert('이메일 인증을 위한 이메일 발송이 너무 많습니다.');
                break;
              default:
                alert(`이메일 인증을 위한 이메일 발송에 실패했습니다. ${errorMessage}`);
                break;
            }
            signOut(auth);
            location.href = '/signup';
          });
      }
    })
    .catch((error) => {
      // console.log(errorCode, errorMessage);
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('이미 사용중인 이메일입니다.');
          break;
        case 'auth/invalid-email':
          alert('이메일 주소가 아닙니다.');
          break;
        case 'auth/weak-password':
          alert('암호가 너무 취약합니다.');
          break;
        default:
          alert(`계정 등록에 실패했습니다. ${errorMessage}`);
          break;
      }
      location.href = '/signup';
    });
};

const onReset = () => {
  email.value = '';
  emailRef.value.resetValidation();

  password.value = '';
  passwordRef.value.resetValidation();
};
</script>

<template>
  <q-card flat bordered style="width: 350px">
    <q-card-section class="q-pb-none">
      <div class="text-center text-h5">계정 등록</div>
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
              label="계정 등록"
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
      <q-separator />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="text-center text-h6">이미 계정이 있나요?</div>
      <div class="text-center">
        <router-link to="/login">로그인 하기</router-link>
      </div>
    </q-card-section>
  </q-card>
</template>
