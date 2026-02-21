const catalogo = document.getElementById("catalogo");
const busqueda = document.getElementById("busqueda");
const categoriaSelect = document.getElementById("categoria");

if (catalogo) {

  function obtenerImagen(imagenBase) {

    const img = document.createElement("img");
    img.loading = "lazy";

    if (!imagenBase) {
      img.src = "img/placeholder.webp";
      return img;
    }

    img.src = `img/${imagenBase}`;
    img.alt = imagenBase;

    return img;
  }

  function abrirModal(producto) {

    const mensaje = encodeURIComponent(
      `Hola, estoy interesado en el producto: ${producto.nombre}`
    );

    const precioHTML = producto.precio
      ? `<div class="modal-precio">$${producto.precio}</div>`
      : "";

    // 🔥 Formatear saltos de línea
    const descripcionFormateada = producto.descripcion
      ? producto.descripcion.replace(/\n/g, "<br>")
      : "";

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close">×</span>

        <div class="modal-body">
          <div class="modal-img"></div>

          <div class="modal-info">
            <h2>${producto.nombre}</h2>
            <p>${descripcionFormateada}</p>
            ${precioHTML}

            <a
              class="modal-cta"
              href="https://wa.me/59894862909?text=${mensaje}"
              target="_blank"
              rel="noopener"
            >
              ¿Interesado? Contactate con nosotros
            </a>
          </div>
        </div>
      </div>
    `;

    const img = obtenerImagen(producto.imagenBase);
    modal.querySelector(".modal-img").appendChild(img);

    // 🔒 BLOQUEAR SCROLL DEL BODY
    document.body.style.overflow = "hidden";

    const cerrarModal = () => {
      modal.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", escListener);
    };

    // Cerrar con botón
    modal.querySelector(".modal-close").onclick = cerrarModal;

    // Cerrar haciendo click afuera
    modal.onclick = e => {
      if (e.target === modal) cerrarModal();
    };

    // 🔥 Evitar que el click del botón cierre el modal
    modal.querySelector(".modal-cta").onclick = e => {
      e.stopPropagation();
    };

    // 🔥 Cerrar con tecla ESC
    const escListener = (e) => {
      if (e.key === "Escape") cerrarModal();
    };
    document.addEventListener("keydown", escListener);

    document.body.appendChild(modal);
  }

  function render() {

    if (!productos || !productos.length) return;

    catalogo.innerHTML = "";

    const texto = busqueda.value.toLowerCase();
    const categoria = categoriaSelect.value;

    // Generar categorías solo una vez
    if (categoriaSelect.options.length <= 1) {

      const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

      categoriaSelect.innerHTML = `<option value="all">Todas las categorías</option>`;

      categoriasUnicas.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        categoriaSelect.appendChild(opt);
      });
    }

    productos
      .filter(p =>
        p.nombre.toLowerCase().includes(texto) &&
        (categoria === "all" || p.categoria === categoria)
      )
      .forEach(p => {

        const card = document.createElement("div");
        card.className = "producto";

        const imgContainer = document.createElement("div");
        imgContainer.className = "producto-img";

        const img = obtenerImagen(p.imagenBase);
        imgContainer.appendChild(img);

        card.appendChild(imgContainer);

        const precioHTML = p.precio
          ? `<strong>$${p.precio}</strong>`
          : "";

        card.innerHTML += `
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          ${precioHTML}
        `;

        card.onclick = () => abrirModal(p);

        catalogo.appendChild(card);
      });
  }

  // 🔥 Hacer render global para que puedas llamarlo desde donde cargás el CSV
  window.render = render;

  busqueda.addEventListener("input", render);
  categoriaSelect.addEventListener("change", render);
}