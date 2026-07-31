import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('[Validation] Starting Workflow 1 Validation...');

const run = async () => {
  const submitComplaint = async (payload, headers = {}) => {
    const start = performance.now();
    const res = await fetch('http://localhost:5000/api/v1/complaints/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload)
    });
    const end = performance.now();
    const data = await res.json();
    return { status: res.status, data, latency: end - start };
  };

  // Scenario 1: Basic Submit
  console.log('\n--- Scenario 1: Normal Submit ---');
  let s1 = await submitComplaint({ category: 'Dark Street', lat: 17.68, lng: 83.21 });
  console.log(`Status: ${s1.status}, Latency: ${s1.latency.toFixed(2)}ms`);

  // Scenario 6: Invalid Data
  console.log('\n--- Scenario 6: Invalid Data ---');
  let s6 = await submitComplaint({ category: 'Dark Street' }); // missing lat/lng
  console.log(`Status: ${s6.status}, Error: ${s6.data.error}`);

  // Scenario 7: Idempotency
  console.log('\n--- Scenario 7: Idempotency ---');
  let s7_1 = await submitComplaint({ category: 'Dark Street', lat: 10, lng: 10 }, { 'x-idempotency-key': 'test-idem-123' });
  let s7_2 = await submitComplaint({ category: 'Dark Street', lat: 10, lng: 10 }, { 'x-idempotency-key': 'test-idem-123' });
  console.log(`Req 1 ID: ${s7_1.data.data.complaintId}`);
  console.log(`Req 2 ID: ${s7_2.data.data.complaintId}`);
  if (s7_1.data.data.complaintId === s7_2.data.data.complaintId) {
    console.log('Idempotency VERIFIED!');
  }

  // Scenario 8: Latency Profile
  console.log('\n--- Scenario 8: Latency Profile ---');
  console.log(`End-to-End API processing time: ${s1.latency.toFixed(2)}ms`);
  
  console.log('\n[Validation] Validation complete.');
};

run();
