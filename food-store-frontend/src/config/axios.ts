import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR DE PETICIONES (Agrega el Token directo del LocalStorage)
api.interceptors.request.use(
  (config) => {
    let token = null;

    // 1. Leemos directamente del Local Storage para evitar el delay de Zustand
    const authStorageStr = localStorage.getItem('auth-store'); 
    
    if (authStorageStr) {
      try {
        const parsedData = JSON.parse(authStorageStr);
        token = parsedData.state?.token;
      } catch (error) {
        console.error("Error parseando el token", error);
      }
    }

    // 2. Fallback: Si no lo encontró en Local Storage, intentamos con el Store
    if (!token) {
      token = useAuthStore.getState().token;
    }
    
   if (token && config.headers) {
      // Le avisamos a la consola para auditar
      console.log("🔑 [AXIOS] Enviando petición a:", config.url, "con token:", token.substring(0, 15) + "...");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ [AXIOS] CUIDADO: Haciendo petición SIN TOKEN a:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR DE RESPUESTAS (Maneja si el token expiró )
api.interceptors.request.use(
  (config) => {
    // Si la URL es login, no hacemos nada
    if (config.url?.includes('/login')) return config;

    const authStore = localStorage.getItem('food-store-auth');
    let token = null;

    if (authStore) {
      const parsed = JSON.parse(authStore);
      token = parsed.state?.token;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
     // console.log("✅ Token inyectado correctamente");
    } else {
      //console.warn("❌ Petición sin token en:", config.url);
    }
    return config;
  }
);

export default api;