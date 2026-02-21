const catalogo = document.getElementById("catalogo");
const busqueda = document.getElementById("busqueda");
const categoriaSelect = document.getElementById("categoria");

if (catalogo) {

  function obtenerImagen(imagenBase) {
    const img = document.createElement("img");
    img.loading = "lazy";

    img.src = `img/${imagenBase}.webp`;

    img.onerror = function () {
      if (this.src.includes(".webp")) {
        this.src = `img/${imagenBase}.jpg`;
      } else if (this.src.includes(".jpg")) {
        this.src = `img/${imagenBase}.png`;
      }
    };

    return img;
  }

  function abrirModal(producto) {

    const mensaje = encodeURIComponent(
      `Hola, estoy interesado en el producto: ${producto.nombre}`
    );

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close">×</span>

        <div class="modal-body">
          <div class="modal-img">
            <img id="modal-img" alt="${producto.nombre}">
          </div>

          <div class="modal-info">
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <div class="modal-precio">$${producto.precio}</div>

            <a
              class="modal-cta"
              href="https://wa.me/59894862909?text=${mensaje}"
              target="_blank"
            >
              ¿Interesado? Contactate con nosotros
            </a>
          </div>
        </div>
      </div>
    `;

    const img = obtenerImagen(producto.imagenBase);
    img.id = "modal-img";

    modal.querySelector(".modal-img").appendChild(img);

    modal.querySelector(".modal-close").onclick = () => modal.remove();
    modal.onclick = e => e.target === modal && modal.remove();

    document.body.appendChild(modal);
  }

  function render() {
    catalogo.innerHTML = "";

    const texto = busqueda.value.toLowerCase();
    const categoria = categoriaSelect.value;

    const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

    categoriaSelect.innerHTML = `<option value="all">Todas las categorías</option>`;
    categoriasUnicas.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categoriaSelect.appendChild(opt);
    });

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

        card.innerHTML += `
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <strong>$${p.precio}</strong>
        `;

        card.onclick = () => abrirModal(p);

        catalogo.appendChild(card);
      });
  }

  busqueda.addEventListener("input", render);
  categoriaSelect.addEventListener("change", render);

  render();
}