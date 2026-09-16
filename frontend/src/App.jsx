import React, { useState, useEffect, useCallback } from 'react';
import api from './api.js';
import socket from './socket.js';
import RoleGate from './components/RoleGate.jsx';
import LanguageGate from './components/LanguageGate.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Toast from './components/Toast.jsx';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext.jsx';

import FarmerDashboard from './pages/farmer/Dashboard.jsx';
import Registration from './pages/farmer/Registration.jsx';
import CropRegistration from './pages/farmer/CropRegistration.jsx';
import SlotBooking from './pages/farmer/SlotBooking.jsx';
import Centres from './pages/farmer/Centres.jsx';
import Status from './pages/farmer/Status.jsx';
import Payment from './pages/farmer/Payment.jsx';
import Market from './pages/farmer/Market.jsx';
import Documents from './pages/farmer/Documents.jsx';
import Notifications from './pages/farmer/Notifications.jsx';
import Help from './pages/farmer/Help.jsx';

import OperatorDashboard from './pages/operator/OperatorDashboard.jsx';
import OperatorBookings from './pages/operator/OperatorBookings.jsx';
import OperatorQuality from './pages/operator/OperatorQuality.jsx';

import OfficerCentres from './pages/officer/OfficerCentres.jsx';
import OfficerAlerts from './pages/officer/OfficerAlerts.jsx';
import OfficerReports from './pages/officer/OfficerReports.jsx';

const FARMER_ID_KEY = 'kisanslot_farmer_id';

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}

function AppInner() {
  const { lang } = useLanguage();
  const [showLanguageGate, setShowLanguageGate] = useState(false);
  const [role, setRole] = useState(null);
  const [active, setActive] = useState('dashboard');
  const [liveConnected, setLiveConnected] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const [farmer, setFarmerState] = useState(null);
  const [crops, setCrops] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [allSlots, setAllSlots] = useState([]);
  const [centres, setCentres] = useState([]);

  const showToast = (text) => {
    setToastMsg(text);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const setFarmer = (f) => {
    setFarmerState(f);
    if (f?._id) localStorage.setItem(FARMER_ID_KEY, f._id);
  };

  const refreshCrops = useCallback((farmerId) => {
    const id = farmerId || farmer?._id;
    if (!id) return;
    api.get('/crops', { params: { farmerId: id } }).then((res) => setCrops(res.data));
  }, [farmer]);

  const refreshMySlots = useCallback((farmerId) => {
    const id = farmerId || farmer?._id;
    if (!id) return;
    api.get('/slots', { params: { farmerId: id } }).then((res) => setMySlots(res.data));
  }, [farmer]);

  const refreshDocuments = useCallback((farmerId) => {
    const id = farmerId || farmer?._id;
    if (!id) return;
    api.get('/documents', { params: { farmerId: id } }).then((res) => setDocuments(res.data));
  }, [farmer]);

  const refreshNotifications = useCallback((farmerId) => {
    const id = farmerId || farmer?._id;
    if (!id) return;
    api.get('/notifications', { params: { farmerId: id } }).then((res) => setNotifications(res.data));
  }, [farmer]);

  const refreshAllSlots = useCallback(() => {
    api.get('/slots').then((res) => setAllSlots(res.data));
  }, []);

  const refreshCentres = useCallback(() => {
    api.get('/centres').then((res) => setCentres(res.data));
  }, []);

  // Restore farmer session on load
  useEffect(() => {
    const id = localStorage.getItem(FARMER_ID_KEY);
    if (id) {
      api.get(`/farmers/${id}`).then((res) => {
        if (res.data) setFarmerState(res.data);
      }).catch(() => {});
    }
    refreshCentres();
  }, []);

  useEffect(() => {
    if (farmer?._id) {
      refreshCrops(farmer._id);
      refreshMySlots(farmer._id);
      refreshDocuments(farmer._id);
      refreshNotifications(farmer._id);
    }
  }, [farmer]);

  useEffect(() => {
    if (role === 'operator' || role === 'officer') {
      refreshAllSlots();
      refreshCentres();
    }
  }, [role]);

  // ---------- Socket.io real-time listeners ----------
  useEffect(() => {
    const onConnect = () => setLiveConnected(true);
    const onDisconnect = () => setLiveConnected(false);

    const onSlotCreated = (slot) => {
      setAllSlots((prev) => [slot, ...prev]);
      if (farmer?._id && slot.farmer?._id === farmer._id) {
        setMySlots((prev) => [slot, ...prev]);
      }
    };
    const onSlotUpdated = (slot) => {
      setAllSlots((prev) => prev.map((s) => (s._id === slot._id ? slot : s)));
      setMySlots((prev) => prev.map((s) => (s._id === slot._id ? slot : s)));
    };
    const onCentreUpdated = (centre) => {
      setCentres((prev) => prev.map((c) => (c._id === centre._id ? centre : c)));
    };
    const onNotification = (notif) => {
      const notifFarmerId = notif.farmer?._id || notif.farmer;
      if (role === 'farmer' && farmer?._id && notifFarmerId === farmer._id) {
        setNotifications((prev) => [notif, ...prev]);
        showToast(notif.text);
      } else if (role === 'operator' && notif.audience === 'operator') {
        showToast(notif.text);
      } else if (role === 'officer' && notif.audience === 'officer') {
        showToast(notif.text);
      }
    };
    const onCropCreated = (crop) => {
      if (farmer?._id && crop.farmer === farmer._id) {
        setCrops((prev) => [crop, ...prev]);
      }
    };
    const onDocCreated = (doc) => {
      if (farmer?._id && doc.farmer === farmer._id) {
        setDocuments((prev) => [doc, ...prev]);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('slot:created', onSlotCreated);
    socket.on('slot:updated', onSlotUpdated);
    socket.on('centre:updated', onCentreUpdated);
    socket.on('notification:new', onNotification);
    socket.on('crop:created', onCropCreated);
    socket.on('document:created', onDocCreated);

    if (socket.connected) setLiveConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('slot:created', onSlotCreated);
      socket.off('slot:updated', onSlotUpdated);
      socket.off('centre:updated', onCentreUpdated);
      socket.off('notification:new', onNotification);
      socket.off('crop:created', onCropCreated);
      socket.off('document:created', onDocCreated);
    };
  }, [farmer, role]);

  if (!lang || showLanguageGate) {
    return <LanguageGate onChosen={() => setShowLanguageGate(false)} />;
  }

  if (!role) {
    return (
      <RoleGate
        onBack={() => setShowLanguageGate(true)}
        onChoose={(r) => {
          setRole(r);
          setActive(r === 'farmer' ? 'dashboard' : r === 'operator' ? 'op-dashboard' : 'off-centres');
        }}
      />
    );
  }

  const renderFarmerPage = () => {
    switch (active) {
      case 'dashboard': return <FarmerDashboard crops={crops} slots={mySlots} onNavigate={setActive} />;
      case 'registration': return <Registration farmer={farmer} setFarmer={setFarmer} showToast={showToast} />;
      case 'crop': return <CropRegistration farmer={farmer} crops={crops} refreshCrops={refreshCrops} showToast={showToast} />;
      case 'slot': return <SlotBooking farmer={farmer} crops={crops} slots={mySlots} refreshSlots={refreshMySlots} showToast={showToast} />;
      case 'centres': return <Centres centres={centres} />;
      case 'status': return <Status slots={mySlots} />;
      case 'payment': return <Payment slots={mySlots} />;
      case 'market': return <Market />;
      case 'documents': return <Documents farmer={farmer} documents={documents} refreshDocuments={refreshDocuments} showToast={showToast} />;
      case 'notifications': return <Notifications notifications={notifications} />;
      case 'help': return <Help farmer={farmer} showToast={showToast} />;
      default: return null;
    }
  };

  const renderOperatorPage = () => {
    switch (active) {
      case 'op-dashboard': return <OperatorDashboard allSlots={allSlots} />;
      case 'op-bookings': return <OperatorBookings allSlots={allSlots} refreshAllSlots={refreshAllSlots} showToast={showToast} />;
      case 'op-quality': return <OperatorQuality allSlots={allSlots} refreshAllSlots={refreshAllSlots} showToast={showToast} />;
      default: return null;
    }
  };

  const renderOfficerPage = () => {
    switch (active) {
      case 'off-centres': return <OfficerCentres centres={centres} showToast={showToast} />;
      case 'off-alerts': return <OfficerAlerts centres={centres} showToast={showToast} />;
      case 'off-reports': return <OfficerReports allSlots={allSlots} crops={crops} />;
      default: return null;
    }
  };

  return (
    <div id="app">
      <Sidebar role={role} active={active} onNavigate={setActive} liveConnected={liveConnected} />
      <main className="content">
        <Topbar
          role={role}
          active={active}
          farmer={farmer}
          onSwitchRole={() => setRole(null)}
        />
        {role === 'farmer' && renderFarmerPage()}
        {role === 'operator' && renderOperatorPage()}
        {role === 'officer' && renderOfficerPage()}
      </main>
      <Toast message={toastMsg} />
    </div>
  );
}
