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

/** Funcion auxiliar para loguear usuarios para la validacion #8 */
async function loginAs(user, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: user, password: password}) 
    });
    const data = await response.json();
    return data.token;
}
    

/**
 * Test: DELETE /api/samples/:id - Eliminación de sample ajeno (Validación numero 8)
 * Valida que un usuario no pueda borrar un sample que pertenece a otro productor.
 */
testUtils.createTestButton('Test #8 - Eliminar Sample Ajeno (403)', async (btn) => {
   
    const tokenPepe = await loginAs('pepe', '12345');
    // Creamos un FormData
    const formData = new FormData();
    formData.append('display_name', 'Sample de Pepe');
    formData.append('category', 'Drums');
    formData.append('bpm', '120');
    
    const blob = new Blob(['Simulated Audio Content'], { type: 'audio/wav' });
    formData.append('audioFile', blob, 'PEPE_LOOP.wav');
   
    const uploadResponse = await fetch('/api/samples/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokenPepe}` },
        body: formData
    });
    const uploadData = await uploadResponse.json();
    const sampleId = uploadData.id;

    const tokenAdmin = await loginAs('admin', '12345');
    
    const deleteResponse = await fetch(`/api/samples/${sampleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${tokenAdmin}` }
    });
    const deleteData = await deleteResponse.json();
    testUtils.log(deleteData);

    const esperado = deleteResponse.status === 403
        && deleteData.message === 'No tienes permisos para alterar este archivo.';

    if (esperado) testUtils.setSuccess(btn);
});

