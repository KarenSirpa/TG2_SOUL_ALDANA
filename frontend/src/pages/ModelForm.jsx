// frontend/src/components/ModelForm.js
import axios from 'axios';
import { useState } from 'react';
import { createModel } from '../services/api';

function ModelForm({ onModelCreated }) {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        fecha_nacimiento: '',
        genero: '',
        edad: '',
        celular: '',
        email_contacto: '',
        instagram: '',
    });
    // CAMBIO: Ahora profileImageFiles es un array para múltiples archivos
    const [profileImageFiles, setProfileImageFiles] = useState([]); // <--- CAMBIO AQUÍ

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImageFiles') { // <--- CAMBIO AQUÍ (nombre del input)
            setProfileImageFiles(Array.from(files)); // Guarda todos los archivos seleccionados como un array
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        let finalImageUrls = []; // <--- CAMBIO: Ahora será un array de URLs

        // PASO 1: Subir las imágenes si se han seleccionado algunas
        if (profileImageFiles.length > 0) {
            const imageData = new FormData();
            // CAMBIO CLAVE: Adjuntar cada archivo con el mismo nombre de campo
            profileImageFiles.forEach((file, index) => {
                // 'profileImages' debe coincidir con el nombre del campo en tu Multer config (`upload.array('profileImages')`)
                imageData.append('profileImages', file);
            });

            try {
                const uploadRes = await axios.post('http://localhost:3001/api/modelos/upload-profile-images', imageData, { // <--- CAMBIO EN LA RUTA (plural)
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                finalImageUrls = uploadRes.data.imageUrls; // <--- CAMBIO: Esperamos un array de URLs
                console.log("Imágenes subidas con éxito. URLs:", finalImageUrls);
            } catch (uploadErr) {
                console.error("Error al subir las imágenes:", uploadErr);
                setError(`Error al subir las imágenes: ${uploadErr.response?.data?.message || uploadErr.message}`);
                setLoading(false);
                return;
            }
        }

        // Prepara los datos para enviar al backend para crear el modelo
        const dataToSend = {
            nombre_completo: formData.nombre_completo,
            fecha_nacimiento: formData.fecha_nacimiento || null,
            edad: parseInt(formData.edad),
            celular: formData.celular,
            genero: formData.genero,
            email_contacto: formData.email_contacto,
            redes_sociales: formData.instagram ? { instagram: formData.instagram } : null,
            // PASO CLAVE 2: Envía el array de URLs obtenidas de la subida
            fotos_book: finalImageUrls.length > 0 ? finalImageUrls : null, // Si no hay urls, envía null
        };

        try {
            const result = await createModel(dataToSend);
            setSuccessMessage(`Modelo "${result.nombre_completo}" registrado con ID: ${result.id}`);
            onModelCreated(result.id);
            // Reiniciar el formulario
            setFormData({
                nombre_completo: '',
                fecha_nacimiento: '',
                genero: '',
                edad: '',
                celular: '',
                email_contacto: '',
                instagram: '',
            });
            setProfileImageFiles([]); // <--- Reinicia también el array de archivos
        } catch (err) {
            setError(`Error al registrar modelo: ${err.message || 'Error desconocido'}`);
            console.error("Error registering model:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white">
                <h5 className="mb-0">1. Registrar Nuevo Modelo (Datos Personales)</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre_completo" className="form-label">Nombre Completo</label>
                        <input type="text" className="form-control" id="nombre_completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                        <input type="date" className="form-control" id="fecha_nacimiento" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="genero" className="form-label">Género</label>
                        <select className="form-select" id="genero" name="genero" value={formData.genero} onChange={handleChange} required>
                            <option value="">Selecciona</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="edad" className="form-label">Edad</label>
                        <input type="number" className="form-control" id="edad" name="edad" value={formData.edad} onChange={handleChange} required min="1" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="celular" className="form-label">Celular</label>
                        <input type="text" className="form-control" id="celular" name="celular" value={formData.celular} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email_contacto" className="form-label">Email de Contacto</label>
                        <input type="email" className="form-control" id="email_contacto" name="email_contacto" value={formData.email_contacto} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="instagram" className="form-label">Instagram (URL Completa)</label>
                        <input type="url" className="form-control" id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Ej: https://www.instagram.com/usuario" />
                    </div>

                    {/* CAMBIO CLAVE: INPUT TIPO FILE CON ATRIBUTO MULTIPLE */}
                    <div className="mb-3">
                        <label htmlFor="profileImageFiles" className="form-label">Fotos del Book (Múltiples)</label>
                        <input
                            type="file"
                            className="form-control"
                            id="profileImageFiles"
                            name="profileImageFiles" // <--- CAMBIO: nombre del input
                            accept="image/*"
                            onChange={handleChange}
                            multiple // <--- ¡AQUÍ ESTÁ EL ATRIBUTO CLAVE!
                        />
                        <div className="form-text">Puedes subir varias imágenes a la vez para el book del modelo.</div>
                    </div>

                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrar Modelo'}
                    </button>
                </form>

                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
}

export default ModelForm;