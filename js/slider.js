document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".slide");
    const next = document.querySelector(".slider-btn.next");
    const prev = document.querySelector(".slider-btn.prev");
  
    if (!slides.length) return;
  
    let current = 0;
  
    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove("active"));
      slides[index].classList.add("active");
    }
  
    next.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });
  
    prev.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });
  
    // autoplay
    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 5000);
  
  });
  