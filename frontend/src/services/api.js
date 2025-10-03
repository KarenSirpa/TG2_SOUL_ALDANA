import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export default API;


// ==========================================================
// Funciones para Modelos
// ==========================================================

export const createModel = async (modelData) => {
    try {
        const response = await API.post('/modelos', modelData);
        return response.data; // Axios pone la respuesta en .data
    } catch (error) {
        // Manejo de errores de Axios: error.response para errores del servidor
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al registrar el modelo.');
    }
};

export const getModels = async () => {
    try {
        const response = await API.get('/modelos');
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al obtener los modelos.');
    }
};

export const updateModel = async (id, modelData) => {
    try {
        const response = await API.put(`/modelos/${id}`, modelData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al actualizar el modelo.');
    }
};

export const deleteModel = async (id) => {
    try {
        const response = await API.delete(`/modelos/${id}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar el modelo.');
    }
};

// ==========================================================
// Funciones para Datos Antropométricos
// ==========================================================

export const createAnthropometricData = async (data) => {
    try {
        const response = await API.post('/datos-antropometricos', data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al registrar datos antropométricos.');
    }
};

export const updateAnthropometricData = async (modelId, data) => {
    try {
        const response = await API.put(`/datos-antropometricos/${modelId}`, data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al actualizar datos antropométricos.');
    }
};

export const getAnthropometricDataByModelId = async (modelId) => {
    try {
        const response = await API.get(`/datos-antropometricos/${modelId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al obtener datos antropométricos.');
    }
};

export const deleteAnthropometricData = async (modelId) => {
    try {
        const response = await API.delete(`/datos-antropometricos/${modelId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar datos antropométricos.');
    }
};

// ==========================================================
// Funciones para Experiencias
// ==========================================================

export const createExperience = async (experienceData) => {
    try {
        const response = await API.post('/experiencias', experienceData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al registrar experiencia.');
    }
};

export const getExperiencesByModelId = async (modelId) => {
    try {
        const response = await API.get(`/experiencias/${modelId}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al obtener experiencias.');
    }
};

export const updateExperience = async (id, experienceData) => {
    try {
        const response = await API.put(`/experiencias/${id}`, experienceData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al actualizar experiencia.');
    }
};

export const deleteExperience = async (id) => {
    try {
        const response = await API.delete(`/experiencias/${id}`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar experiencia.');
    }
};

export const deleteAllExperiencesByModelId = async (modelId) => {
    try {
        const response = await API.delete(`/experiencias/modelo/${modelId}`); // Asegúrate que esta ruta coincida con tu backend
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error);
        }
        throw new Error('Error al eliminar todas las experiencias del modelo.');
    }
};
