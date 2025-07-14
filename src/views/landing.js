// Show the landing page
export function showLanding(container) {
  container.innerHTML = `
    <style>
      .landing-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 70vh;
        background-color: #eaf2fb;
        text-align: center;
        padding: 40px 20px;
        border-radius: 12px;
      }

      .landing-content h2 {
        font-size: 2.4em;
        color: #003f5c;
        margin-bottom: 10px;
      }

      .landing-content p {
        font-size: 1.2em;
        color: #555;
        margin-bottom: 30px;
      }

      .landing-buttons {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .landing-buttons button {
        background-color: #003f5c;
        color: white;
        border: none;
        padding: 12px 24px;
        font-size: 1em;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .landing-buttons button:hover {
        background-color: #005085;
      }
    </style>

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
