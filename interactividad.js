document.addEventListener('DOMContentLoaded', () => {
    const galaxia = document.querySelector('.galaxia');
    const planetas = document.querySelectorAll('.planeta');
    let isDragging = false;
    let startX, startY;
    let rotationY = 0, rotationX = 0;
    const scaleSpeed = 0.001;
    let currentScale = 1;

    // Nuevas constantes para los botones
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    function updateTransforms() {
        galaxia.style.transform = `scale(${currentScale}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        
        planetas.forEach(planeta => {
            planeta.style.transform = `translate3d(${planeta.dataset.x}px, ${planeta.dataset.y}px, ${planeta.dataset.z}px) rotateY(${-rotationY}deg) rotateX(${-rotationX}deg)`;
        });
    }

    function posicionarAleatoriamente() {
        // Ajustamos los rangos para dispositivos móviles
        const rangoX = 1000;
        const rangoY = 500;
        const rangoZ = 1000; 

        planetas.forEach(planeta => {
            const x = (Math.random() - 0.5) * rangoX * 2;
            const y = (Math.random() - 0.5) * rangoY * 2;
            const z = (Math.random() - 0.5) * rangoZ * 2;
            planeta.dataset.x = x;
            planeta.dataset.y = y;
            planeta.dataset.z = z;
        });
    }

    const galaxiaContainer = document.querySelector('.galaxia-container');

    galaxiaContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        currentScale += e.deltaY * -scaleSpeed;
        currentScale = Math.min(Math.max(0.25, currentScale), 3);
        updateTransforms();
    });

    // Funciones para el zoom con los botones
    const performZoom = (direction) => {
        const zoomStep = 0.2; // Cuánto cambia el zoom por cada clic
        if (direction === 'in') {
            currentScale += zoomStep;
        } else {
            currentScale -= zoomStep;
        }
        currentScale = Math.min(Math.max(0.25, currentScale), 3);
        updateTransforms();
    };

    // Eventos de clic para los botones
    zoomInBtn.addEventListener('click', () => performZoom('in'));
    zoomOutBtn.addEventListener('click', () => performZoom('out'));

    const startDrag = (clientX, clientY) => {
        isDragging = true;
        startX = clientX;
        startY = clientY;
        galaxiaContainer.style.cursor = 'grabbing';
    };

    const doDrag = (clientX, clientY) => {
        if (!isDragging) return;
        const rotateSpeed = 0.2;
        rotationY += (clientX - startX) * rotateSpeed;
        rotationX -= (clientY - startY) * rotateSpeed;
        updateTransforms();
        startX = clientX;
        startY = clientY;
    };

    const endDrag = () => {
        isDragging = false;
        galaxiaContainer.style.cursor = 'grab';
    };

    galaxiaContainer.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    galaxiaContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    galaxiaContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            doDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    galaxiaContainer.addEventListener('touchend', endDrag);

    posicionarAleatoriamente();
    updateTransforms();
});