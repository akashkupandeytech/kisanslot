import React, { useState, useEffect } from 'react';
import api from '../../api.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';

function statusBadge(s, t) {
  if (s.statusKey === 'checkedin') {
    return (
      <span className="badge ok">
        {t('slot.checkedIn')}
      </span>
    );
  }

  if (s.statusKey === 'reslotted') {
    return (
      <span className="badge wait">
        {t('slot.reslotted')}
      </span>
    );
  }

  return (
    <span className="badge info">
      {t('slot.confirmed')}
    </span>
  );
}

export default function SlotBooking({
  farmer,
  crops,
  slots,
  refreshSlots,
  showToast
}) {
  const { t } = useLanguage();

  const [centres, setCentres] = useState([]);
  const [form, setForm] = useState({
    centre: '',
    date: '',
    crop: ''
  });
  const [dyn, setDyn] = useState(null);
  const [msg, setMsg] = useState(null);
  const [lastToken, setLastToken] = useState(null);

  useEffect(() => {
    api.get('/centres').then((res) => {
      setCentres(res.data);

      if (res.data[0]) {
        setForm((f) => ({
          ...f,
          centre: res.data[0].name
        }));
      }
    });
  }, []);

  useEffect(() => {
    if (crops[0] && !form.crop) {
      setForm((f) => ({
        ...f,
        crop: crops[0].crop
      }));
    }
  }, [crops, form.crop]);

  useEffect(() => {
    if (!form.centre || !form.date) {
      setDyn(null);
      return;
    }

    const cropDoc = crops.find(
      (c) => c.crop === form.crop
    );

    const qty = cropDoc ? cropDoc.qty : 10;

    api
      .get('/slots/estimate', {
        params: {
          centre: form.centre,
          date: form.date,
          qty
        }
      })
      .then((res) => setDyn(res.data))
      .catch(() => setDyn(null));
  }, [
    form.centre,
    form.date,
    form.crop,
    crops
  ]);

  const submit = async () => {
    if (!farmer) {
      setMsg({
        text: t('slot.registerFarmerFirst'),
        ok: false
      });
      return;
    }

    if (!form.date || crops.length === 0) {
      setMsg({
        text: t('slot.selectDateAndCrop'),
        ok: false
      });
      return;
    }

    const cropDoc = crops.find(
      (c) => c.crop === form.crop
    );

    try {
      const res = await api.post('/slots', {
        farmer: farmer._id,
        centre: form.centre,
        date: form.date,
        crop: form.crop,
        qty: cropDoc ? cropDoc.qty : 10
      });

      setMsg({
        text: t('slot.booked'),
        ok: true
      });

      if (showToast) {
        showToast(
          `${t('slot.booked')}: ${t('slot.token')} ${res.data.token}`
        );
      }

      setLastToken(res.data);
      refreshSlots();
    } catch (err) {
      setMsg({
        text:
          err.response?.data?.message ||
          t('common.somethingWrong'),
        ok: false
      });
    }
  };

  const liveToken = lastToken
    ? slots.find((s) => s._id === lastToken._id) ||
      lastToken
    : null;

  return (
    <>
      {/* Slot Booking */}
      <div className="card">
        <h3>{t('slot.title')}</h3>

        <p className="desc">
          {t('slot.description')}
        </p>

        <div className="row2">
          <div className="field">
            <label>{t('slot.procurementCentre')}</label>

            <select
              value={form.centre}
              onChange={(e) =>
                setForm({
                  ...form,
                  centre: e.target.value
                })
              }
            >
              {centres.map((c) => (
                <option
                  key={c._id}
                  value={c.name}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{t('slot.date')}</label>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value
                })
              }
            />
          </div>
        </div>

        <div className="field">
          <label>{t('slot.crop')}</label>

          <select
            value={form.crop}
            onChange={(e) =>
              setForm({
                ...form,
                crop: e.target.value
              })
            }
          >
            {crops.length ? (
              crops.map((c) => (
                <option
                  key={c._id}
                  value={c.crop}
                >
                  {c.crop}
                </option>
              ))
            ) : (
              <option value="">
                {t('slot.registerCropFirst')}
              </option>
            )}
          </select>
        </div>

        {dyn && (
          <div className="dyn-panel">
            <div className="dyn-metric">
              <div className="v">
                {dyn.duration} {t('slot.minutes')}
              </div>
              <div className="l">
                {t('slot.recommendedDuration')}
              </div>
            </div>

            <div className="dyn-metric">
              <div className="v">
                {dyn.centreLoad}%
              </div>
              <div className="l">
                {t('slot.centreLoadToday')}
              </div>
            </div>

            <div className="dyn-metric">
              <div className="v">
                {dyn.wait} {t('slot.minutes')}
              </div>
              <div className="l">
                {t('slot.liveEstimatedWait')}
              </div>
            </div>

            <div className="dyn-metric">
              <div className="v">
                {dyn.queueAhead}
              </div>
              <div className="l">
                {t('slot.farmersAhead')}
              </div>
            </div>
          </div>
        )}

        <button
          className="btn gold"
          onClick={submit}
        >
          {t('slot.book')}
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

      {/* Live Token */}
      {liveToken && (
        <div className="token-card">
          <div className="qr">🎫</div>

          <div className="code">
            {liveToken.token}
          </div>

          <div className="sub">
            {liveToken.centre} • {liveToken.date} •{' '}
            {liveToken.window}
          </div>

          <div style={{ marginTop: 10 }}>
            {statusBadge(liveToken, t)}
          </div>
        </div>
      )}

      {/* Booked Slots */}
      <div className="section-title">
        <h3>{t('slot.bookedSlots')}</h3>
      </div>

      <div className="card">
        {slots.length === 0 ? (
          <div className="empty">
            <div className="ic">📅</div>
            {t('slot.noSlots')}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('slot.centre')}</th>
                <th>{t('slot.date')}</th>
                <th>{t('slot.window')}</th>
                <th>{t('slot.quantity')}</th>
                <th>{t('slot.token')}</th>
                <th>{t('slot.status')}</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((s) => (
                <tr key={s._id}>
                  <td>{s.centre}</td>

                  <td>{s.date}</td>

                  <td>{s.window}</td>

                  <td>
                    {s.qty} {t('cropReg.quintal')}
                  </td>

                  <td>
                    <code>{s.token}</code>
                  </td>

                  <td>
                    {statusBadge(s, t)}
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
