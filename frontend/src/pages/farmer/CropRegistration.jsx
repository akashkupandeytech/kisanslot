import React, { useState } from 'react';
import api from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

export default function CropRegistration({
  farmer,
  crops,
  refreshCrops,
  showToast
}) {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    crop: 'Wheat',
    qty: '',
    season: 'Rabi'
  });

  const [msg, setMsg] = useState(null);

  const submit = async () => {
    if (!farmer) {
      setMsg({
        text: t('cropReg.registerFarmerFirst'),
        ok: false
      });
      return;
    }

    const qty = parseFloat(form.qty);

    if (!qty || qty <= 0) {
      setMsg({
        text: t('cropReg.validQuantity'),
        ok: false
      });
      return;
    }

    try {
      await api.post('/crops', {
        farmer: farmer._id,
        crop: form.crop,
        qty,
        season: form.season
      });

      setMsg({
        text: t('cropReg.cropAdded'),
        ok: true
      });

      if (showToast) {
        showToast(
          `${t(`crop.${form.crop.toLowerCase()}`)} ${t('cropReg.registered')}`
        );
      }

      setForm({
        ...form,
        qty: ''
      });

      refreshCrops();
    } catch (err) {
      setMsg({
        text:
          err.response?.data?.message ||
          t('common.somethingWrong'),
        ok: false
      });
    }
  };

  return (
    <>
      {/* Register New Crop */}
      <div className="card">
        <h3>{t('cropReg.title')}</h3>

        <p className="desc">
          {t('cropReg.description')}
        </p>

        <div className="row3">
          <div className="field">
            <label>{t('cropReg.crop')}</label>

            <select
              value={form.crop}
              onChange={(e) =>
                setForm({
                  ...form,
                  crop: e.target.value
                })
              }
            >
              <option value="Wheat">
                {t('crop.wheat')}
              </option>

              <option value="Paddy">
                {t('crop.paddy')}
              </option>

              <option value="Sugarcane">
                {t('crop.sugarcane')}
              </option>

              <option value="Mustard">
                {t('crop.mustard')}
              </option>

              <option value="Maize">
                {t('crop.maize')}
              </option>

              <option value="Cotton">
                {t('crop.cotton')}
              </option>
            </select>
          </div>

          <div className="field">
            <label>{t('cropReg.quantity')}</label>

            <input
              type="number"
              min="1"
              value={form.qty}
              onChange={(e) =>
                setForm({
                  ...form,
                  qty: e.target.value
                })
              }
              placeholder="50"
            />
          </div>

          <div className="field">
            <label>{t('cropReg.season')}</label>

            <select
              value={form.season}
              onChange={(e) =>
                setForm({
                  ...form,
                  season: e.target.value
                })
              }
            >
              <option value="Rabi">
                {t('season.rabi')}
              </option>

              <option value="Kharif">
                {t('season.kharif')}
              </option>

              <option value="Zaid">
                {t('season.zaid')}
              </option>
            </select>
          </div>
        </div>

        <button
          className="btn gold"
          onClick={submit}
        >
          {t('cropReg.add')}
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
      </div>

      {/* Registered Crops */}
      <div className="card">
        <h3>{t('cropReg.registeredCrops')}</h3>

        {crops.length === 0 ? (
          <div className="empty">
            <div className="ic">🌱</div>
            {t('cropReg.noCrops')}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('cropReg.crop')}</th>
                <th>{t('cropReg.quantity')}</th>
                <th>{t('cropReg.season')}</th>
              </tr>
            </thead>

            <tbody>
              {crops.map((c) => (
                <tr key={c._id}>
                  <td>
                    {t(
                      `crop.${c.crop.toLowerCase()}`
                    ) || c.crop}
                  </td>

                  <td>
                    {c.qty} {t('cropReg.quintal')}
                  </td>

                  <td>
                    {t(
                      `season.${c.season.toLowerCase()}`
                    ) || c.season}
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
