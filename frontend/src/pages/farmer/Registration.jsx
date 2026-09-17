import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { t } from '../../i18n/translations';

export default function Registration({ farmer, setFarmer, showToast }) {
  const [form, setForm] = useState({
    name: '', father: '', mobile: '', village: '', district: '', state: 'Uttarakhand', land: '', bank: '', mode: 'Owner'
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => { if (farmer) setForm({ ...form, ...farmer }); }, [farmer]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async () => {
    if (!form.name.trim() || !form.mobile.trim()) {
      setMsg({ text: 'Naam aur Mobile Number zaroori hai.', ok: false });
      return;
    }
    try {
      const res = await api.post('/farmers', form);
      setFarmer(res.data);
      setMsg({ text: 'Profile save ho gayi.', ok: true });
      showToast('Farmer profile save ho gayi');
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Kuch galat hua.', ok: false });
    }
  };

  return (
  <div className="card">
    <h3>{t('reg.title')}</h3>

    <p className="desc">
      {t('reg.description')}
    </p>

    <div className="row2">
      <div className="field">
        <label>{t('reg.fullName')}</label>
        <input
          value={form.name}
          onChange={update('name')}
          placeholder="Ram Singh"
        />
      </div>

      <div className="field">
        <label>{t('reg.fatherName')}</label>
        <input
          value={form.father}
          onChange={update('father')}
          placeholder="Shyam Singh"
        />
      </div>
    </div>

    <div className="row2">
      <div className="field">
        <label>{t('reg.mobile')}</label>
        <input
          value={form.mobile}
          onChange={update('mobile')}
          placeholder="98XXXXXXXX"
          maxLength={10}
        />
      </div>

      <div className="field">
        <label>{t('reg.village')}</label>
        <input
          value={form.village}
          onChange={update('village')}
          placeholder="Gaon ka naam"
        />
      </div>
    </div>

    <div className="row2">
      <div className="field">
        <label>{t('reg.district')}</label>
        <input
          value={form.district}
          onChange={update('district')}
          placeholder="Dehradun"
        />
      </div>

      <div className="field">
        <label>{t('reg.state')}</label>
        <input
          value={form.state}
          onChange={update('state')}
          placeholder="State"
        />
      </div>
    </div>

    <div className="row2">
      <div className="field">
        <label>{t('reg.landArea')}</label>
        <input
          value={form.land}
          onChange={update('land')}
          placeholder="2.5 hectare"
        />
      </div>

      <div className="field">
        <label>{t('reg.bankAccount')}</label>
        <input
          value={form.bank}
          onChange={update('bank')}
          placeholder="Account no. + IFSC"
        />
      </div>
    </div>

    <div className="field" style={{ maxWidth: 260 }}>
      <label>{t('reg.farmingMode')}</label>

      <select value={form.mode} onChange={update('mode')}>
        <option value="Owner">{t('reg.owner')}</option>
        <option value="Tenant">{t('reg.tenant')}</option>
      </select>
    </div>

    <button className="btn_gold" onClick={submit}>
      {t('reg.save')}
    </button>

    {msg && (
      <span
        style={{
          color: msg.ok ? 'var(--ok)' : 'var(--clay-600)',
          marginLeft: 10,
          fontSize: 13
        }}
      >
        {msg.text}
      </span>
    )}
  </div>
);
}
