import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';
import api from '../api/axios';

const DashboardPage = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPrioritas, setFilterPrioritas] = useState('');
  const [sortDeadline, setSortDeadline] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [deadline, setDeadline] = useState('');
  const [prioritas, setPrioritas] = useState('rendah');

  const formatKeIndonesia = (dateStr) => {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}/${mm}/${yyyy}`;
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterPrioritas) params.prioritas = filterPrioritas;
      if (sortDeadline) params.sort = 'deadline';
      
      const response = await api.get('/tasks', { params });
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError('Gagal mengambil data task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterPrioritas, sortDeadline]);

  const handleTambahTask = async (e) => {
    e.preventDefault();
    if (!judul || !deadline) {
      alert('Judul dan Deadline wajib diisi!');
      return;
    }

    const payload = {
      judul,
      deskripsi,
      tanggal_deadline: formatKeIndonesia(deadline),
      prioritas
    };

    try {
      await api.post('/tasks', payload);
      setJudul('');
      setDeskripsi('');
      setDeadline('');
      setPrioritas('rendah');
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      alert('Gagal menambah task');
    }
  };

  const handleSelesaikan = async (id) => {
    try {
      await api.put(`/tasks/${id}/selesaikan`);
      fetchTasks();
    } catch (err) {
      console.error('Gagal memperbarui status');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout gagal');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>TaskHub+</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">Dashboard</li>
          </ul>
        </nav>
        <div className="sidebar-footer">
           <button className="btn-logout-alt" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="main-content">
        <nav className="navbar">
          <div className="navbar-user">
            <span>Selamat datang, <strong>Arief</strong></span>
          </div>
          <div className="navbar-date">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </nav>

        <main className="content-area">
          <section className="stats-container">
            <div className="stat-card">
              <span>Total Task</span>
              <h3>{tasks.length}</h3>
            </div>
            <div className="stat-card">
              <span>Selesai</span>
              <h3>{tasks.filter(t => t.status === 'selesai').length}</h3>
            </div>
            <div className="stat-card">
              <span>Butuh Perhatian</span>
              <h3>{tasks.filter(t => t.butuh_perhatian).length}</h3>
            </div>
          </section>
          <section className="filter-bar">
            <div className="filter-group">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Semua Status</option>
                <option value="selesai">Selesai</option>
                <option value="belum_selesai">Belum Selesai</option>
              </select>

              <select value={filterPrioritas} onChange={(e) => setFilterPrioritas(e.target.value)}>
                <option value="">Semua Prioritas</option>
                <option value="tinggi">Tinggi</option>
                <option value="sedang">Sedang</option>
                <option value="rendah">Rendah</option>
              </select>
            </div>

            <label className="checkbox-label">
              <input type="checkbox" checked={sortDeadline} onChange={(e) => setSortDeadline(e.target.checked)} />
              Urutkan Deadline
            </label>
          </section>

          <div className="task-grid">
            {tasks.length === 0 && !loading && (
              <div className="empty-state">Belum ada task. Tambahkan task pertamamu!</div>
            )}
            {loading ? <div className="loading-text">Memuat data...</div> : tasks.map(task => (
              <div key={task.id} className={`task-card-modern ${task.prioritas}`}>
                <div className="task-body">
                  <div className="task-header">
                    <span className={`badge-status ${task.status}`}>{task.status.replace('_', ' ')}</span>
                    <span className={`badge-priority ${task.prioritas}`}>{task.prioritas}</span>
                  </div>
                  <p>{task.deskripsi}</p>
                  <div className="task-footer">
                    <span className="deadline-text">📅 {task.tanggal_deadline}</span>
                    {task.status !== 'selesai' && (
                      <button className="btn-done" onClick={() => handleSelesaikan(task.id)}>Selesaikan</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="floating-form-container">
            <button className={`btn-toggle-main ${showForm ? 'active' : ''}`} onClick={() => setShowForm(!showForm)}>
              {showForm ? '× Tutup' : '+ Tambah Task'}
            </button>

            {showForm && (
              <form className="modern-form" onSubmit={handleTambahTask}>
                <h3>Tambah Tugas Baru</h3>
                <div className="form-group">
                  <input type="text" placeholder="Judul Task" value={judul} onChange={(e) => setJudul(e.target.value)} required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Deskripsi Singkat" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Deadline</label>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                  </div>
                  <div className="form-group flex-1">
                    <label>Prioritas</label>
                    <select value={prioritas} onChange={(e) => setPrioritas(e.target.value)}>
                      <option value="tinggi">Tinggi</option>
                      <option value="sedang">Sedang</option>
                      <option value="rendah">Rendah</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-submit-modern">Simpan Sekarang</button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;