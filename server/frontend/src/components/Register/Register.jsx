import React, { useState } from 'react';
import Header from '../Header/Header';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({ userName: '', firstName: '', lastName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    const response = await fetch('/djangoapp/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const result = await response.json();
    if (response.ok) { sessionStorage.setItem('username', result.userName); window.location.href = '/'; }
    else setMessage(result.status || 'Registration failed');
  };
  return <><Header /><main className="register_panel"><h1>Create your account</h1><form onSubmit={submit}>
    <label>Username<input name="userName" value={form.userName} onChange={update} required /></label>
    <label>First name<input name="firstName" value={form.firstName} onChange={update} required /></label>
    <label>Last name<input name="lastName" value={form.lastName} onChange={update} required /></label>
    <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
    <label>Password<input name="password" type="password" value={form.password} onChange={update} required minLength="8" /></label>
    <button type="submit">Register</button><p role="alert">{message}</p>
  </form></main></>;
}
