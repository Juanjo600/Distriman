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

        if (valor === undefined || valor === null) return null;

        valor = valor.toString().trim();

        if (valor.startsWith('"') && valor.endsWith('"')) {
          valor = valor.slice(1, -1);
        }

        valor = valor.trim();

        if (valor === "" || valor.toLowerCase() === "null") {
          return null;
        }

        return valor;
      };

      productos = resultado.data.map((item, index) => {

        const nombre = limpiar(item.nombre);
        const categoria = limpiar(item.categoria);
        const descripcion = limpiar(item.descripcion);
        const precioRaw = limpiar(item.precio);
        const imagenBase = limpiar(item["NOMBRE FOTO"]);
        const medidaRaw = limpiar(item.medida);

        return {
          id: `producto-${index}`,
          nombre: nombre || "",
          categoria: categoria || "",
          descripcion: descripcion || "",
          precio: precioRaw ? Number(precioRaw) : null,
          imagenBase: imagenBase || null,
          medidas: medidaRaw ? medidaRaw.split(",").map(m => m.trim()) : []
        };

      });

      if (typeof window.render === "function") {
        window.render();
      }

    })
    .catch(error => {
      console.error("Error cargando CSV:", error);
    });

});