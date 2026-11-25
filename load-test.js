import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },   // الصعود إلى 500 مستخدم
    { duration: '1m',  target: 2000 },  // رفع الضغط إلى 2000 مستخدم متزامن
    { duration: '30s', target: 5000 },  // الوصول إلى قمة الضغط (5000 مستخدم)
    { duration: '30s', target: 0 },     // التهدئة التدريجية
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% من الطلبات تستجيب في أقل من 500ms
    http_req_failed: ['rate<0.01'],    // نسبة الأخطاء أقل من 1%
  },
};

export default function loadTest() {
  const res = http.get('https://youssef-abdeltwab.vercel.app');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}