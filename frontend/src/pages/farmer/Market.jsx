import React, { useState, useEffect } from 'react';
import api from '../../api.js';

export default function Market() {
  const [prices, setPrices] = useState([]);
  useEffect(() => { api.get('/market').then((res) => setPrices(res.data)); }, []);

  return (
    <div className="card">
      <h3>Market Prices (MSP Reference)</h3>
      <table>
        <thead><tr><th>Fasal</th><th>MSP (₹/quintal)</th><th>Trend</th></tr></thead>
        <tbody>
          {prices.map((p) => (
            <tr key={p.crop}>
              <td>{p.crop}</td><td>₹{p.price.toLocaleString('en-IN')}</td>
              <td>
                {p.change > 0 && <span className="badge ok">▲ {p.change}%</span>}
                {p.change < 0 && <span className="badge err">▼ {Math.abs(p.change)}%</span>}
                {p.change === 0 && <span className="badge info">— 0.0%</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
