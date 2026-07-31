// Use native fetch

console.log('[Validation] Starting Workflow 4 Validation (Manual Review & Closure)...');

const run = async () => {
  try {
    // 1. Submit Complaint
    console.log('1. Submitting Complaint...');
    const res = await fetch('http://localhost:5000/api/v1/complaints/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Broken Pole', lat: 17.68, lng: 83.21 })
    });
    const cData = await res.json();
    console.log(`   Complaint Submitted. ID: ${cData.data.complaintId}`);

    await new Promise(r => setTimeout(r, 5000));

    // 2. Optimize Routes (Assign)
    console.log('2. Optimizing Routes...');
    const optRes = await fetch('http://localhost:5000/api/v1/workorders/optimize', { method: 'POST' });
    const optData = await optRes.json();
    
    let workOrderId;
    if (optData.data && optData.data.length > 0) {
      workOrderId = optData.data[0].workOrderId;
      console.log(`   Assigned WorkOrder: ${workOrderId} to ${optData.data[0].team}`);
    } else {
      console.log('   No work orders found to optimize.');
      return;
    }

    await new Promise(r => setTimeout(r, 1000));

    // 3. State Transitions to ARRIVED
    const states = ['ACCEPTED', 'NAVIGATING', 'ARRIVED', 'REPAIRING'];
    for (const state of states) {
      console.log(`3. Transitioning to ${state}...`);
      const statRes = await fetch(`http://localhost:5000/api/v1/workorders/${workOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: state })
      });
      const statData = await statRes.json();
      console.log(`   Result: ${statData.message}`);
      await new Promise(r => setTimeout(r, 500)); // slightly slower to generate some time diff
    }

    // 4. Evidence Upload (Forced Failure)
    console.log('4. Uploading Evidence (Forcing Failure to trigger Manual Review)...');
    const evRes = await fetch(`http://localhost:5000/api/v1/evidence/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workOrderId,
        beforePhoto: 'mock1',
        afterPhoto: 'mock2',
        forceFail: true
      })
    });
    const evData = await evRes.json();
    console.log(`   Evidence Upload Result: ${evData.message}`);

    console.log('   Waiting for AI Verification Engine...');
    await new Promise(r => setTimeout(r, 4000));

    // 5. Supervisor Manual Review (Approve)
    console.log('5. Supervisor Manual Review: APPROVE');
    const revRes = await fetch(`http://localhost:5000/api/v1/workorders/${workOrderId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'APPROVE',
        reason: 'Visual inspection of photos looks acceptable. Ignoring AI warning.'
      })
    });
    const revData = await revRes.json();
    console.log(`   Review Result: ${revData.message}`);
    
    console.log('6. Test Complete. Check server logs for VERIFICATION_REPORT_GENERATED and RESOLVED status.');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
