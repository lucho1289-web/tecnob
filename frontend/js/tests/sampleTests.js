/**
 * Función para asegurar independencia de los tests de samples 
 * y no depender de otro test para tener un token de sesión válido
 */
 async function okLogin()
 {
    // 1. Login como productor (pepe) para obtener un token válido
     const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
     });
     const data = await response.json();
     // Guardamos el token para tests de samples
     localStorage.setItem('test_token', data.token);
 }

/**
 * Test: GET /api/samples/my-samples
 */
 testUtils.createTestButton("Test Listar Mis Samples", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // 2. Realizar la petición
    const response = await fetch('/api/samples/my-samples', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    testUtils.log(data);
    if (response.ok) {
        testUtils.setSuccess(btn);
    }
 });

/**
 * Test: POST /api/samples/upload (Simulado)
 */
testUtils.createTestButton("Test Subir Sample (Simulado)", async (btn) => {
    // 1. Asegurar y guardar una sesión válida
    await okLogin();
    const token = localStorage.getItem('test_token');
    
    // Creamos un FormData
    const formData = new FormData();
    formData.append('display_name', 'Test Loop Pedagogico');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');

    // Simulamos un archivo WAV (binario vacío para la prueba)
    const blob = new Blob(["Simulated Audio Content"], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'DRUM_LOOP_01.wav');

    const response = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });

    const data = await response.json();
    testUtils.log(data);
    if (response.ok) testUtils.setSuccess(btn);
});

// --- LOGICA DE PRUEBA  ---
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btnTestCategoria');
    const consoleOutput = document.getElementById('api-console');

    if (btn) {
        btn.addEventListener('click', async () => {
            if (consoleOutput) consoleOutput.textContent = "Ejecutando: GET /api/samples/search?category=Drums...\n";

            try {
                const token = localStorage.getItem('token'); 
                const response = await fetch('/api/samples/search?category=Drums', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (consoleOutput) {
                    if (response.ok) {
                        consoleOutput.textContent = `✔ [200 OK] Respuesta de la API:\n\n${JSON.stringify(data, null, 2)}`;
                        btn.style.setProperty('background-color', '#4CAF50', 'important'); 
                        btn.style.setProperty('color', 'white', 'important');
                    } else {
                        consoleOutput.textContent = `❌ [ERROR ${response.status}] ${data.message}\n\n${JSON.stringify(data, null, 2)}`;
                    }
                }
            } catch (error) {
                if (consoleOutput) consoleOutput.textContent = `❌ Error de conexión:\n${error.message}`;
            }
        });
    }
});