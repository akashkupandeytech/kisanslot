import React, { useState } from 'react';
import api from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function Help({ farmer, showToast }) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    topic: 'Slot booking issue',
    description: ''
  });

  const [msg, setMsg] = useState(null);

  const submit = async () => {
    if (!farmer) {
      setMsg({
        text: t('help.registerFarmerFirst'),
        ok: false
      });
      return;
    }

    if (!form.description.trim()) {
      setMsg({
        text: t('help.describeIssue'),
        ok: false
      });
      return;
    }

    try {
      await api.post('/complaints', {
        farmer: farmer._id,
        topic: form.topic,
        description: form.description
      });

      setMsg({
        text: t('help.complaintSubmitted'),
        ok: true
      });

      showToast(t('help.complaintAdded'));

      setForm({
        ...form,
        description: ''
      });
    } catch (err) {
      setMsg({
        text: err.response?.data?.message || t('common.somethingWrong'),
        ok: false
      });
    }
  };

  return (
    <div className="card">
      <h3>{t('help.title')}</h3>

      <div className="field">
        <label>{t('help.topic')}</label>

        <select
          value={form.topic}
          onChange={(e) =>
            setForm({
              ...form,
              topic: e.target.value
            })
          }
        >
          <option value="Slot booking issue">
            {t('help.slotIssue')}
          </option>

          <option value="Payment delay">
            {t('help.paymentDelay')}
          </option>

          <option value="Quality check dispute">
            {t('help.qualityDispute')}
          </option>

          <option value="Registration / verification">
            {t('help.registrationVerification')}
          </option>
        </select>
      </div>

      <div className="field">
        <label>{t('help.describe')}</label>

        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value
            })
          }
          placeholder={t('help.placeholder')}
        />
      </div>

      <button
        className="btn gold"
        onClick={submit}
      >
        {t('help.submit')}
      </button>

      {msg && (
        <span
          style={{
            color: msg.ok
              ? 'var(--ok)'
              : 'var(--clay-600)',
            marginLeft: 10,
            fontSize: 13
          }}
        >
          {msg.text}
        </span>
      )}

      <div
        className="note-box"
        style={{ marginTop: 18 }}
      >
        {t('help.note')}
      </div>
    </div>
  );
}
