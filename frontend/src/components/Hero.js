import React from "react";
import logo from "../assets/logo-zara.png";
import "../Hero.css"; // Asegúrate de tener este archivo CSS


const Hero = () => (
  <div className="hero-container">
    {/* Video Banner */}
    <div className="youtube-banner">
      <div autoPlay muted loop playsInline className="video-container">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube-nocookie.com/embed/gKCmezkfWbE?autoplay=1&mute=1&loop=1&playlist=gKCmezkfWbE&controls=0&modestbranding=1&rel=0&showinfo=0"
          title="ZARA WOMAN | Spring Summer 2021 Campaign"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="video-overlay">
        <img className="app-logo" src={logo} alt="Logo Zara" width="120" />
        <h1>Bienvenido a Zara Management</h1>
        <p className="lead">
          Sistema integral de gestión de tiendas, productos y personal
        </p>
      </div>
    </div>

    {/* Contenido principal */}
    <div className="main-content container my-5">
      <h2 className="mb-4">Funcionalidades principales (para administradores)</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Gestión de Personal</h3>
          <p>Administra toda la información de tus empleados de forma centralizada.</p>
        </div>
        <div className="feature-card">
          <h3>Control de Tiendas</h3>
          <p>Supervisa todas tus tiendas y su información relevante.</p>
        </div>
        <div className="feature-card">
          <h3>Inventario de Productos</h3>
          <p>Mantén un control preciso de tu catálogo de productos.</p>
        </div>
      </div>
    </div>

    <div className="main-content container my-5">
      <h2 className="mb-4">Funcionalidades principales (para clientes)</h2>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Marketplace</h3>
          <p>Haz tus compras de una manera sencilla.</p>
        </div>
      </div>
    </div>    
  </div>
);

export default Hero;