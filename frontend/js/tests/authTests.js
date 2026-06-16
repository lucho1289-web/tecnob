/**
 * Test: POST /api/auth/login
 */
 testUtils.createTestButton("Test Login Correcto (Pepe y 12345)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '12345' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Password Incorrecto (Pepe y 123)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '123' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 401) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Usuario Incorrecto (Juan y 12345)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '123' }) // Usamos pepe hardcodeado
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 401) {
        testUtils.setSuccess(btn);
    }
});

/**
 * TEST:
 * Registro con contraseña demasiado corta
 * 
 * Este test verifica la validación del ejercicio 2:
 * "Registro - Sanitización y Longitud de Contraseña"
 * 
 * La idea es enviar una contraseña inválida
 * (menos de 6 caracteres) y comprobar que:
 * 
 * 1) El backend rechaza la petición
 * 2) Devuelve HTTP 400 Bad Request
 * 3) Devuelve el mensaje correcto
 */

testUtils.createTestButton(
    "Test Register - Password corta",
    async (btn) => {

    // Enviamos una petición POST al endpoint de registro
    const response = await fetch('/api/auth/register', {

        // Método HTTP
        method: 'POST',

        // Indicamos que enviamos JSON
        headers: {
            'Content-Type': 'application/json'
        },

        // Datos enviados al servidor
        body: JSON.stringify({

            // Username cualquiera para la prueba
            username: 'usuarioTest',

            // Contraseña inválida (< 6 caracteres)
            password: '123'
        })
    });

    // Convertimos la respuesta a JSON
    const data = await response.json();

    // Mostramos la respuesta en consola/log de tests
    testUtils.log(data);

    /**
     * Validación del test
     * 
     * El test se considera correcto si:
     * 
     * - el servidor responde con 400
     * - y el mensaje coincide exactamente
     */
    if (
        response.status === 400 &&
        data.error === "La contraseña es demasiado corta"
    ) {

        // Marca el botón en verde (test exitoso)
        testUtils.setSuccess(btn);
    }
});