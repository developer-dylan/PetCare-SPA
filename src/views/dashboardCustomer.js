export function showDashboardCustomer(container, currentUser) {
  container.innerHTML = `
    <section class="dashboard-section">
      <div id="dashboard-content"></div>
      <button id="logout-btn">Cerrar sesión</button>
    </section>
  `;

  const logoutBtn = container.querySelector("#logout-btn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    location.hash = "#/";
  });

  const content = container.querySelector("#dashboard-content");

  content.innerHTML = `
    <h2>Bienvenido, ${currentUser.name}</h2>
    <h3>Mis Mascotas</h3>
    <ul id="pet-list">Cargando...</ul>
    <h4>Registrar nueva mascota</h4>
    <form id="pet-form">
      <input type="text" id="pet-name" placeholder="Nombre" required />
      <input type="number" id="pet-weight" placeholder="Peso (kg)" required />
      <input type="number" id="pet-age" placeholder="Edad (años)" required />
      <input type="text" id="pet-race" placeholder="Raza" required />
      <input type="text" id="pet-temper" placeholder="Temperamento" required />
      <input type="text" id="pet-annotation" placeholder="Anotaciones (opcional)" />
      <button type="submit">Registrar Mascota</button>
    </form>
  `;

  const petList = document.getElementById("pet-list");

  fetch("http://localhost:3000/pets")
    .then((res) => res.json())
    .then((pets) => {
      const myPets = pets.filter((p) => p.userId === currentUser.id);

      if (myPets.length === 0) {
        petList.innerHTML = "<li>No tienes mascotas registradas aún.</li>";
        return;
      }

      // Show all pets owned by current user
      petList.innerHTML = myPets
        .map(
          (pet) => `
        <li>
          <strong>${pet.name}</strong> (${pet.race}, ${pet.temper})
          <button class="edit-pet" data-id="${pet.id}">Editar</button>
          <button class="delete-pet" data-id="${pet.id}">Eliminar</button>
          <button class="view-stays" data-id="${pet.id}">Ver estancias</button>
        </li>
      `
        )
        .join("");

      // Delete pet button
      document.querySelectorAll(".delete-pet").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const petId = btn.dataset.id;
          const staysRes = await fetch(
            `http://localhost:3000/stays?petId=${petId}`
          );
          const stays = await staysRes.json();

          if (stays.length > 0) {
            alert(
              "No puedes eliminar esta mascota porque tiene estancias registradas."
            );
            return;
          }

          if (!confirm("¿Seguro que quieres eliminar esta mascota?")) return;

          const deleteRes = await fetch(`http://localhost:3000/pets/${petId}`, {
            method: "DELETE",
          });

          if (deleteRes.ok) {
            alert("Mascota eliminada con éxito");
            location.reload();
          } else {
            alert("Error al eliminar mascota");
          }
        });
      });

      // Edit pet button
      document.querySelectorAll(".edit-pet").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const petId = btn.dataset.id;
          const res = await fetch(`http://localhost:3000/pets/${petId}`);
          const pet = await res.json();

          content.innerHTML = `
            <h3>Editar Mascota: ${pet.name}</h3>
            <form id="edit-pet-form">
              <input type="text" id="edit-name" value="${pet.name}" required />
              <input type="number" id="edit-weight" value="${
                pet.weight
              }" required />
              <input type="number" id="edit-age" value="${pet.age}" required />
              <input type="text" id="edit-race" value="${pet.race}" required />
              <input type="text" id="edit-temper" value="${
                pet.temper
              }" required />
              <input type="text" id="edit-annotation" value="${
                pet.annotation || ""
              }" />
              <button type="submit">Guardar Cambios</button>
              <button type="button" id="cancel-edit">Cancelar</button>
            </form>
          `;

          // Submit pet update
          document
            .getElementById("edit-pet-form")
            .addEventListener("submit", async (e) => {
              e.preventDefault();
              const updatedPet = {
                name: document.getElementById("edit-name").value.trim(),
                weight: parseFloat(
                  document.getElementById("edit-weight").value
                ),
                age: parseInt(document.getElementById("edit-age").value),
                race: document.getElementById("edit-race").value.trim(),
                temper: document.getElementById("edit-temper").value.trim(),
                annotation: document
                  .getElementById("edit-annotation")
                  .value.trim(),
              };

              const updateRes = await fetch(
                `http://localhost:3000/pets/${petId}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatedPet),
                }
              );

              if (updateRes.ok) {
                alert("Mascota actualizada correctamente");
                location.reload();
              } else {
                alert("Error al actualizar mascota");
              }
            });

          document
            .getElementById("cancel-edit")
            .addEventListener("click", () => {
              showDashboard(container);
            });
        });
      });

      // View pet stays
      document.querySelectorAll(".view-stays").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const petId = btn.dataset.id;
          const container = document.getElementById("dashboard-content");
          container.innerHTML = `<h3>Estancias de ${petId}</h3><ul id="stay-list">Cargando...</ul>`;

          const res = await fetch(`http://localhost:3000/stays?petId=${petId}`);
          const stays = await res.json();

          const list = document.getElementById("stay-list");
          if (stays.length === 0) {
            list.innerHTML = `<li>No hay estancias registradas.</li>`;
          } else {
            list.innerHTML = stays
              .map(
                (stay) => `
              <li>
                Ingreso: ${stay.entry} | Salida: ${stay.exit}<br>
                Servicios: ${
                  stay.additionalServices.join(", ") || "Ninguno"
                }<br>
                Valor Día: $${stay.valueDay} | Total: $${stay.valueTotal}<br>
                Estado: ${stay.completed ? "Completada" : "En proceso"}
              </li>
            `
              )
              .join("");
          }

          const backBtn = document.createElement("button");
          backBtn.textContent = "Regresar";
          backBtn.addEventListener("click", () => showDashboard(container));
          container.appendChild(backBtn);
        });
      });
    });

  // Submit new pet
  document.getElementById("pet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPet = {
      name: document.getElementById("pet-name").value.trim(),
      weight: parseFloat(document.getElementById("pet-weight").value),
      age: parseInt(document.getElementById("pet-age").value),
      race: document.getElementById("pet-race").value.trim(),
      temper: document.getElementById("pet-temper").value.trim(),
      annotation: document.getElementById("pet-annotation").value.trim(),
      userId: currentUser.id,
    };

    const res = await fetch("http://localhost:3000/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPet),
    });

    if (res.ok) {
      alert("Mascota registrada correctamente");
      location.reload();
    } else {
      alert("Error al registrar mascota");
    }
  });
}
