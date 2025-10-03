// frontend/src/components/ModelCard.js
import { useState } from 'react';

// Asegúrate de que onDeleteModel y onViewGallery se pasen como props
function ModelCard({ model, onDeleteModel, onViewGallery }) { // Añadido onViewGallery
    console.log('Datos del modelo en ModelCard:', model);
    console.log('Array fotos_book:', model.fotos_book);
    const [isExperiencesCollapsed, setIsExperiencesCollapsed] = useState(true);

    const primeraFotoUrl = model.fotos_book && model.fotos_book.length > 0
        ? `http://localhost:3001${model.fotos_book.at(0)}`
        : '/images/placeholder_model.png';

    console.log('URL de la primera foto construida:', primeraFotoUrl);

    return (
        <div className="col">
            <div className="card h-100 border-0 shadow-sm model-card">
                <div className="card-body text-center d-flex flex-column">
                    <img
                        src={primeraFotoUrl} // Esta URL debe apuntar a tu nueva imagen de alta resolución
                        alt={model.nombre_completo}
                        className="img-fluid mb-3 rounded modelo-imagen-perfil modelo-imagen-zoomable"
                        style={{
                            width: '500px',
                            height: '500px',
                            objectFit: 'cover',
                            margin: '0 auto',
                            transition: 'transform 0.3s ease-in-out'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder_model.png'; // Asegúrate de que este placeholder también sea de buena calidad (ej. 150x150px)
                            e.target.className = "img-fluid mb-3 rounded modelo-imagen-perfil";
                            console.error(`Error al cargar la imagen para ${model.nombre_completo}: ${primeraFotoUrl}`);
                        }}
                    />

                    <h5 className="card-title text-primary mt-2 mb-1">{model.nombre_completo}</h5>
                    <p className="card-text text-muted small mb-2">
                        {model.genero} | {model.edad} años
                        <br />Celular: {model.celular}
                        <br />Email: {model.email_contacto}
                    </p>

                    {model.redes_sociales && model.redes_sociales.instagram && (
                        <a href={model.redes_sociales.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm mx-1 mb-2 d-inline-flex align-items-center justify-content-center">
                            <i className="fab fa-instagram me-2"></i> Instagram
                        </a>
                    )}

                    {/* Botón Ver Galería - AHORA LLAMA A onViewGallery */}
                    {model.fotos_book && model.fotos_book.length > 1 && (
                        <button
                            className="btn btn-success btn-sm mx-1 mb-2"
                            onClick={() => onViewGallery(model.id, model.fotos_book)} // Pasa el ID del modelo y sus fotos
                        >
                            <i className="fas fa-images me-2"></i> Ver Galería
                        </button>
                    )}

                    {model.datos_antropometricos && (
                        <div className="mt-3 text-start border-top pt-3 flex-grow-1">
                            <h6 className="text-secondary mb-2">Datos Antropométricos:</h6>
                            <ul className="list-unstyled small mb-0">
                                {model.datos_antropometricos.cintura && (
                                    <li><strong>Cintura:</strong> {model.datos_antropometricos.cintura}</li>
                                )}
                                {model.datos_antropometricos.cadera && (
                                    <li><strong>Cadera:</strong> {model.datos_antropometricos.cadera}</li>
                                )}
                                {model.datos_antropometricos.busto && (
                                    <li><strong>Busto:</strong> {model.datos_antropometricos.busto}</li>
                                )}
                                {model.datos_antropometricos.talla_camisa && (
                                    <li><strong>Talla Camisa:</strong> {model.datos_antropometricos.talla_camisa}</li>
                                )}
                                {model.datos_antropometricos.talla_general && (
                                    <li><strong>Talla General:</strong> {model.datos_antropometricos.talla_general}</li>
                                )}
                                {model.datos_antropometricos.talla_zapato && (
                                    <li><strong>Talla Zapato:</strong> {model.datos_antropometricos.talla_zapato}</li>
                                )}
                                {model.datos_antropometricos.color_ojos && (
                                    <li><strong>Ojos:</strong> {model.datos_antropometricos.color_ojos}</li>
                                )}
                                {model.datos_antropometricos.altura && (
                                    <li><strong>Altura:</strong> {model.datos_antropometricos.altura} cm</li>
                                )}
                                {model.datos_antropometricos.peso && (
                                    <li><strong>Peso:</strong> {model.datos_antropometricos.peso} kg</li>
                                )}
                                {model.datos_antropometricos.tatuajes_marcas && <li><strong>Tatuajes/Marcas:</strong> {model.datos_antropometricos.tatuajes_marcas}</li>}
                            </ul>
                        </div>
                    )}

                    {model.experiencias && model.experiencias.length > 0 && (
                        <div className="mt-3 text-start border-top pt-3">
                            <h6 className="text-secondary d-flex justify-content-between align-items-center">
                                Experiencias:
                                <button
                                    className="btn btn-sm text-secondary"
                                    onClick={() => setIsExperiencesCollapsed(!isExperiencesCollapsed)}
                                    aria-expanded={!isExperiencesCollapsed}
                                    aria-controls={`collapseExperiences-${model.id}`}
                                >
                                    {isExperiencesCollapsed ? (
                                        <i className="fas fa-chevron-down"></i>
                                    ) : (
                                        <i className="fas fa-chevron-up"></i>
                                    )}
                                </button>
                            </h6>
                            <div className={`collapse ${!isExperiencesCollapsed ? 'show' : ''}`} id={`collapseExperiences-${model.id}`}>
                                <ul className="list-unstyled small mb-0">
                                    {model.experiencias.map((exp, index) => (
                                        <li key={exp.id || index} className="mb-1">
                                            <strong>{exp.titulo}</strong> {exp.fecha_evento ? `(${new Date(exp.fecha_evento).toLocaleDateString()})` : ''}
                                            <br />{exp.descripcion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {isExperiencesCollapsed && model.experiencias.length > 2 && (
                                <p className="small text-muted mt-2 mb-0">
                                    Haz clic para ver más experiencias.
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        className="btn btn-danger btn-sm mt-3"
                        onClick={() => onDeleteModel(model.id, model.nombre_completo)}
                    >
                        <i className="fas fa-trash-alt me-2"></i>Eliminar Modelo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModelCard;