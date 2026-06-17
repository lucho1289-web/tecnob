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
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try 
        {
            const data = await apiService.request('/auth/login', 'POST', { username, password });
            authHelper.saveSession(data.token, data.role)

            if (data.role === 'admin') 
            {
                window.location.href = '/admin-dashboard';
            }
            else
            {
                window.location.href = '/producer-dashboard';
            }
        }
        catch (error)
        {
            showModal('Error de Acceso', error.message);
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) 
{
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
       
        if (password.trim().length < 6) {
            showModal('Error de Registro', 'La contraseña es demasiado corta');
            return;
        }

        try 
        {
            await apiService.request('/auth/register', 'POST', { username, password });
            showModal('¡Éxito!', 'Usuario creado. Ahora puedes iniciar sesión.');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
        }
        catch (error)
        {
            let mensajeError = error.message;
            
            try {
                const parsedError = JSON.parse(error.message);
                if (parsedError.error) mensajeError = parsedError.error;
            } catch (e) {}

            showModal('Error de Registro', mensajeError);
        }
    });
}

