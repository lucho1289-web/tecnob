/**
*    Project     : Sample Vault
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

// Configuración base de la API
const API_URL = "/api";

const apiService = {
    // Función centralizada para peticiones Fetch
    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        // Usamos el helper en lugar de acceder directo a localStorage o sessionStorage
        const token = authHelper.getToken();
        
        const headers = {};
        if (!isFormData) headers['Content-Type'] = 'application/json';
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config = { method, headers };
        if (data) {
            // Si es FormData (para archivos), no se stringifica
            config.body = isFormData ? data : JSON.stringify(data);
        }

        const response = await fetch(`${API_URL}${endpoint}`, config);
        let result = {};
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            result = await response.json();
        }

        if (response.status === 401) authHelper.logout();

        // CORRECCIÓN: el servidor manda `error`, no `message`, en los 413.
        // Leemos ambos para cubrir todos los casos.
        if (!response.ok) throw new Error(result.error || result.message || 'Error en la petición');
        return result;
    }
};