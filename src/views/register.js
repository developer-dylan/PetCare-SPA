export function showRegister(container) {
  // Render the registration form
  container.innerHTML = `
    <section class="auth-section">
      <h2>Registro de Usuario</h2>
      <form id="register-form">
        <input type="text" id="reg-name" placeholder="Nombre completo" required />
        <input type="text" id="reg-id" placeholder="Número de identidad" required />
        <input type="text" id="reg-phone" placeholder="Teléfono" required />
        <input type="text" id="reg-address" placeholder="Dirección" required />
        <input type="email" id="reg-email" placeholder="Correo electrónico" required />
        <input type="password" id="reg-password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
      </form>
    </section>
  `;

  // Handle form submission
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Create new user object
    const newUser = {
      id: crypto.randomUUID().slice(0, 4), // Short unique ID
      name: document.getElementById('reg-name').value.trim(),
      identidad: document.getElementById('reg-id').value.trim(),
      telefono: document.getElementById('reg-phone').value.trim(),
      direccion: document.getElementById('reg-address').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
      rolId: 2 // Always register as customer
    };

    try {
      // Check if email already exists
      const checkRes = await fetch(`http://localhost:3000/users?email=${newUser.email}`);
      const existing = await checkRes.json();
      if (existing.length > 0) {
        alert('El correo ya está registrado.');
        return;
      }

      // Send new user data to the server
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      // If successful, redirect to login
      if (res.ok) {
        alert('Usuario registrado con éxito.');
        location.hash = '#/login';
      } else {
        alert('Error al registrar usuario');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error de red o del servidor');
    }
  });
}
