import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Search, ChevronLeft, ChevronRight, CornerDownRight, ToggleLeft, ToggleRight, Layers, Trash2, RotateCcw } from 'lucide-react';
import { CatalogoService } from '../../services/catalogo.service';
import CategoriaModal from '../../components/admin/CategoriaModal';

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<any | null>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const data = await CatalogoService.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async (payload: any) => {
    try {
      if (categoriaEditando) {
        await CatalogoService.actualizarCategoria(categoriaEditando.id, payload);
      } else {
        await CatalogoService.crearCategoria(payload);
      }
      setIsModalOpen(false); // Cierra el modal
      cargarCategorias();    // Recarga la lista
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.detail || 'No se pudo guardar'}`);
    }
  };
  
  // --- INTERRUPTOR VISIBILIDAD (ACTIVO) ---
  const handleToggleVisibilidad = async (cat: any) => {
    try {
      await CatalogoService.actualizarCategoria(cat.id, { activo: !cat.activo });
      cargarCategorias();
    } catch (error) {
      alert("Error al cambiar la visibilidad.");
    }
  };

  // --- SOFT DELETE ---
  const handleSoftDelete = async (id: number) => {
    if (window.confirm('¿Eliminar lógicamente esta categoría?')) {
      try {
        // Asumiendo que el backend maneja el soft-delete vía una ruta específica o patch
        await CatalogoService.actualizarCategoria(id, { eliminado_en: new Date().toISOString() });
        cargarCategorias();
      } catch (error) {
        alert("Error al eliminar.");
      }
    }
  };

  // --- REACTIVAR SOFT DELETE ---
  const handleReactivar = async (id: number) => {
    try {
      await CatalogoService.actualizarCategoria(id, { eliminado_en: null });
      cargarCategorias();
    } catch (error) {
      alert("Error al reactivar.");
    }
  };

  const formatearFecha = (fecha: string | null) => fecha ? new Date(fecha).toLocaleDateString() : '-';

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(c => c.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));
  }, [categorias, filtroNombre]);

  const categoriasPaginadas = categoriasFiltradas.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button onClick={() => { setCategoriaEditando(null); setIsModalOpen(true); }} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20}/> Nueva
        </button>
      </div>

      <input 
        className="mb-4 p-2 border rounded w-full max-w-sm"
        placeholder="Buscar por nombre..."
        onChange={(e) => setFiltroNombre(e.target.value)}
      />

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">Nombre</th>
            <th className="p-4">Estado (Visible)</th>
            <th className="p-4">Modificar</th>
            <th className="p-4">Creado</th>
            <th className="p-4">Modificado</th>
            <th className="p-4">Eliminado</th>
          </tr>
        </thead>
        <tbody>
          {categoriasPaginadas.map(cat => (
            <tr key={cat.id} className="border-t">
              <td className="p-4">
                <div className="font-bold">{cat.nombre}</div>
                {cat.subcategorias?.length > 0 && <div className="text-xs text-blue-500">Tiene {cat.subcategorias.length} sub-categorías</div>}
              </td>
              <td className="p-4 text-center">
                <button onClick={() => handleToggleVisibilidad(cat)}>
                  {cat.activo ? <ToggleRight className="text-green-500" size={32}/> : <ToggleLeft className="text-gray-400" size={32}/>}
                </button>
              </td>
              <td className="p-4 text-center">
                <button onClick={() => { setCategoriaEditando(cat); setIsModalOpen(true); }} className="text-blue-600">
                  <Edit size={20}/>
                </button>
              </td>
              <td className="p-4 text-sm">{formatearFecha(cat.creado_en)}</td>
              <td className="p-4 text-sm">{formatearFecha(cat.actualizado_en)}</td>
              <td className="p-4 text-center">
                {cat.eliminado_en ? (
                  <button onClick={() => handleReactivar(cat.id)} className="text-green-600 flex items-center gap-1">
                    <RotateCcw size={16}/> Reactivar
                  </button>
                ) : (
                  <button onClick={() => handleSoftDelete(cat.id)} className="text-red-500">
                    <Trash2 size={20}/>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && <CategoriaModal categoria={categoriaEditando} categoriasDisponibles={categorias} onClose={() => setIsModalOpen(false)} onSave={handleGuardar} />}
    </div>
  );
}