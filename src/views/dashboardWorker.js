// Function to display the dashboard for worker users
export function showDashboardWorker(container, currentUser) {
  // Render base dashboard layout
  container.innerHTML = `
    <section class="dashboard-section">
      <div id="dashboard-content"></div>
      <button id="logout-btn">Cerrar sesión</button>
    </section>
  `;

  // Logout functionality
  const logoutBtn = container.querySelector("#logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    location.hash = "#/";
  });

  const content = container.querySelector("#dashboard-content");

  // Render dashboard sections
  content.innerHTML = `
    <h2>Bienvenido, ${currentUser.name}</h2>
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

  // Fetch and display all users with their roles
  fetch("http://localhost:3000/users")
    .then((res) => res.json())
    .then(async (users) => {
      const rolesRes = await fetch("http://localhost:3000/roles");
      const roles = await rolesRes.json();

      document.getElementById("user-list").innerHTML = users
        .map((u) => {
          const role = roles.find((r) => r.id == u.rolId);
          const roleName = role ? role.name : "Desconocido";
          return `<li>${u.name} (${u.email}) - Role: ${roleName}</li>`;
        })
        .join("");
    });

  // Fetch and display all pets
  fetch("http://localhost:3000/pets")
    .then((res) => res.json())
    .then((pets) => {
      const list = document.getElementById("all-pets-list");
      if (pets.length === 0) {
        list.innerHTML = `<li>No hay mascotas.</li>`;
        return;
      }

      // Render pet list with action buttons
      list.innerHTML = pets
        .map(
          (pet) => `
          <li>
            ${pet.name} (${pet.race})
            <button class="edit-pet" data-id="${pet.id}">Editar</button>
            <button class="delete-pet" data-id="${pet.id}">Eliminar</button>
            <button class="create-stay" data-id="${pet.id}">Agregar estancia</button>
            <button class="view-stays" data-id="${pet.id}">Ver estancias</button>
          </li>
        `
        )
        .join("");

      // Attach event handlers for each action
      document
        .querySelectorAll(".create-stay")
        .forEach((btn) =>
          btn.addEventListener("click", () => showStayForm(btn.dataset.id))
        );
      document
        .querySelectorAll(".view-stays")
        .forEach((btn) =>
          btn.addEventListener("click", () => showStayList(btn.dataset.id))
        );
      document
        .querySelectorAll(".edit-pet")
        .forEach((btn) =>
          btn.addEventListener("click", () => editPet(btn.dataset.id))
        );
      document
        .querySelectorAll(".delete-pet")
        .forEach((btn) =>
          btn.addEventListener("click", () => deletePet(btn.dataset.id))
        );
    });

  // Function to delete pet if no stays exist
  async function deletePet(id) {
    const stays = await fetch(`http://localhost:3000/stays?petId=${id}`).then(
      (r) => r.json()
    );
    if (stays.length) return alert("No puedes eliminar: tiene estancias.");
    if (!confirm("¿Eliminar mascota?")) return;

    const res = await fetch(`http://localhost:3000/pets/${id}`, {
      method: "DELETE",
    });
    res.ok ? location.reload() : alert("Error al eliminar");
  }

  // Function to edit a pet's information
  async function editPet(id) {
    const pet = await fetch(`http://localhost:3000/pets/${id}`).then((r) =>
      r.json()
    );

    const form = `
        <h4>Editar Mascota</h4>
        <form id="edit-pet-form">
          <input type="text" value="${pet.name}" id="name" required />
          <input type="number" value="${pet.weight}" id="weight" required />
          <input type="number" value="${pet.age}" id="age" required />
          <input type="text" value="${pet.race}" id="race" required />
          <input type="text" value="${pet.annotation || ""}" id="annotation" />
          <input type="text" value="${pet.temper || ""}" id="temper" />
          <button type="submit">Guardar</button>
        </form>
      `;

    document.getElementById("stay-management").innerHTML = form;

    // Handle pet edit submission
    document
      .getElementById("edit-pet-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
          name: document.getElementById("name").value.trim(),
          weight: parseFloat(document.getElementById("weight").value),
          age: parseInt(document.getElementById("age").value),
          race: document.getElementById("race").value.trim(),
          annotation: document.getElementById("annotation").value.trim(),
          temper: document.getElementById("temper").value.trim(),
        };

        const res = await fetch(`http://localhost:3000/pets/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) location.reload();
        else alert("Error al editar mascota");
      });
  }

  // Function to display the list of stays for a pet
  function showStayList(petId) {
    const container = document.getElementById("stay-management");
    container.innerHTML = `
        <h4>Estancias</h4>
        <ul id="stay-list">Cargando...</ul>
        <button id="btn-volver">Regresar</button>
      `;

    document
      .getElementById("btn-volver")
      .addEventListener("click", () => location.reload());

    fetch(`http://localhost:3000/stays?petId=${petId}`)
      .then((r) => r.json())
      .then((stays) => {
        const list = document.getElementById("stay-list");
        if (!stays.length)
          return (list.innerHTML = "<li>No hay estancias</li>");

        list.innerHTML = stays
          .map(
            (stay) => `
            <li>
              Ingreso: ${stay.entry} | Salida: ${stay.exit}<br>
              Servicios: ${stay.additionalServices.join(", ")}<br>
              Valor día: $${stay.valueDay} | Total: $${stay.valueTotal}<br>
              Estado: ${stay.completed ? "Completada" : "En proceso"}
              <button class="edit-stay" data-id="${stay.id}">Editar</button>
              <button class="delete-stay" data-id="${stay.id}">Eliminar</button>
            </li>
          `
          )
          .join("");

        // Add event listeners for stay edit/delete
        document
          .querySelectorAll(".edit-stay")
          .forEach((btn) =>
            btn.addEventListener("click", () => editStay(btn.dataset.id))
          );

        document
          .querySelectorAll(".delete-stay")
          .forEach((btn) =>
            btn.addEventListener("click", () => deleteStay(btn.dataset.id))
          );
      });
  }

  // Function to edit a stay
  async function editStay(id) {
    const stay = await fetch(`http://localhost:3000/stays/${id}`).then((r) =>
      r.json()
    );

    document.getElementById("stay-management").innerHTML = `
        <h4>Editar Estancia</h4>
        <form id="edit-stay-form">
          <input type="date" id="entry" value="${stay.entry}" required />
          <input type="date" id="exit" value="${stay.exit}" required />
          <input type="text" id="services" value="${stay.additionalServices.join(
            ", "
          )}" />
          <input type="number" id="valueDay" value="${
            stay.valueDay
          }" required />
          <label><input type="checkbox" id="completed" ${
            stay.completed ? "checked" : ""
          }/> Completada</label>
          <button type="submit">Guardar</button>
        </form>
      `;

    // Handle stay edit submission
    document
      .getElementById("edit-stay-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const entry = document.getElementById("entry").value;
        const exit = document.getElementById("exit").value;
        const valueDay = parseFloat(document.getElementById("valueDay").value);
        const services = document
          .getElementById("services")
          .value.split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const completed = document.getElementById("completed").checked;

        const daysDiff =
          (new Date(exit).getTime() - new Date(entry).getTime()) /
          (1000 * 60 * 60 * 24);
        const days = Math.max(1, Math.round(daysDiff));

        const edit = {
          entry,
          exit,
          valueDay,
          valueTotal: valueDay * days,
          completed,
          additionalServices: services,
        };

        const res = await fetch(`http://localhost:3000/stays/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(edit),
        });

        if (res.ok) location.reload();
        else alert("Error al actualizar");
      });
  }

  // Function to delete a stay
  async function deleteStay(id) {
    if (!confirm("¿Eliminar estancia?")) return;
    const res = await fetch(`http://localhost:3000/stays/${id}`, {
      method: "DELETE",
    });
    res.ok ? location.reload() : alert("Error al eliminar");
  }

  // Function to show form to register a new stay
  function showStayForm(petId) {
    const container = document.getElementById("stay-management");
    container.innerHTML = `
        <h4>Registrar Estancia</h4>
        <form id="stay-form">
          <input type="date" id="entry" placeholder="Entrada" required />
          <input type="date" id="exit" placeholder="Salida" required />
          <input type="text" id="services" placeholder="Servicios adicionales (separados por coma)" />
          <input type="number" id="valueDay" placeholder="Valor por día" required />
          <button type="submit">Guardar</button>
        </form>
        <button id="cancel-stay">Cancelar</button>
      `;

    // Handle stay registration
    document
      .getElementById("stay-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const entry = document.getElementById("entry").value;
        const exit = document.getElementById("exit").value;
        const valueDay = parseFloat(document.getElementById("valueDay").value);
        const services = document
          .getElementById("services")
          .value.split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const daysDiff =
          (new Date(exit).getTime() - new Date(entry).getTime()) /
          (1000 * 60 * 60 * 24);
        const days = Math.max(1, Math.round(daysDiff));

        const stay = {
          petId,
          entry,
          exit,
          valueDay,
          valueTotal: valueDay * days,
          completed: false,
          additionalServices: services,
        };

        const res = await fetch("http://localhost:3000/stays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stay),
        });

        if (res.ok) {
          alert("Estancia registrada con éxito");
          location.reload();
        } else {
          alert("Error al registrar estancia");
        }
      });

    document.getElementById("cancel-stay").addEventListener("click", () => {
      location.reload();
    });
  }
}
