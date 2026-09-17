import React, { useState } from 'react';
import api from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function Documents({
  farmer,
  documents = [],
  refreshDocuments,
  showToast
}) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    type: 'Aadhaar Card',
    name: ''
  });

  const submit = async () => {
    if (!farmer) {
      showToast(t('documents.registerFarmerFirst'));
      return;
    }

    if (!form.name.trim()) {
      showToast(t('documents.enterDocument'));
      return;
    }

    try {
      await api.post('/documents', {
        farmer: farmer._id,
        type: form.type,
        name: form.name
      });

      showToast(t('documents.added'));

      setForm({
        ...form,
        name: ''
      });

      refreshDocuments();
    } catch (err) {
      showToast(
        err.response?.data?.message || t('common.somethingWrong')
      );
    }
  };

  return (
    <>
      <div className="card">
        <h3>{t('documents.title')}</h3>

        <p className="desc">
          {t('documents.description')}
        </p>

        <div className="row2">
          <div className="field">
            <label>{t('documents.type')}</label>

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value
                })
              }
            >
              <option value="Aadhaar Card">
                {t('documents.aadhaar')}
              </option>

              <option value="Khatauni / Land Record">
                {t('documents.khatauni')}
              </option>

              <option value="Bank Passbook">
                {t('documents.bankPassbook')}
              </option>

              <option value="Procurement Receipt">
                {t('documents.procurementReceipt')}
              </option>

              <option value="Other">
                {t('documents.other')}
              </option>
            </select>
          </div>

          <div className="field">
            <label>{t('documents.numberName')}</label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              placeholder={t('documents.placeholder')}
            />
          </div>
        </div>

        <button
          className="btn gold"
          onClick={submit}
        >
          {t('documents.add')}
        </button>
      </div>

      <div className="card">
        <h3>{t('documents.yourDocuments')}</h3>

        {documents.length === 0 ? (
          <div className="empty">
            <div className="ic">📄</div>
            {t('documents.empty')}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('documents.document')}</th>
                <th>{t('documents.type')}</th>
                <th>{t('documents.status')}</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.type}</td>
                  <td>
                    <span className="badge ok">
                      {t('documents.saved')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
