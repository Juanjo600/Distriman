const catalogo = document.getElementById("catalogo");
const busqueda = document.getElementById("busqueda");
const categoriaSelect = document.getElementById("categoria");

if (catalogo) {

  const categorias = [...new Set(productos.map(p => p.categoria))];
  categorias.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categoriaSelect.appendChild(opt);
  });

  function abrirModal(producto) {
    let index = 0;

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
            <button class="modal-arrow left">‹</button>
            <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
            <button class="modal-arrow right">›</button>
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

    const img = modal.querySelector("img");
    const close = modal.querySelector(".modal-close");
    const left = modal.querySelector(".modal-arrow.left");
    const right = modal.querySelector(".modal-arrow.right");

    left.onclick = () => {
      index = (index - 1 + producto.imagenes.length) % producto.imagenes.length;
      img.src = producto.imagenes[index];
    };

    right.onclick = () => {
      index = (index + 1) % producto.imagenes.length;
      img.src = producto.imagenes[index];
    };

    close.onclick = () => modal.remove();
    modal.onclick = e => e.target === modal && modal.remove();

    document.body.appendChild(modal);
  }

  function render() {
    catalogo.innerHTML = "";

    const texto = busqueda.value.toLowerCase();
    const categoria = categoriaSelect.value;

    productos
      .filter(p =>
        p.nombre.toLowerCase().includes(texto) &&
        (categoria === "all" || p.categoria === categoria)
      )
      .forEach(p => {

        let index = 0;

        const card = document.createElement("div");
        card.className = "producto";

        card.innerHTML = `
          <div class="producto-img">
            <button class="flecha izq">‹</button>
            <img src="${p.imagenes[0]}" alt="${p.nombre}">
            <button class="flecha der">›</button>
          </div>
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <strong>$${p.precio}</strong>
        `;

        const img = card.querySelector("img");
        const izq = card.querySelector(".izq");
        const der = card.querySelector(".der");

        izq.onclick = e => {
          e.stopPropagation();
          index = (index - 1 + p.imagenes.length) % p.imagenes.length;
          img.src = p.imagenes[index];
        };

        der.onclick = e => {
          e.stopPropagation();
          index = (index + 1) % p.imagenes.length;
          img.src = p.imagenes[index];
        };

        card.onclick = () => abrirModal(p);

        catalogo.appendChild(card);
      });
  }

  busqueda.addEventListener("input", render);
  categoriaSelect.addEventListener("change", render);

  render();
}
