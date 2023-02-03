import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/NoticePage.vue') },
      { path: '/notice', component: () => import('pages/NoticePage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/password-reset', component: () => import('pages/PasswordResetPage.vue') },
      { path: '/signup', component: () => import('pages/SignupPage.vue') },
    ],
  },

  // 로그인 페이지
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
