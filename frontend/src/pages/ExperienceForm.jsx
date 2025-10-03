// frontend/src/components/ExperienceForm.js
import { useEffect, useState } from 'react';
import { createExperience } from '../services/api'; // Importa la función desde tu api.js

function ExperienceForm({ modelId, onDataSaved }) {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha_evento: '', // Formato YYYY-MM-DD
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Reinicia el formulario si cambia el modelId
    useEffect(() => {
        setFormData({
            titulo: '', descripcion: '', fecha_evento: '',
        });
        setError(null);
        setSuccessMessage(null);
    }, [modelId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!modelId) {
            setError("Primero debes registrar un modelo.");
            setLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
            modelo_id: modelId, // Asocia la experiencia al ID del modelo
        };

        try {
            const result = await createExperience(dataToSend); // Llama a la API
            setSuccessMessage(`Experiencia "${result.titulo}" guardada para el modelo ID: ${modelId}`);
            onDataSaved(); // Notifica al padre que se guardaron datos
            // Opcional: Reiniciar el formulario después de guardar para añadir otra experiencia
            setFormData({
                titulo: '', descripcion: '', fecha_evento: '',
            });
        } catch (err) {
            setError(err.message);
            console.error("Error saving experience:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white"> {/* Color distinto para diferenciar */}
                <h5 className="mb-0">3. Registrar Experiencias {modelId && `(Modelo ID: ${modelId})`}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="titulo" className="form-label">Título de la Experiencia</label>
                        <input
                            type="text"
                            className="form-control"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fecha_evento" className="form-label">Fecha del Evento</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fecha_evento"
                            name="fecha_evento"
                            value={formData.fecha_evento}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <button type="submit" className="btn btn-success text-white" disabled={loading || !modelId}>
                        {loading ? 'Guardando...' : 'Guardar Experiencia'}
                    </button>
                </form>

                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
}

export default ExperienceForm;