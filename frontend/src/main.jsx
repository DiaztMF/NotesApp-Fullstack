import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${import.meta.env.VITE_FRONTEND_BASEURL}/sign-in`,
        audience: "https://dev-vrmrrfejyibrxngp.us.auth0.com/api/v2/",
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
