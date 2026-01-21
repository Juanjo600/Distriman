document.addEventListener("DOMContentLoaded", () => {

    const cargar = (selector, url) => {
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
          return res.text();
        })
        .then(html => {
          document.querySelector(selector).innerHTML = html;
        })
        .catch(err => console.error(err));
    };
  
    cargar("#header", "partials/header.html");
    cargar("#footer", "partials/footer.html");
  
  });
  