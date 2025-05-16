import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../assets/logo-zara.png'; // Asegúrate de tener el logo en esta ruta

const NavBar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const isAdmin = user && user['www.zara.example.com/roles']?.includes("admin");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Logo Zara */}
        <NavLink to="/" className="navbar-brand">
          <img 
            src={logo} 
            alt="Zara Logo" 
            style={{ height: '40px' }} 
          />
        </NavLink>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
                end
              >
                Inicio
              </NavLink>
            </li>
            
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    Perfil
                  </NavLink>
                </li>
                
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <NavLink 
                        to="/personal" 
                        className={({ isActive }) => 
                          `nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        Personal
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <span className="navbar-text me-3">
                  Hola, {user.nickname}
                </span>
                <button 
                  className="btn btn-outline-light" 
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button 
                className="btn btn-primary" 
                onClick={() => loginWithRedirect()}
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;