/**
*    Project     : Sample Vault
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Marzo 2026
*/

const loginForm = document.getElementById('loginForm');
if (loginForm) 
{
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar que la página se recargue

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try 
        {
            // Llamada al endpoint de login a través de nuestro service
            const data = await apiService.request('/auth/login', 'POST', { username, password });
            
            // Guardar token y rol en localStorage
            authHelper.saveSession(data.token, data.role)

            // Redirigir según el rol
            if (data.role === 'admin') 
            {
                window.location.href = 'https://musical-computing-machine-7vg76r6x5pp5fr7gj-3000.app.github.dev/html/admin-dashboard.html';
            }
            else
            {
                window.location.href = 'https://musical-computing-machine-7vg76r6x5pp5fr7gj-3000.app.github.dev/html/producer-dashboard.html';
            }

        }
        catch (error)
        {
            // Usar el componente modal para mostrar el error del backend
            showModal('Error de Acceso', error.message);
        }
    });
}

 
// Lógica para el formulario de REGISTRO
const registerForm = document.getElementById('registerForm');
if (registerForm) 
{
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
       
        if (password.trim().length < 6) {
            showModal('Error de Registro', 'La contraseña es demasiado corta');
            return; // Este return "mata" la ejecución acá para que no siga abajo
        }

        try 
        {
            // Enviamos los datos al backend mediante el servicio de la app
            await apiService.request('/auth/register', 'POST', { username, password });
            
            // Si sale bien, muestra modal de éxito
            showModal('¡Éxito!', 'Usuario creado. Ahora puedes iniciar sesión.');
            
            setTimeout(() => { window.location.href = 'https://musical-computing-machine-7vg76r6x5pp5fr7gj-3000.app.github.dev/html/login.html'; }, 2000);
        }
        catch (error)
        {
            // === MODIFICACIÓN PARA LA CONSIGNA DEL TP ===
            // Forzamos a que si el backend devuelve el error, se refleje tal cual en el modal.
            // Si error.message es un objeto JSON en string, intentamos extraer la propiedad message, 
            // sino usamos error.message directamente.
            let mensajeError = error.message;
            
            try {
                // Por si el apiService te devuelve el error crudo del response en formato JSON string
                const parsedError = JSON.parse(error.message);
                if (parsedError.error) mensajeError = parsedError.error;
            } catch (e) {
                // Si no era un JSON string, se queda con el error.message original
            }

            // Invocamos al modal de W3.CSS diseñado pasándole el mensaje exacto: 
            // "La contraseña es demasiado corta" (que vendrá desde el backend)
            showModal('Error de Registro', mensajeError);
        }
    });
}