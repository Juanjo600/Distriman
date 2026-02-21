let productos = [];

document.addEventListener("DOMContentLoaded", function () {

  fetch('data/productos.csv')
    .then(response => response.text())
    .then(csv => {

      const resultado = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false // ⚠️ lo desactivo para limpiar nosotros
      });

      resultado.data.forEach((item, index) => {

        // Función para limpiar texto (sacar comillas y null)
        const limpiar = (valor) => {
          if (!valor) return "";
          return valor.toString().replace(/^"(.*)"$/, '$1').trim();
        };

        const imagenBase = limpiar(item.imagen_base);

        productos.push({
          id: `producto-${index}`,
          nombre: limpiar(item.nombre),
          categoria: limpiar(item.categoria),
          descripcion: limpiar(item.descripcion),
          precio: limpiar(item.precio) === "null" ? "" : limpiar(item.precio),
          imagenBase: imagenBase
        });

      });

      console.log("Productos cargados:", productos);

      // ⚠️ Ahora sí renderizamos cuando YA están cargados
      if (typeof renderProductos === "function") {
        renderProductos(productos);
      } else if (typeof render === "function") {
        render();
      }

    })
    .catch(error => {
      console.error("Error cargando CSV:", error);
    });

});