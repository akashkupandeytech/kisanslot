import React from 'react';

export default function OfficerReports({ allSlots, crops }) {
  const totalQty = crops.reduce((a, c) => a + c.qty, 0);
  const avgWait = allSlots.length
    ? Math.round(allSlots.reduce((a, s) => a + s.queueAhead * s.duration, 0) / allSlots.length)
    : 0;
  const tenantCount = allSlots.filter((s) => s.farmer?.mode === 'Tenant').length;
  const ownerCount = allSlots.length - tenantCount;

  return (
    <div className="card">
      <h3>Reports</h3>
      <table>
        <tbody>
          <tr><td>Total Bookings</td><td><strong>{allSlots.length}</strong></td></tr>
          <tr><td>Total Quantity Registered</td><td><strong>{totalQty} q</strong></td></tr>
          <tr><td>Tenant Farmers Served</td><td><strong>{tenantCount}</strong></td></tr>
          <tr><td>Owner Farmers Served</td><td><strong>{ownerCount}</strong></td></tr>
          <tr><td>Average Estimated Wait</td><td><strong>{avgWait} min</strong></td></tr>
        </tbody>
      </table>
    </div>
  );
}
