// frontend/src/pages/Dashboard.js
import { useEffect, useState } from 'react';
import AnthropometricForm from '../pages/AnthropometricForm';
import ExperienceForm from '../pages/ExperienceForm';
import GalleryModal from '../pages/GalleryModal'; // <--- NUEVA IMPORTACIÓN DEL MODAL DE GALERÍA
import ModelCard from '../pages/ModelCard'; // <--- CORREGIDO: Importación desde 'components'
import ModelForm from '../pages/ModelForm';
import Sidebar from '../pages/sidebar';

// Importa las funciones API desde tu api.js
import { deleteModel, getModels } from '../services/api'; // Asegúrate de que tu api.js incluya la función para actualizar el perfil

function Dashboard() {
  const [activeTab, setActiveTab] = useState('view');
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [loadingModels, setLoadingModels] = useState(false);
  const [errorModels, setErrorModels] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- NUEVOS ESTADOS PARA EL MODAL DE GALERÍA ---
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentGalleryPhotos, setCurrentGalleryPhotos] = useState([]);
  const [currentModelInGalleryId, setCurrentModelInGalleryId] = useState(null);
  // --- FIN NUEVOS ESTADOS ---

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchModels = async () => {
    setLoadingModels(true);
    setErrorModels(null);
    try {
      const data = await getModels();
      setModels(data);
    } catch (err) {
      setErrorModels(err.message);
      console.error("Error fetching models:", err);
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchModels();
    }
  }, [activeTab]);

  const handleModelCreated = (newModelId) => {
    setSelectedModelId(newModelId);
    alert(`Modelo registrado con éxito. ID: ${newModelId}. Ahora puedes añadir datos adicionales.`);
    fetchModels(); // Recargar la lista de modelos para incluir el nuevo
  };

  const handleDataSaved = () => {
    fetchModels(); // Recargar modelos después de guardar datos adicionales
  };

  const handleDeleteModel = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${nombre}? Esta acción es irreversible y eliminará todos sus datos asociados (antropométricos y experiencias).`)) {
      setLoadingModels(true);
      try {
        await deleteModel(id);
        alert(`Modelo ${nombre} eliminado con éxito.`);
        fetchModels(); // Recargar la lista después de eliminar
      } catch (err) {
        setErrorModels(err.message);
        alert(`Error al eliminar modelo: ${err.message}`);
        console.error("Error deleting model:", err);
      } finally {
        setLoadingModels(false);
      }
    }
  };

  // --- NUEVAS FUNCIONES PARA LA GALERÍA ---

  // Función que se pasa a ModelCard para abrir el modal de la galería
  const handleViewGallery = (modelId, photos) => {
    setCurrentModelInGalleryId(modelId);
    setCurrentGalleryPhotos(photos);
    setShowGalleryModal(true);
  };

  // Función para cerrar el modal de la galería
  const handleCloseGallery = () => {
    setShowGalleryModal(false);
    setCurrentGalleryPhotos([]); // Limpiar fotos al cerrar
    setCurrentModelInGalleryId(null); // Limpiar ID del modelo
  };

  // Función para establecer una nueva imagen de perfil (hace la llamada a la API)
  const handleSetProfileImage = async (modelId, newRelativeImageUrl) => { // newRelativeImageUrl es como '/uploads/images/abc.jpg'
    try {
      // Asumo que tu api.js tendrá una función para esta llamada
      const response = await fetch(`http://localhost:3001/api/modelos/${modelId}/set-profile-image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newImageUrl: newRelativeImageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Si la actualización es exitosa, volvemos a cargar los modelos para reflejar el cambio
      await fetchModels();
      handleCloseGallery(); // Cierra el modal después de actualizar
      alert('¡Imagen de perfil actualizada exitosamente!');

    } catch (error) {
      console.error("Error al actualizar la imagen de perfil:", error);
      alert(`Error al establecer la imagen de perfil: ${error.message}`);
    }
  };

  // --- FIN DE NUEVAS FUNCIONES ---

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <br />

      <main className="main-content container-fluid px-4 pt-5 pt-md-0">
        <div className="row justify-content-center">
          <div className="col-lg-10">

            <h2 className="mb-4">Panel de Administración de Modelos</h2>

            <ul className="nav nav-pills mb-4 justify-content">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>
                  Ver Modelos
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
                  Registrar Nuevo Modelo
                </button>
              </li>
            </ul>

            {activeTab === 'view' && (
              <div className="row">
                <div className="col-md-12">
                  <div className="card shadow-sm">
                    <div className="card-header text-center">
                      <h4 className="mb-0 titulo-modelos">Modelos registrados</h4>
                    </div>
                    <div className="card-body">
                      {loadingModels ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          <p className="mt-2">Cargando modelos...</p>
                        </div>
                      ) : errorModels ? (
                        <div className="alert alert-danger text-center">
                          <strong>Error al cargar modelos:</strong> {errorModels}
                          <p className="mt-2">Por favor, asegúrate de que el servidor backend esté funcionando.</p>
                        </div>
                      ) : models.length === 0 ? (
                        <div className="alert alert-info text-center">
                          No hay modelos registrados. ¡Empieza a añadir uno!
                        </div>
                      ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
                          {models.map(model => (
                            <ModelCard
                              key={model._id} // Usamos _id para consistencia con MongoDB
                              model={model}
                              onDeleteModel={handleDeleteModel}
                              onViewGallery={handleViewGallery} // Pasamos la nueva función para abrir la galería
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'register' && (
              <div className="row justify-content-center">
                <div className="col-md-10">
                  <ModelForm onModelCreated={handleModelCreated} />

                  {selectedModelId ? (
                    <>
                      <AnthropometricForm modelId={selectedModelId} onDataSaved={handleDataSaved} />
                      <ExperienceForm modelId={selectedModelId} onDataSaved={handleDataSaved} />
                      <div className="alert alert-info mt-4 text-center">
                        Modelo ID actual para añadir datos: <strong>{selectedModelId}</strong>.
                        <br />Puedes continuar añadiendo experiencias o cambiar a la vista de modelos.
                      </div>
                    </>
                  ) : (
                    <div className="alert alert-warning mt-4 text-center">
                      Completa el formulario "Registrar Nuevo Modelo" primero para poder añadir datos antropométricos y experiencias.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Renderiza el GalleryModal si showGalleryModal es true */}
      {showGalleryModal && (
        <GalleryModal
          photos={currentGalleryPhotos}
          modelId={currentModelInGalleryId}
          onClose={handleCloseGallery}
          onSetProfileImage={handleSetProfileImage} // Pasa la función para establecer la imagen de perfil
        />
      )}
    </>
  );
}

export default Dashboard;