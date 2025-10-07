document.addEventListener('DOMContentLoaded', function() {


    const form = document.querySelector('.contact-form'); // element - referencia al formulario html
    console.log('JavaScript cargado correctamente');
    console.log('Formulario encontrado:', form ? 'Si' : 'No');
   
    if (!form) {


        console.error('ERROR: No se encontro el formulario con clase .contact-form');
        return;
    }


    form.addEventListener('submit', async function(event) {
        event.preventDefault();
       
        console.log('Enviando formulario...');
       
        const formData = {
            nombre: form.nombre.value.trim(),  
            email: form.email.value.trim(),   
            servicio: form.servicio.value.trim(),     
            presupuesto: form.presupuesto.value.trim(),
            asunto: form.asunto.value.trim(),  
            mensaje: form.mensaje.value.trim()
        };
       
        console.log('Datos a enviar:', formData);
       
        if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (!formData.servicio) {
            alert('Por favor selecciona un servicio de interés');
            form.servicio.focus();
            return;
        }
        
        if (!formData.presupuesto) {
            alert('Por favor selecciona un rango de presupuesto');
            form.presupuesto.focus();
            return;
        }
       
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Por favor ingresa un email valido');
            return;
        }
       
        if (formData.nombre.length < 2) {
            alert('El nombre debe tener al menos 2 caracteres');
            return;
        }
       
        if (formData.mensaje.length < 10) {
            alert('El mensaje debe tener al menos 10 caracteres');
            return;
        }
       
        const submitBtn = form.querySelector('button[type="submit"]');
        const textoOriginal = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
       
        try {
            console.log('Enviando peticion a /api/contact');
           
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
           
            console.log('Respuesta del servidor:', response.status);
           
            const result = await response.json();
            console.log('Datos de respuesta:', result);
           
            if (result.success) {
                alert('Mensaje enviado correctamente! Te respondere pronto.');
                form.reset();
            } else {
                alert('Error: ' + result.message);
            }
           
        } catch (error) {


            console.error('Error completo:', error);
            alert('Error al enviar el mensaje. Verifica que el servidor este corriendo.');
        } finally {


            submitBtn.textContent = textoOriginal;
            submitBtn.disabled = false;
        }
    });

    
});

/ *Carousel functionality*/
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        const totalSlides = slides.length;

        function showSlide(index) {
            const carousel = document.getElementById('projectCarousel');
            carousel.style.transform = `translateX(-${index * 100}%)`;
            
            // Update indicators
            indicators.forEach(indicator => indicator.classList.remove('active'));
            indicators[index].classList.add('active');
            
            currentSlideIndex = index;
        }

        function nextSlide() {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            showSlide(currentSlideIndex);
        }

        function prevSlide() {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentSlideIndex);
        }

        function currentSlide(index) {
            showSlide(index - 1);
        }

        // Event listeners
        document.getElementById('nextBtn').addEventListener('click', nextSlide);
        document.getElementById('prevBtn').addEventListener('click', prevSlide);

        // Auto-advance carousel
        setInterval(nextSlide, 6000);

        // Keyboard navigation
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') nextSlide();
            if (event.key === 'ArrowLeft') prevSlide();
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        const carouselContainer = document.querySelector('.carousel-container');
        
        carouselContainer.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
        });

        carouselContainer.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) nextSlide();
            if (touchEndX - touchStartX > 50) prevSlide();
        });