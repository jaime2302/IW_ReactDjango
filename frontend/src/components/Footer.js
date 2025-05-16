import React from "react";

const Footer = () => (
  <footer className="copyright-footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Zara Management System. Todos los derechos reservados.</p>
        <p className="legal-links">
          <a href="/privacy">Política de Privacidad</a> | 
          <a href="/terms">Términos de Servicio</a>
        </p>
      </div>
    </footer>
);

export default Footer;
