// Show the 404 Not Found page
export function showNotFound(container) {
  container.innerHTML = `
    <h2>404 - Página no encontrada</h2>
    <p>La ruta que intentaste no existe.</p>
    <a href="#/">Volver al inicio</a>
  `;
}
