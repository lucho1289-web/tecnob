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
    if (response.ok) testUtils.setSuccess(btn);
});

testUtils.createTestButton("Test Subir Sample - Límite de Peso (413)", async (btn) => {
    await okLogin();
    const formData = new FormData();
    
    // 1. Creamos un archivo que pesa 6MB superior a lo permitido (tu límite era 5MB)
    const size = 6 * 1024 * 1024;
    const largeBlob = new Blob([new Uint8Array(size)], { type: 'audio/wav' });
    
    // 2. Simulamos la subida
    formData.append('audioFile', largeBlob, 'archivo_pesado.wav');
    formData.append('category', 'test');
    formData.append('display_name', 'Archivo demasiado grande');

    try {
        const response = await fetch('/api/samples/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('test_token')}`
            },
            body: formData
        });

        // 3. Verificamos la respuesta
        if (response.status === 413) {
            testUtils.setSuccess(btn);
            testUtils.log({ message: "Servidor rechazó el archivo correctamente (413)" });
        } else {
            // Si el servidor respondió otra cosa (ej. 500), intentamos leer el error
            const data = await response.json().catch(() => ({ error: "Error desconocido" }));
            testUtils.log(data);
            testUtils.setError(btn);
        }
    } catch (error) {
        // Esto captura errores de red (ej. si el servidor está apagado)
        console.error("Error crítico en el test:", error);
        testUtils.setError(btn);
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
testUtils.createTestButton("Test 9: Borrado Fantasma - Doble Eliminación", async(btn)=>{ //funcion para boton en test
    await okLogin(); // primero obtengo sesion valida con token abajo
    const token = localStorage.getItem('test_token');

    const ID_INEXISTENTE = 99999; // borrar id que no existe
    const response = await fetch(`/api/samples/${ID_INEXISTENTE}`, {
        method: 'DELETE',       //borra o intenta borrar el id que no existe
        headers: {'Authorization':`Bearer ${token}`}
    });
    const data = await response.json();

    testUtils.log({ //verificar que el server respondio 404 con el mensaje que se espera
        status_recibido: response.status,
        status_esperado: 404,
        mensaje: data.message,
        test_aprobado: response.status === 404
    }, response.status !== 404);

    if (response.status === 404) testUtils.setSuccess(btn);
});