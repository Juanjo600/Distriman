let productos = [];

document.addEventListener("DOMContentLoaded", function () {

  fetch('data/productos.csv')
    .then(response => response.text())
    .then(csv => {

      const resultado = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false
      });

      const limpiar = (valor) => {
        if (!valor) return "";
        return valor.toString().replace(/^"(.*)"$/, '$1').trim();
      };

      productos = resultado.data.map((item, index) => {

        const imagenBase = limpiar(item.imagen_base);

        return {
          id: `producto-${index}`,
          nombre: limpiar(item.nombre),
          categoria: limpiar(item.categoria),
          descripcion: limpiar(item.descripcion),
          precio: limpiar(item.precio) === "null" ? "" : limpiar(item.precio),
          imagenBase: imagenBase
        };

      });

      console.log("Productos cargados:", productos);

      // 🔥 IMPORTANTE: renderizar inmediatamente
      if (typeof render === "function") {
        render();
      }

    })
    .catch(error => {
      console.error("Error cargando CSV:", error);
    });

});