import React from 'react';
import { NAV_BY_ROLE } from '../../navConfig.js';

export default function FarmerDashboard({ crops, slots, onNavigate }) {
  const checkedIn = slots.filter((s) => s.statusKey === 'checkedin').length;
  const pendingPay = slots.filter((s) => s.weighDone && s.paymentStage !== 'Credited').length;

  return (
    <>
      <div className="grid-stats">
        <div className="stat"><div className="num">{crops.length}</div><div className="lbl">Registered Crops</div></div>
        <div className="stat wheat"><div className="num">{slots.length}</div><div className="lbl">Booked Slots</div></div>
        <div className="stat"><div className="num">{checkedIn}</div><div className="lbl">Checked-in</div></div>
        <div className="stat clay"><div className="num">{pendingPay}</div><div className="lbl">Payment In Progress</div></div>
      </div>
      <div className="section-title"><h3>Saari Services</h3></div>
      <div className="service-grid">
        {NAV_BY_ROLE.farmer.filter((m) => m.id !== 'dashboard').map((m) => (
          <div className="service" key={m.id} onClick={() => onNavigate(m.id)}>
            <div className="ic">{m.icon}</div>
            <h4>{m.label}</h4>
            <p>Tap to open</p>
          </div>
        ))}
      </div>
    </>
  );
}
