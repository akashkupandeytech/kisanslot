import React from 'react';

export default function Centres({ centres }) {
  return (
    <div className="card">
      <h3>Procurement Centres</h3>
      <p className="desc">Load live update hota hai jab koi slot book/check-in hota hai.</p>
      <table>
        <thead><tr><th>Centre</th><th>Daily Capacity</th><th>Current Load</th><th>Congestion Status</th></tr></thead>
        <tbody>
          {centres.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.cap} q/hr</td><td>{c.load}%</td>
              <td>{c.load >= 90 ? <span className="badge err">Overloaded</span> : <span className="badge ok">Normal</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {centres.some((c) => c.load >= 90) && (
        <div className="note-box" style={{ marginTop: 16 }}>
          Ek ya zyada centres overloaded hain — district officer dashboard ko alert bhej diya gaya hai aur najdeeki centres suggest kiye ja rahe hain.
        </div>
      )}
    </div>
  );
}
