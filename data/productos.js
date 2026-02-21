let productos = [];

document.addEventListener("DOMContentLoaded", function () {

  fetch('data/productos.csv')
    .then(response => response.text())
    .then(csv => {

      const resultado = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });

      resultado.data.forEach((item, index) => {

        const imagenBase = item.imagen_base?.trim();

        let listaImagenes = [];

        if (imagenBase) {
          // Intentamos primero webp
          listaImagenes.push(`img/${imagenBase}.webp`);
        }

        productos.push({
          id: `producto-${index}`,
          nombre: item.nombre?.trim(),
          categoria: item.categoria?.trim(),
          descripcion: item.descripcion?.trim(),
          precio: item.precio,
          imagenes: listaImagenes,
          imagenBase: imagenBase // guardamos base para fallback
        });

      });

      console.log("Productos cargados:", productos);

      if (typeof renderProductos === "function") {
        renderProductos(productos);
      }

    })
    .catch(error => {
      console.error("Error cargando CSV:", error);
    });

});