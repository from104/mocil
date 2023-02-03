import { boot } from 'quasar/wrappers'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/firebase';

// 로그인 안 해도 접근할 수 있는 주소
const allowedRoutes = ['/login', '/password-reset', '/signup'];

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({router}) => {
  router.beforeEach((to, from, next) => {
    // Now you need to add your authentication logic here, like calling an API endpoint
    onAuthStateChanged(auth, user => {
      if (user || allowedRoutes.includes(to.path)) {
        // console.log('Allowing user to access page');
        next();
      } else {
        // console.log('Redirecting user to login');
        next({ path: '/login' });
      }
    })
  })
})
