import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const RegisterPage = () => {
  const [name, setName]                     = useState('')
  const [email, setEmail]                   = useState('')
  const [password, setPassword]             = useState('')
  const [passwordConf, setPasswordConf]     = useState('')
  const [error, setError]                   = useState('')
  const [loading, setLoading]               = useState(false)

  const navigate = useNavigate()

  const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== passwordConf) {
      setError('Password dan konfirmasi tidak cocok')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConf
      })

      localStorage.setItem('token', response.data.access_token)
      navigate('/dashboard')

    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const firstError = Object.values(errors)[0][0]
        setError(firstError)
      } else {
        setError(err.response?.data?.message || 'Registrasi gagal')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">

        <p className="tanggal">{tanggalHariIni}</p>
        <h2>Daftar ke TaskHub+</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              placeholder="Ulangi password"
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Sudah punya akun? <Link to="/login">Masuk</Link></p>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage