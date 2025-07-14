// showDashboard.js
export function showDashboard(container) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    location.hash = '#/login';
    return;
  }

  // Set dashboard layout
  container.innerHTML = `
    <section class="dashboard-section">
      <h2>Bienvenido, ${currentUser.nombre}</h2>
      <div id="dashboard-content"></div>
      <button id="logout-btn">Cerrar sesión</button>
    </section>
  `;

  // Logout button
  const logoutBtn = container.querySelector('#logout-btn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    location.hash = '#/';
  });

  const content = container.querySelector('#dashboard-content');

  // WORKER VIEW
  if (currentUser.rolId === 1) {
    content.innerHTML = `
      <h3>Panel del Administrador</h3>
      <section>
        <h4>Usuarios registrados:</h4>
        <ul id="user-list">Cargando...</ul>
      </section>
      <section>
        <h4>Mascotas registradas:</h4>
        <ul id="all-pets-list">Cargando...</ul>
      </section>
      <section>
        <h4>Gestión de Estancias:</h4>
        <div id="stay-management">Selecciona una mascota para gestionar su estancia</div>
      </section>
    `;

    // Fetch and render user list with roles
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(async users => {
        const rolesRes = await fetch('http://localhost:3000/roles');
        const roles = await rolesRes.json();

        document.getElementById('user-list').innerHTML = users.map(u => {
          const rol = roles.find(r => r.id === u.rolId);
          const rolNombre = rol ? rol.nombre : 'desconocido';
          return `<li>${u.nombre} (${u.email}) - Rol: ${rolNombre}</li>`;
        }).join('');
      });

    // Fetch and render pet list with actions
    fetch('http://localhost:3000/pets')
      .then(res => res.json())
      .then(pets => {
        const list = document.getElementById('all-pets-list');
        if (pets.length === 0) {
          list.innerHTML = `<li>No hay mascotas.</li>`;
          return;
        }

        list.innerHTML = pets.map(pet => `
          <li>
            ${pet.nombre} (${pet.raza})
            <button class="edit-pet" data-id="${pet.id}">Editar</button>
            <button class="delete-pet" data-id="${pet.id}">Eliminar</button>
            <button class="create-stay" data-id="${pet.id}">Agregar estancia</button>
            <button class="view-stays" data-id="${pet.id}">Ver estancias</button>
          </li>
        `).join('');

        // Bind pet action buttons
        document.querySelectorAll('.create-stay').forEach(btn =>
          btn.addEventListener('click', () => showStayForm(btn.dataset.id))
        );
        document.querySelectorAll('.view-stays').forEach(btn =>
          btn.addEventListener('click', () => showStayList(btn.dataset.id))
        );
        document.querySelectorAll('.edit-pet').forEach(btn =>
          btn.addEventListener('click', () => editPet(btn.dataset.id))
        );
        document.querySelectorAll('.delete-pet').forEach(btn =>
          btn.addEventListener('click', () => deletePet(btn.dataset.id))
        );
      });

    // Delete pet with validation
    async function deletePet(id) {
      const stays = await fetch(`http://localhost:3000/stays?petId=${id}`).then(r => r.json());
      if (stays.length) return alert('No puedes eliminar: tiene estancias.');
      if (!confirm('¿Eliminar mascota?')) return;

      const res = await fetch(`http://localhost:3000/pets/${id}`, { method: 'DELETE' });
      res.ok ? location.reload() : alert('Error al eliminar');
    }

    // Edit pet info
    async function editPet(id) {
      const pet = await fetch(`http://localhost:3000/pets/${id}`).then(r => r.json());

      const form = `
        <h4>Editar Mascota</h4>
        <form id="edit-pet-form">
          <input type="text" value="${pet.nombre}" id="nombre" required />
          <input type="number" value="${pet.peso}" id="peso" required />
          <input type="number" value="${pet.edad}" id="edad" required />
          <input type="text" value="${pet.raza}" id="raza" required />
          <input type="text" value="${pet.anotaciones || ''}" id="anotaciones" />
          <input type="text" value="${pet.temperamento || ''}" id="temperamento" />
          <button type="submit">Guardar</button>
        </form>
      `;

      document.getElementById('stay-management').innerHTML = form;

      document.getElementById('edit-pet-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
          nombre: document.getElementById('nombre').value.trim(),
          peso: parseFloat(document.getElementById('peso').value),
          edad: parseInt(document.getElementById('edad').value),
          raza: document.getElementById('raza').value.trim(),
          anotaciones: document.getElementById('anotaciones').value.trim(),
          temperamento: document.getElementById('temperamento').value.trim(),
        };

        const res = await fetch(`http://localhost:3000/pets/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) location.reload();
        else alert('Error al editar mascota');
      });
    }

    // Show list of stays for a pet
    function showStayList(petId) {
      const container = document.getElementById('stay-management');
      container.innerHTML = `
        <h4>Estancias</h4>
        <ul id="stay-list">Cargando...</ul>
        <button id="btn-volver">Regresar</button>
      `;

      document.getElementById('btn-volver').addEventListener('click', () => location.reload());

      fetch(`http://localhost:3000/stays?petId=${petId}`)
        .then(r => r.json())
        .then(stays => {
          const list = document.getElementById('stay-list');
          if (!stays.length) return list.innerHTML = '<li>No hay estancias</li>';

          list.innerHTML = stays.map(stay => `
            <li>
              Ingreso: ${stay.ingreso} | Salida: ${stay.salida}<br>
              Servicios: ${stay.serviciosAdicionales.join(', ')}<br>
              Valor día: $${stay.valorDia} | Total: $${stay.valorTotal}<br>
              Estado: ${stay.completada ? 'Completada' : 'En proceso'}
              <button class="edit-stay" data-id="${stay.id}">Editar</button>
              <button class="delete-stay" data-id="${stay.id}">Eliminar</button>
            </li>
          `).join('');

          document.querySelectorAll('.edit-stay').forEach(btn =>
            btn.addEventListener('click', () => editStay(btn.dataset.id))
          );

          document.querySelectorAll('.delete-stay').forEach(btn =>
            btn.addEventListener('click', () => deleteStay(btn.dataset.id))
          );
        });
    }

    // Edit a stay
    async function editStay(id) {
      const stay = await fetch(`http://localhost:3000/stays/${id}`).then(r => r.json());

      document.getElementById('stay-management').innerHTML = `
        <h4>Editar Estancia</h4>
        <form id="edit-stay-form">
          <input type="date" id="ingreso" value="${stay.ingreso}" required />
          <input type="date" id="salida" value="${stay.salida}" required />
          <input type="text" id="servicios" value="${stay.serviciosAdicionales.join(', ')}" />
          <input type="number" id="valorDia" value="${stay.valorDia}" required />
          <label><input type="checkbox" id="completada" ${stay.completada ? 'checked' : ''}/> Completada</label>
          <button type="submit">Guardar</button>
        </form>
      `;

      document.getElementById('edit-stay-form').addEventListener('submit', async e => {
        e.preventDefault();
        const ingreso = document.getElementById('ingreso').value;
        const salida = document.getElementById('salida').value;
        const valorDia = parseFloat(document.getElementById('valorDia').value);
        const servicios = document.getElementById('servicios').value.split(',').map(s => s.trim()).filter(Boolean);
        const completada = document.getElementById('completada').checked;
        const dias = (new Date(salida) - new Date(ingreso)) / (1000 * 60 * 60 * 24) + 1;

        const editado = {
          ingreso,
          salida,
          valorDia,
          valorTotal: dias * valorDia,
          completada,
          serviciosAdicionales: servicios
        };

        const res = await fetch(`http://localhost:3000/stays/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editado)
        });

        if (res.ok) location.reload();
        else alert('Error al actualizar');
      });
    }

    // Delete a stay
    async function deleteStay(id) {
      if (!confirm('¿Eliminar estancia?')) return;
      const res = await fetch(`http://localhost:3000/stays/${id}`, { method: 'DELETE' });
      res.ok ? location.reload() : alert('Error al eliminar');
    }
  }

  // CUSTOMER VIEW 
if (currentUser.rolId === 2) {
  content.innerHTML = `
    <h3>Mis Mascotas</h3>
    <ul id="pet-list">Cargando...</ul>

    <h4>Registrar nueva mascota</h4>
    <form id="pet-form">
      <input type="text" id="pet-nombre" placeholder="Nombre" required />
      <input type="number" id="pet-peso" placeholder="Peso (kg)" required />
      <input type="number" id="pet-edad" placeholder="Edad (años)" required />
      <input type="text" id="pet-raza" placeholder="Raza" required />
      <input type="text" id="pet-temperamento" placeholder="Temperamento" required />
      <input type="text" id="pet-anotaciones" placeholder="Anotaciones (opcional)" />
      <button type="submit">Registrar Mascota</button>
    </form>
  `;

  const petList = document.getElementById('pet-list');

  fetch('http://localhost:3000/pets')
    .then(res => res.json())
    .then(pets => {
      const myPets = pets.filter(p => p.userId === currentUser.id);

      if (myPets.length === 0) {
        petList.innerHTML = '<li>No tienes mascotas registradas aún.</li>';
        return;
      }

      // Show all pets owned by current user
      petList.innerHTML = myPets.map(pet => `
        <li>
          <strong>${pet.nombre}</strong> (${pet.raza}, ${pet.temperamento})
          <button class="edit-pet" data-id="${pet.id}">Editar</button>
          <button class="delete-pet" data-id="${pet.id}">Eliminar</button>
          <button class="view-stays" data-id="${pet.id}">Ver estancias</button>
        </li>
      `).join('');

      // Delete pet button
      document.querySelectorAll('.delete-pet').forEach(btn => {
        btn.addEventListener('click', async () => {
          const petId = btn.dataset.id;
          const staysRes = await fetch(`http://localhost:3000/stays?petId=${petId}`);
          const stays = await staysRes.json();

          if (stays.length > 0) {
            alert('No puedes eliminar esta mascota porque tiene estancias registradas.');
            return;
          }

          if (!confirm('¿Seguro que quieres eliminar esta mascota?')) return;

          const deleteRes = await fetch(`http://localhost:3000/pets/${petId}`, {
            method: 'DELETE'
          });

          if (deleteRes.ok) {
            alert('Mascota eliminada con éxito');
            location.reload();
          } else {
            alert('Error al eliminar mascota');
          }
        });
      });

      // Edit pet button
      document.querySelectorAll('.edit-pet').forEach(btn => {
        btn.addEventListener('click', async () => {
          const petId = btn.dataset.id;
          const res = await fetch(`http://localhost:3000/pets/${petId}`);
          const pet = await res.json();

          content.innerHTML = `
            <h3>Editar Mascota: ${pet.nombre}</h3>
            <form id="edit-pet-form">
              <input type="text" id="edit-nombre" value="${pet.nombre}" required />
              <input type="number" id="edit-peso" value="${pet.peso}" required />
              <input type="number" id="edit-edad" value="${pet.edad}" required />
              <input type="text" id="edit-raza" value="${pet.raza}" required />
              <input type="text" id="edit-temperamento" value="${pet.temperamento}" required />
              <input type="text" id="edit-anotaciones" value="${pet.anotaciones || ''}" />
              <button type="submit">Guardar Cambios</button>
              <button type="button" id="cancel-edit">Cancelar</button>
            </form>
          `;

          // Submit pet update
          document.getElementById('edit-pet-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const updatedPet = {
              nombre: document.getElementById('edit-nombre').value.trim(),
              peso: parseFloat(document.getElementById('edit-peso').value),
              edad: parseInt(document.getElementById('edit-edad').value),
              raza: document.getElementById('edit-raza').value.trim(),
              temperamento: document.getElementById('edit-temperamento').value.trim(),
              anotaciones: document.getElementById('edit-anotaciones').value.trim()
            };

            const updateRes = await fetch(`http://localhost:3000/pets/${petId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedPet),
            });

            if (updateRes.ok) {
              alert('Mascota actualizada correctamente');
              location.reload();
            } else {
              alert('Error al actualizar mascota');
            }
          });

          document.getElementById('cancel-edit').addEventListener('click', () => {
            showDashboard(container);
          });
        });
      });

      // View pet stays
      document.querySelectorAll('.view-stays').forEach(btn => {
        btn.addEventListener('click', async () => {
          const petId = btn.dataset.id;
          const container = document.getElementById('dashboard-content');
          container.innerHTML = `<h3>Estancias de la mascota ID ${petId}</h3><ul id="stay-list">Cargando...</ul>`;

          const res = await fetch(`http://localhost:3000/stays?petId=${petId}`);
          const stays = await res.json();

          const list = document.getElementById('stay-list');
          if (stays.length === 0) {
            list.innerHTML = `<li>No hay estancias registradas.</li>`;
          } else {
            list.innerHTML = stays.map(stay => `
              <li>
                Ingreso: ${stay.ingreso} | Salida: ${stay.salida}<br>
                Servicios: ${stay.serviciosAdicionales.join(', ') || 'Ninguno'}<br>
                Valor Día: $${stay.valorDia} | Total: $${stay.valorTotal}<br>
                Estado: ${stay.completada ? 'Completada' : 'En proceso'}
              </li>
            `).join('');
          }

          const backBtn = document.createElement('button');
          backBtn.textContent = 'Regresar';
          backBtn.addEventListener('click', () => showDashboard(container));
          container.appendChild(backBtn);
        });
      });
    });

  // ➕ Submit new pet
  document.getElementById('pet-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevaMascota = {
      nombre: document.getElementById('pet-nombre').value.trim(),
      peso: parseFloat(document.getElementById('pet-peso').value),
      edad: parseInt(document.getElementById('pet-edad').value),
      raza: document.getElementById('pet-raza').value.trim(),
      temperamento: document.getElementById('pet-temperamento').value.trim(),
      anotaciones: document.getElementById('pet-anotaciones').value.trim(),
      userId: currentUser.id
    };

    const res = await fetch('http://localhost:3000/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaMascota),
    });

    if (res.ok) {
      alert('Mascota registrada correctamente');
      location.reload();
    } else {
      alert('Error al registrar mascota');
    }
  });
}
}
