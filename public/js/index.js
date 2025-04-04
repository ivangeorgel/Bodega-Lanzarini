
// FUNCION DEL CARRITO

document.addEventListener('DOMContentLoaded', function() {
  
  //  Agregar al carrito
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  if (addToCartButtons) {
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
  }

  function addToCart(event) {
      const button = event.target;
      const wineId = button.getAttribute('data-id');
      const existingItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
      
      if (existingItems[wineId]) {
          existingItems[wineId]++;
      } else {
          existingItems[wineId] = 1;
      }

      localStorage.setItem('cart', JSON.stringify(existingItems));
  }
  
  //  Mostrar diapositivas de fondo
  const slides = document.querySelectorAll('.background-slide');
  if (slides.length > 0) {
    let currentSlide = 0;
  
    function showSlide(n) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }
  
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        showSlide(currentSlide + 1);
      });
    }
  }
  
  //  Barra de navegación
  const barraNavegacion = document.getElementById('barraNavegacion');
  if (barraNavegacion) {
    barraNavegacion.addEventListener('mouseover', function() {
      this.style.backgroundColor = '';
    });
  }

  

// Menu de hamburguesa

function toggleMenu() {
  const lista = document.getElementById('lista');
  lista.style.display = lista.style.display === 'flex' ? '' : 'flex';
}


//Efecto de ampliacion 

function changeImage(imageSrc) {
    const currentImage = document.getElementById('currentImage');
    currentImage.src = imageSrc;
}

function scaleUp(element) {
    element.classList.add('scale-up');
}

function scaleDown(element) {
    element.classList.remove('scale-up');
}
//  Validaciones del formulario
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const nombre = document.getElementById('Nombre1').value.trim();
        const email = document.getElementById('Email1').value.trim();
        const mensaje = document.getElementById('Mensaje1').value.trim();

        console.log("Nombre:", nombre);
        console.log("Email:", email);
        console.log("Mensaje:", mensaje);

        if (!nombre) {
            alert('Por favor, ingresa tu nombre.');
            return;
        }

        if (!email) {
            alert('Por favor, ingresa tu email.');
            return;
        }

        if (!mensaje) {
            alert('Por favor, ingresa tu mensaje.');
            return;
        }

        form.reset();
    });
  }
});

// Peticiones del formulario al backend, esto va a enviar datos al servidor usando fetch

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Capturar los valores del formulario
        const nombreInput = document.getElementById("Nombre1");
        const emailInput = document.getElementById("Email1");
        const mensajeInput = document.getElementById("Mensaje1");

        if (!nombreInput || !emailInput || !mensajeInput) {
            console.error("❌ Uno o más campos no fueron encontrados en el HTML.");
            return;
        }

        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const mensaje = mensajeInput.value.trim();

        // Verificar en consola si los datos se capturan correctamente
        console.log("Nombre capturado:", `"${nombre}"`);
        console.log("Email capturado:", `"${email}"`);
        console.log("Mensaje capturado:", `"${mensaje}"`);

        // Validación básica
        if (!nombre || !email || !mensaje) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        // Crear objeto con los datos a enviar
        const formData = { nombre, email, mensaje };

        try {
          const response = await fetch("https://bodega-lanzarini-production.up.railway.app/enviar-mensaje", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        

            const data = await response.json();
            console.log("📩 Respuesta del servidor:", data);

            if (response.ok) {
                alert("✅ Mensaje enviado correctamente.");
                form.reset(); // Limpiar el formulario
            } else {
                alert("❌ Error al enviar mensaje: " + (data.error || "Error desconocido"));
            }
        } catch (error) {
            console.error("❌ Error en la solicitud:", error);
            alert("❌ No se pudo conectar con el servidor.");
        }
    });
  }
});