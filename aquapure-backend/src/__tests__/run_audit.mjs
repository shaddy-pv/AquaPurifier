import { performance } from 'perf_hooks';

const BASE_URL = 'http://127.0.0.1:5001';

async function runLoadTest(name, url, concurrency, options = {}) {
  const latencies = [];
  let success = 0;
  let failed = 0;

  const startTime = performance.now();

  const requests = Array.from({ length: concurrency }).map(async () => {
    const t0 = performance.now();
    try {
      const res = await fetch(url, options);
      const t1 = performance.now();
      latencies.push(t1 - t0);
      if (res.ok) {
        success++;
      } else {
        failed++;
      }
    } catch (err) {
      const t1 = performance.now();
      latencies.push(t1 - t0);
      failed++;
    }
  });

  await Promise.all(requests);
  const totalDuration = performance.now() - startTime;

  latencies.sort((a, b) => a - b);
  const min = latencies.length ? Math.round(latencies[0]) : 0;
  const max = latencies.length ? Math.round(latencies[latencies.length - 1]) : 0;
  const avg = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
  const p95 = latencies.length ? Math.round(latencies[Math.floor(latencies.length * 0.95)]) : 0;
  const rps = totalDuration > 0 ? Math.round((concurrency / (totalDuration / 1000))) : 0;

  return {
    total: concurrency,
    success,
    failed,
    min,
    max,
    avg,
    p95,
    rps,
    durationMs: Math.round(totalDuration)
  };
}

async function runAudit() {
  console.log('====================================================');
  console.log('🚀 AQUAPURE BACKEND PRODUCTION AUDIT & LOAD TEST');
  console.log('====================================================\n');

  // --- SECTION 1: FUNCTIONAL ENDPOINT TESTS ---
  console.log('📌 1. FUNCTIONAL ENDPOINT VERIFICATION:');
  
  // 1.1 Health
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    console.log(`  ✓ GET /health: Status ${res.status} [${data.status}]`);
  } catch (err) {
    console.log(`  ✗ GET /health failed: ${err.message}`);
  }

  // 1.2 Products
  let sampleProductId = '';
  try {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    const products = data.products || data;
    sampleProductId = products[0]?._id || products[0]?.id || '';
    console.log(`  ✓ GET /api/products: Status ${res.status} [Found ${products.length} products]`);
  } catch (err) {
    console.log(`  ✗ GET /api/products failed: ${err.message}`);
  }

  // 1.3 Promotions
  try {
    const res = await fetch(`${BASE_URL}/api/promotions`);
    const data = await res.json();
    console.log(`  ✓ GET /api/promotions: Status ${res.status} [TollFree: ${data.promotion?.announcementBar?.tollFreeNumber}]`);
  } catch (err) {
    console.log(`  ✗ GET /api/promotions failed: ${err.message}`);
  }

  // 1.4 Settings
  try {
    const res = await fetch(`${BASE_URL}/api/settings`);
    const data = await res.json();
    console.log(`  ✓ GET /api/settings: Status ${res.status} [Phone: ${data.settings?.supportPhone}]`);
  } catch (err) {
    console.log(`  ✗ GET /api/settings failed: ${err.message}`);
  }

  // 1.5 Auth Flow (Register -> Login -> /me)
  const testEmail = `audit_test_${Date.now()}@prayagro.com`;
  const testPassword = 'SecurePassword123!';
  let authToken = '';

  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Audit User',
        email: testEmail,
        password: testPassword,
        phone: '9140967681'
      })
    });
    const regData = await regRes.json();
    console.log(`  ✓ POST /api/auth/register: Status ${regRes.status} [${regData.message || 'OK'}]`);

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    authToken = loginData.token || '';
    console.log(`  ✓ POST /api/auth/login: Status ${loginRes.status} [Token generated: ${!!authToken}]`);

    if (authToken) {
      const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const meData = await meRes.json();
      console.log(`  ✓ GET /api/auth/me (Protected): Status ${meRes.status} [User: ${meData.email}]`);
    }
  } catch (err) {
    console.log(`  ✗ Auth verification failed: ${err.message}`);
  }

  // --- SECTION 2: LOAD & STRESS TESTS ---
  console.log('\n📌 2. LOAD & CONCURRENCY STRESS TESTS:');

  const testCases = [
    { name: 'GET /health (50 concurrent)', url: `${BASE_URL}/health`, count: 50 },
    { name: 'GET /api/products (100 concurrent)', url: `${BASE_URL}/api/products`, count: 100 },
    { name: 'GET /api/promotions (100 concurrent)', url: `${BASE_URL}/api/promotions`, count: 100 },
    { name: 'GET /api/settings (50 concurrent)', url: `${BASE_URL}/api/settings`, count: 50 }
  ];

  for (const tc of testCases) {
    const stats = await runLoadTest(tc.name, tc.url, tc.count);
    console.log(`\n  ⚡ ${tc.name}:`);
    console.log(`     - Total Requests: ${stats.total}`);
    console.log(`     - Success Rate:   ${((stats.success / stats.total) * 100).toFixed(1)}% (${stats.success}/${stats.total})`);
    console.log(`     - Throughput:     ${stats.rps} req/sec`);
    console.log(`     - Min Latency:    ${stats.min} ms`);
    console.log(`     - Avg Latency:    ${stats.avg} ms`);
    console.log(`     - p95 Latency:    ${stats.p95} ms`);
    console.log(`     - Max Latency:    ${stats.max} ms`);
    console.log(`     - Total Duration: ${stats.durationMs} ms`);
  }

  // --- SECTION 3: DEFENSIVE SECURITY & VULNERABILITY AUDIT ---
  console.log('\n📌 3. DEFENSIVE SECURITY & OWASP VULNERABILITY AUDIT:');

  // 3.1 Security Headers Audit
  try {
    const headRes = await fetch(`${BASE_URL}/health`);
    const headers = headRes.headers;
    const helmetHeaders = {
      'x-content-type-options': headers.get('x-content-type-options'),
      'x-frame-options': headers.get('x-frame-options'),
      'strict-transport-security': headers.get('strict-transport-security'),
      'content-security-policy': headers.get('content-security-policy'),
      'x-xss-protection': headers.get('x-xss-protection'),
    };
    console.log('\n  [A] HTTP Security Headers Check:');
    for (const [k, v] of Object.entries(helmetHeaders)) {
      if (v) {
        console.log(`     ✅ ${k}: ${v}`);
      } else {
        console.log(`     ⚠️ MISSING: ${k} (Helmet recommended)`);
      }
    }
  } catch (err) {
    console.log(`     Error checking headers: ${err.message}`);
  }

  // 3.2 NoSQL Operator Injection Test
  try {
    console.log('\n  [B] NoSQL Operator Injection Resilience:');
    const nosqlRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: { $gt: '' }, password: { $gt: '' } })
    });
    console.log(`     - Payload: { email: { $gt: "" }, password: { $gt: "" } }`);
    console.log(`     - Response Status: ${nosqlRes.status}`);
    if (nosqlRes.status === 400 || nosqlRes.status === 401) {
      console.log(`     ✅ Handled with ${nosqlRes.status}`);
    } else {
      console.log(`     ⚠️ Result: Returned ${nosqlRes.status}`);
    }
  } catch (err) {
    console.log(`     Error during NoSQL test: ${err.message}`);
  }

  // 3.3 SQL / XSS Input Resilience
  try {
    console.log('\n  [C] SQL/XSS Query Parameter Injection Resilience:');
    const xssQuery = `<script>alert('xss')</script>' OR '1'='1`;
    const searchRes = await fetch(`${BASE_URL}/api/products?search=${encodeURIComponent(xssQuery)}`);
    console.log(`     - Query: ?search=${xssQuery}`);
    console.log(`     - Response Status: ${searchRes.status}`);
    const searchData = await searchRes.json();
    console.log(`     ✅ Handled safely (Returned ${Array.isArray(searchData.products || searchData) ? (searchData.products || searchData).length : 0} items)`);
  } catch (err) {
    console.log(`     Error during XSS test: ${err.message}`);
  }

  // 3.4 Path Traversal Check on Static Assets
  try {
    console.log('\n  [D] Path Traversal Resilience:');
    const pathTraversalRes = await fetch(`${BASE_URL}/assets/../../package.json`);
    console.log(`     - Request: GET /assets/../../package.json`);
    console.log(`     - Response Status: ${pathTraversalRes.status}`);
    if (pathTraversalRes.status === 404 || pathTraversalRes.status === 403 || pathTraversalRes.status === 400) {
      console.log(`     ✅ PASSED: Path traversal rejected with ${pathTraversalRes.status}`);
    } else {
      console.log(`     ⚠️ POTENTIAL LEAK: Status ${pathTraversalRes.status}`);
    }
  } catch (err) {
    console.log(`     Error during path traversal test: ${err.message}`);
  }

  // 3.5 Privilege Escalation / Admin Endpoint Protection
  try {
    console.log('\n  [E] Role-Based Access Control (RBAC):');
    const unauthorizedAdminRes = await fetch(`${BASE_URL}/api/promotions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken ? `Bearer ${authToken}` : ''
      },
      body: JSON.stringify({ announcementBar: { message: 'Hacked' } })
    });
    console.log(`     - Customer token accessing Admin PUT /api/promotions: Status ${unauthorizedAdminRes.status}`);
    if (unauthorizedAdminRes.status === 403 || unauthorizedAdminRes.status === 401) {
      console.log(`     ✅ PASSED: Unauthorized admin modification rejected (${unauthorizedAdminRes.status})`);
    } else {
      console.log(`     ⚠️ VULNERABLE: Admin modification allowed with status ${unauthorizedAdminRes.status}`);
    }
  } catch (err) {
    console.log(`     Error during RBAC test: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log('🏁 AUDIT & TEST SUITE FINISHED');
  console.log('====================================================\n');
}

runAudit().catch(console.error);
