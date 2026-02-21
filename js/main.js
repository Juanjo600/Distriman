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
  
    const imgContainer = modal.querySelector(".modal-img");
    const img = obtenerImagen(producto.imagenBase);
    imgContainer.appendChild(img);
  
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
  
    // ---------------- ZOOM LENTE OPTIMIZADO ----------------
    const lente = document.createElement("div");
    lente.className = "zoom-lente";
    imgContainer.appendChild(lente);
  
    lente.style.width = "250px";   // Lente más grande
    lente.style.height = "250px";
    lente.style.border = "2px solid rgba(0,0,0,0.2)";
    lente.style.borderRadius = "4px";
    lente.style.position = "absolute";
    lente.style.pointerEvents = "none"; // No bloquear el mouse
    lente.style.display = "none";
  
    img.onload = () => {
      const zoomFactor = 1.2; // zoom más moderado
  
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
  
      imgContainer.addEventListener("mousemove", e => {
        lente.style.display = "block";
  
        const rect = imgContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
  
        // Posición de la lente centrada en el mouse
        const lensX = x - lente.offsetWidth / 2;
        const lensY = y - lente.offsetHeight / 2;
  
        lente.style.left = lensX + "px";
        lente.style.top = lensY + "px";
  
        // Background position proporcional
        const bgX = (x / rect.width) * naturalWidth * -zoomFactor + lente.offsetWidth / 2;
        const bgY = (y / rect.height) * naturalHeight * -zoomFactor + lente.offsetHeight / 2;
  
        lente.style.backgroundImage = `url(${img.src})`;
        lente.style.backgroundSize = `${naturalWidth * zoomFactor}px ${naturalHeight * zoomFactor}px`;
        lente.style.backgroundPosition = `${bgX}px ${bgY}px`;
      });
  
      imgContainer.addEventListener("mouseleave", () => {
        lente.style.display = "none";
      });
    };
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