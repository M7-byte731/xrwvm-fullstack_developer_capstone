import React from 'react';
import '../assets/style.css';
import '../assets/bootstrap.min.css';

export default function Header() {
  const username = sessionStorage.getItem('username');
  const djangoPage = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '';
  const logout = async () => {
    await fetch('/djangoapp/logout');
    sessionStorage.clear();
    window.location.href = '/';
  };
  return <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'darkturquoise', minHeight: '1in' }}><div className="container-fluid">
    <h2 style={{ paddingRight: '5%' }}>Dealerships</h2><div className="navbar-nav me-auto">
      <a className="nav-link" href="/">Home</a><a className="nav-link" href={`${djangoPage}/about`}>About Us</a><a className="nav-link" href={`${djangoPage}/contact`}>Contact Us</a>
    </div><div className="d-flex align-items-center gap-3">{username ? <><span className="username">{username}</span><button className="btn btn-outline-dark" onClick={logout}>Logout</button></> : <><a href="/login">Login</a><a href="/register">Register</a></>}</div>
  </div></nav>;
}
