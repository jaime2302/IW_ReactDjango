import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { getConfig } from './config';

const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
  // Añadimos claims de roles
  advancedOptions: {
    defaultScope: 'openid profile email read:current_user update:current_user_metadata',
  },
  // Para persistir la sesión
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <div className="app-layout">
        <App />
      </div>
    </Auth0Provider>
  </React.StrictMode>
);