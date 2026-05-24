import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Estructura de rol tal como la devuelve el backend (UsuarioPublic > RolPublic)
export interface RolPublic {
  codigo: string;  // 'ADMIN' | 'GESTOR_STOCK' | 'GESTOR_PEDIDOS' | 'CLIENTE'
  nombre: string;
  descripcion?: string;
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  cel?: string;
  activo?: boolean;
  roles?: RolPublic[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // Acciones
  setLogin: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setLogin: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'food-store-auth', // Se guarda en localStorage
    }
  )
);