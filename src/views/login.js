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

    // Get input values
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      // Request users from server
      const res = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
      const users = await res.json();

      // If user found, save to localStorage and redirect
      if (users.length === 1) {
        const user = users[0];
        localStorage.setItem('currentUser', JSON.stringify(user)); // Save session
        location.hash = '#/dashboard'; // Redirect to dashboard
      } else {
        alert('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error al intentar iniciar sesión');
    }
  });
}
