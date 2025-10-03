// frontend/src/components/GalleryModal.js
import { useEffect, useState } from 'react';
import '../styles/GalleryModal.css';

function GalleryModal({ photos, modelId, onClose, onSetProfileImage }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Asegúrate de que las fotos existan y sean válidas al cargar el modal
    useEffect(() => {
        if (!photos || photos.length === 0) {
            console.warn("GalleryModal: No photos provided or empty array.");
            // onClose(); // Podrías cerrar el modal si no hay fotos
            return;
        }
        setCurrentIndex(0); // Reinicia el índice al abrir el modal con nuevas fotos
    }, [photos]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    };

    const currentPhotoUrl = photos && photos.length > 0
        ? `http://localhost:3001${photos[currentIndex]}`
        : '/images/placeholder_model.png'; // Usar un placeholder si no hay fotos

    // Determina si la foto actual ya es la de perfil (la primera)
    const isCurrentPhotoProfile = photos && photos.length > 0 && currentIndex === 0;

    return (
        <div className="gallery-modal-backdrop">
            <div className="gallery-modal-content">
                <button className="gallery-close-button" onClick={onClose}>
                    &times;
                </button>

                {photos && photos.length > 0 ? (
                    <>
                        <div className="gallery-image-container">
                            <img
                                src={currentPhotoUrl}
                                alt={`Galería de imagen ${currentIndex + 1}`}
                                className="gallery-main-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/placeholder_model.png'; // Fallback para imágenes rotas en la galería
                                }}
                            />
                            {photos.length > 1 && ( // Mostrar controles solo si hay más de una foto
                                <>
                                    <button className="gallery-nav-button gallery-prev" onClick={handlePrev}>
                                        &#10094; {/* Carácter de flecha izquierda */}
                                    </button>
                                    <button className="gallery-nav-button gallery-next" onClick={handleNext}>
                                        &#10095; {/* Carácter de flecha derecha */}
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="gallery-controls">
                            {!isCurrentPhotoProfile && ( // Solo mostrar el botón si no es la foto de perfil actual
                                <button
                                    className="btn btn-success mt-3"
                                    onClick={() => onSetProfileImage(modelId, photos[currentIndex])}
                                >
                                    <i className="fas fa-star me-2"></i> Elegir como Perfil
                                </button>
                            )}
                            <p className="gallery-photo-counter mt-2 text-muted">
                                Foto {currentIndex + 1} de {photos.length}
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="text-center">No hay fotos en la galería para este modelo.</p>
                )}
            </div>
        </div>
    );
}

export default GalleryModal;