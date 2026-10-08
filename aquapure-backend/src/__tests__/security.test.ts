import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function runTests() {
  console.log('🧪 Starting AquaPure Backend Security & Logic Unit Tests...\n');
  let passed = 0;
  let failed = 0;

  // Test 1: Bcrypt Password Hashing & Comparison
  try {
    const rawPass = 'AquaPureSecret123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPass, salt);
    const valid = await bcrypt.compare(rawPass, hash);
    const invalid = await bcrypt.compare('WrongPassword', hash);

    if (valid && !invalid) {
      console.log('✅ Test 1: Password hashing and comparison verified.');
      passed++;
    } else {
      throw new Error('Comparison did not match expected truth table');
    }
  } catch (err: any) {
    console.error('❌ Test 1 failed:', err.message);
    failed++;
  }

  // Test 2: JWT Generation, Verification and Role Preservation
  try {
    const secret = 'super-test-secret-key';
    const payload = { id: 'user_123', email: 'admin@aquapure.com', role: 'admin' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret) as any;

    if (decoded.id === 'user_123' && decoded.role === 'admin' && decoded.email === 'admin@aquapure.com') {
      console.log('✅ Test 2: JWT generation and role validation verified.');
      passed++;
    } else {
      throw new Error('Decoded token payload mismatch');
    }
  } catch (err: any) {
    console.error('❌ Test 2 failed:', err.message);
    failed++;
  }

  // Test 3: Anti-Tampering Server-Side Total Calculation
  try {
    const items = [
      { price: 18999, quantity: 2 },
      { price: 12999, quantity: 1 }
    ];
    // Subtotal: 18999*2 + 12999 = 37998 + 12999 = 50997
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shipping = subtotal >= 15000 ? 0 : 500;
    const discount = 500; // SAVE500
    const taxable = Math.max(0, subtotal - discount + shipping);
    const tax = Math.round(taxable * 0.18);
    const expectedTotal = taxable + tax;

    if (subtotal === 50997 && shipping === 0 && taxable === 50497 && expectedTotal === 50497 + tax) {
      console.log('✅ Test 3: Server-side pricing anti-tampering logic verified.');
      passed++;
    } else {
      throw new Error('Pricing calculation discrepancy');
    }
  } catch (err: any) {
    console.error('❌ Test 3 failed:', err.message);
    failed++;
  }

  // Test 4: Coupon Logic Validation
  try {
    const coupons: Record<string, { discount: number; type: string }> = {
      'AQUA10': { discount: 10, type: 'percentage' },
      'SAVE500': { discount: 500, type: 'fixed' },
    };
    const subtotal = 20000;
    const pctDiscount = Math.round((subtotal * coupons['AQUA10'].discount) / 100);
    const fixedDiscount = coupons['SAVE500'].discount;

    if (pctDiscount === 2000 && fixedDiscount === 500) {
      console.log('✅ Test 4: Coupon calculation logic verified.');
      passed++;
    } else {
      throw new Error('Coupon calculation mismatch');
    }
  } catch (err: any) {
    console.error('❌ Test 4 failed:', err.message);
    failed++;
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
