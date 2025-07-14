// Show the landing page
export function showLanding(container) {
  container.innerHTML = `
    <section class="landing-content">
      <h2>Bienvenido a PetCare Center</h2>
      <p>Confía el cuidado de tus mascotas a nuestro equipo especializado.</p>
      <div class="landing-buttons">
        <!-- Go to login page -->
        <button onclick="location.hash = '#/login'">Iniciar sesión</button>

        <!-- Go to register page -->
        <button onclick="location.hash = '#/register'">Registrarse</button>
      </div>
    </section>
  `;
}
