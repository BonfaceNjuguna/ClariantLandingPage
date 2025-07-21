export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MS_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MS_TENANT_ID}`,
    redirectUri: "http://localhost:5173/",
  },
};
