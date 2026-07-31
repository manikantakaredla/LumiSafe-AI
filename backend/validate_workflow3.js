// Use native fetch

console.log('[Validation] Starting Workflow 3 Validation (State Machine)...');

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

    await new Promise(r => setTimeout(r, 2000));

    // 2. Optimize Routes (Assign)
    console.log('2. Optimizing Routes...');
    const optRes = await fetch('http://localhost:5000/api/v1/workorders/optimize', { method: 'POST' });
    const optData = await optRes.json();
    
    let workOrderId;
    if (optData.data && optData.data.length > 0) {
      workOrderId = optData.data[0].workOrderId;
      console.log(`   Assigned WorkOrder: ${workOrderId} to ${optData.data[0].team}`);
    } else {
      console.log('   No work orders found to optimize. Maybe it was already assigned?');
      return;
    }

    await new Promise(r => setTimeout(r, 1000));

    // 3. State Transitions
    const states = ['ACCEPTED', 'NAVIGATING', 'ARRIVED', 'BLOCKED', 'REPAIRING'];
    for (const state of states) {
      console.log(`3. Transitioning to ${state}...`);
      const statRes = await fetch(`http://localhost:5000/api/v1/workorders/${workOrderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: state })
      });
      const statData = await statRes.json();
      console.log(`   Result: ${statData.message}`);
      await new Promise(r => setTimeout(r, 500));
    }

    // 4. Evidence Upload
    console.log('4. Uploading Evidence (Triggers Verification Engine)...');
    const evRes = await fetch(`http://localhost:5000/api/v1/evidence/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workOrderId,
        beforePhoto: 'mock1',
        afterPhoto: 'mock2'
      })
    });
    const evData = await evRes.json();
    console.log(`   Evidence Upload Result: ${evData.message}`);

    // Wait for Verification Engine
    console.log('   Waiting for AI Verification Engine...');
    await new Promise(r => setTimeout(r, 3500));

    // 5. Finished
    console.log('5. Test Complete. Check server logs for VERIFYING -> RESOLVED transition.');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
