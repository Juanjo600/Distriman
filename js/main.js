const catalogo = document.getElementById("catalogo");
const busqueda = document.getElementById("busqueda");
const categoriaSelect = document.getElementById("categoria");
const medidaSelect = document.getElementById("medida");

if (catalogo) {

  function obtenerImagen(imagenBase) {
    const img = document.createElement("img");
    img.loading = "lazy";

    if (!imagenBase) {
      img.src = "img/placeholder.webp";
      return img;
    }

    img.src = `img/${imagenBase}`;
    return img;
  }

  function abrirModal(producto) {
    document.body.style.overflow = "hidden";
  
    const mensaje = encodeURIComponent(
      `Hola, estoy interesado en el producto: ${producto.nombre}`
    );
  
    const descripcionFormateada = producto.descripcion.replace(/\n/g, "<br>");
  
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
            ${precioHTML}
            <div class="modal-descripcion">${descripcionFormateada}</div>
  
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
  
    // Insertar la imagen
    const img = obtenerImagen(producto.imagenBase);
    const imgContainer = modal.querySelector(".modal-img");
    imgContainer.appendChild(img);
  
    // ----------- ZOOM LENTE -----------
    const lente = document.createElement("div");
    lente.className = "zoom-lente";
    imgContainer.appendChild(lente);
  
    imgContainer.addEventListener("mousemove", e => {
      lente.style.display = "block";
  
      const rect = e.currentTarget.getBoundingClientRect();
      let x = e.clientX - rect.left - lente.offsetWidth / 2;
      let y = e.clientY - rect.top - lente.offsetHeight / 2;
  
      // Limitar para que no salga de la imagen
      x = Math.max(0, Math.min(x, rect.width - lente.offsetWidth));
      y = Math.max(0, Math.min(y, rect.height - lente.offsetHeight));
  
      lente.style.left = x + "px";
      lente.style.top = y + "px";
  
      // Fondo para el zoom
      lente.style.backgroundImage = `url(${producto.imagenBase ? `img/${producto.imagenBase}` : "img/placeholder.webp"})`;
      lente.style.backgroundSize = `${rect.width * 2}px ${rect.height * 2}px`; // zoom 2x
      lente.style.backgroundPosition = `-${x*2}px -${y*2}px`;
    });
  
    imgContainer.addEventListener("mouseleave", () => {
      lente.style.display = "none";
    });
    // -----------------------------------
  
    // Cerrar modal
    modal.querySelector(".modal-close").onclick = () => {
      document.body.style.overflow = "";
      modal.remove();
    };
  
    modal.onclick = e => {
      if (e.target === modal) {
        document.body.style.overflow = "";
        modal.remove();
      }
    };
  
    document.body.appendChild(modal);
  }

  function render() {

    if (!productos.length) return;

    catalogo.innerHTML = "";

    const texto = busqueda.value.toLowerCase();
    const categoria = categoriaSelect.value;
    const medida = medidaSelect.value;

    // Categorías
    if (categoriaSelect.options.length <= 1) {
      const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

      categoriasUnicas.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        categoriaSelect.appendChild(opt);
      });
    }

    // Medidas
    if (medidaSelect.options.length <= 1) {
      const medidasUnicas = [
        ...new Set(productos.flatMap(p => p.medidas))
      ];

      medidasUnicas.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        medidaSelect.appendChild(opt);
      });
    }

    productos
      .filter(p =>
        p.nombre.toLowerCase().includes(texto) &&
        (categoria === "all" || p.categoria === categoria) &&
        (medida === "all" || p.medidas.includes(medida))
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

        const medidasHTML = p.medidas.length
          ? `<div class="producto-medida">${p.medidas.join(" / ")}</div>`
          : "";

        card.innerHTML += `
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          ${medidasHTML}
          ${precioHTML}
        `;

        card.onclick = () => abrirModal(p);

        catalogo.appendChild(card);
      });
  }

  window.render = render;

  busqueda.addEventListener("input", render);
  categoriaSelect.addEventListener("change", render);
  medidaSelect.addEventListener("change", render);
}