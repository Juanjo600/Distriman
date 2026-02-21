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
  
    const extensiones = ["webp", "jpg", "png"];
    let intento = 0;
  
    img.onerror = function () {
      intento++;
      if (intento < extensiones.length) {
        img.src = `img/${imagenBase}.${extensiones[intento]}`;
      } else {
        img.src = "img/placeholder.webp";
      }
    };
  
    // ⚠️ IMPORTANTE: asignamos src DESPUÉS de definir onerror
    img.src = `img/${imagenBase}.${extensiones[intento]}`;
  
    return img;
  }

  function abrirModal(producto) {

    const mensaje = encodeURIComponent(
      `Hola, estoy interesado en el producto: ${producto.nombre}`
    );

    const precioHTML = producto.precio
      ? `<div class="modal-precio">$${producto.precio}</div>`
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
            <p>${producto.descripcion}</p>
            ${precioHTML}

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
    modal.querySelector(".modal-img").appendChild(img);

    modal.querySelector(".modal-close").onclick = () => modal.remove();
    modal.onclick = e => e.target === modal && modal.remove();

    document.body.appendChild(modal);
  }

  function render() {

    if (!productos.length) return; // ⚠️ Evita render vacío antes de cargar

    catalogo.innerHTML = "";

    const texto = busqueda.value.toLowerCase();
    const categoria = categoriaSelect.value;

    // ⚠️ Solo generar categorías UNA vez
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

  // 🔥 ESTA es la clave para que aparezcan todos al entrar
  window.render = render;

  busqueda.addEventListener("input", render);
  categoriaSelect.addEventListener("change", render);
}