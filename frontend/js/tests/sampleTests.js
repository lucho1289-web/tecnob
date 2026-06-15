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
// Agregalo en tu archivo de tests (frontend/js/tests/sampleTests.js)

testUtils.createTestButton("Test Subir Sample - Límite de Peso (413)", async (btn) => {
await okLogin();
  const formData = new FormData();
  
  // 1. Creamos un Blob que pesa 6MB (superior a los 5MB permitidos)
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
        'Authorization': `Bearer ${localStorage.getItem('test_token')}` // Asegúrate de estar logueado
      },
      body: formData
    });

    const data = await response.json();
    testUtils.log(data); // Esto mostrará el mensaje del servidor en la pantalla del test

    // 3. Validación: Si recibimos un 413, el test es un ÉXITO
    if (response.status === 413) {
      testUtils.setSuccess(btn); // Pone el botón en verde
    } else {
      console.error("Esperaba un error 413, pero recibí:", response.status);
      testUtils.setError(btn);
    }
  } catch (error) {
    console.error("Error en el test:", error);
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