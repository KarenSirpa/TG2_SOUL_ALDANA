// frontend/src/components/AnthropometricForm.js
import { useEffect, useState } from 'react';
import { createAnthropometricData } from '../services/api'; // Importa la función desde tu api.js

function AnthropometricForm({ modelId, onDataSaved }) {
    const [formData, setFormData] = useState({
        cintura: '',
        cadera: '',
        busto: '',
        talla_camisa: '',
        talla_general: '',
        talla_zapato: '',
        color_ojos: '',
        altura: '',
        peso: '',
        tatuajes_marcas: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Reinicia el formulario si cambia el modelId
    useEffect(() => {
        setFormData({
            cintura: '', cadera: '', busto: '', talla_camisa: '', talla_general: '',
            talla_zapato: '', color_ojos: '', altura: '', peso: '', tatuajes_marcas: '',
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
            modelo_id: modelId, // Asocia los datos al ID del modelo
            altura: parseFloat(formData.altura), // Asegura que sean números
            peso: parseFloat(formData.peso),
            cintura: parseFloat(formData.cintura),
            cadera: parseFloat(formData.cadera),
            busto: parseFloat(formData.busto),
        };

        try {
            const result = await createAnthropometricData(dataToSend); // Llama a la API
            setSuccessMessage(`Datos antropométricos guardados para el modelo ID: ${modelId}`);
            onDataSaved(); // Notifica al padre que se guardaron datos
        } catch (err) {
            setError(err.message);
            console.error("Error saving anthropometric data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white">
                <h5 className="mb-0">2. Registrar Datos Antropométricos {modelId && `(Modelo ID: ${modelId})`}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="cintura" className="form-label">Cintura (cm)</label>
                            <input type="number" step="0.1" className="form-control" id="cintura" name="cintura" value={formData.cintura} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="cadera" className="form-label">Cadera (cm)</label>
                            <input type="number" step="0.1" className="form-control" id="cadera" name="cadera" value={formData.cadera} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="busto" className="form-label">Busto (cm)</label>
                            <input type="number" step="0.1" className="form-control" id="busto" name="busto" value={formData.busto} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="talla_camisa" className="form-label">Talla Camisa</label>
                            <input type="text" className="form-control" id="talla_camisa" name="talla_camisa" value={formData.talla_camisa} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="talla_general" className="form-label">Talla General (ej. S, M, L, XL)</label>
                            <input type="text" className="form-control" id="talla_general" name="talla_general" value={formData.talla_general} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="talla_zapato" className="form-label">Talla Zapato</label>
                            <input type="text" className="form-control" id="talla_zapato" name="talla_zapato" value={formData.talla_zapato} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="color_ojos" className="form-label">Color de Ojos</label>
                            <input type="text" className="form-control" id="color_ojos" name="color_ojos" value={formData.color_ojos} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="altura" className="form-label">Altura (cm)</label>
                            <input type="number" step="0.1" className="form-control" id="altura" name="altura" value={formData.altura} onChange={handleChange} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="peso" className="form-label">Peso (kg)</label>
                            <input type="number" step="0.1" className="form-control" id="peso" name="peso" value={formData.peso} onChange={handleChange} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <label htmlFor="tatuajes_marcas" className="form-label">Tatuajes o Marcas (Descripción)</label>
                            <textarea className="form-control" id="tatuajes_marcas" name="tatuajes_marcas" value={formData.tatuajes_marcas} onChange={handleChange} rows="3"></textarea>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-success text-white" disabled={loading || !modelId}>
                        {loading ? 'Guardando...' : 'Guardar Datos Antropométricos'}
                    </button>
                </form>

                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
}

export default AnthropometricForm;