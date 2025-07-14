export function showLogin(container) {
  // Render login form
  container.innerHTML = `
    <section class="auth-section">
      <h2>Iniciar Sesión</h2>
      <form id="login-form">
        <input type="email" id="login-email" placeholder="Correo electrónico" required />
        <input type="password" id="login-password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
    </section>
  `;

  // Handle form submission
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get values from inputs
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Check credentials in the server
    const res = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
    const users = await res.json();

    if (users.length) {
      // Save logged user in local storage
      localStorage.setItem('currentUser', JSON.stringify(users[0]));
      location.hash = '#/dashboard'; // Redirect to dashboard
    } else {
      alert('Credenciales inválidas');
    }
  });
}
