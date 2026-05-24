
import axios from '../config/axios';

export const CatalogoService = {
  // ==========================================
  // CATEGORÍAS
  // ==========================================
  getCategorias: async () => {
    const res = await axios.get('/catalogo/categorias');
    return res.data;
  },
  
  crearCategoria: async (payload: any) => {
    // Como usamos el axios configurado, el token JWT viaja automáticamente acá
    const res = await axios.post('/catalogo/categorias', payload);
    return res.data;
  },
  
  actualizarCategoria: async (id: number, payload: any) => {
    const res = await axios.put(`/catalogo/categorias/${id}`, payload);
    return res.data;
  },

  // ==========================================
  // PRODUCTOS (RECETAS / ESCANDALLOS)
  // ==========================================
  getProductos: async () => {
    const res = await axios.get('/catalogo/productos');
    return res.data;
  },
  
  crearProducto: async (payload: any) => {
    const res = await axios.post('/catalogo/productos', payload);
    return res.data;
  },
  
  actualizarProducto: async (id: number, payload: any) => {
    const res = await axios.put(`/catalogo/productos/${id}`, payload);
    return res.data;
  },

  // ==========================================
  // INGREDIENTES
  // ==========================================
  getIngredientes: async () => {
    const res = await axios.get('/catalogo/ingredientes');
    return res.data;
  }
};