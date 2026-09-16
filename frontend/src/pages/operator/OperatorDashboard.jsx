import React from 'react';

export default function OperatorDashboard({ allSlots }) {
  const bookings = allSlots.length;
  const checkedin = allSlots.filter((s) => s.statusKey === 'checkedin').length;
  const reslotted = allSlots.filter((s) => s.statusKey === 'reslotted').length;
  const farmers = new Set(allSlots.map((s) => s.farmer?._id)).size;

  return (
    <div className="grid-stats">
      <div className="stat"><div className="num">{bookings}</div><div className="lbl">Today's Bookings</div></div>
      <div className="stat wheat"><div className="num">{checkedin}</div><div className="lbl">Checked-in</div></div>
      <div className="stat"><div className="num">{reslotted}</div><div className="lbl">Re-slotted (Mismatch)</div></div>
      <div className="stat clay"><div className="num">{farmers}</div><div className="lbl">Farmers Served</div></div>
    </div>
  );
}
