let xPos = 0;

gsap.timeline()
    .set('.ring', { rotationY: 180, cursor: 'grab' }) // set initial rotationY so the parallax jump happens off-screen
    .set('.img', { // apply transform rotations to each image
        rotateY: (i) => i * -36,
        transformOrigin: '50% 50% 500px',
        z: -500,
        backgroundImage: (i) => 'url(' + getImageUrl(i) + ')', // Use getImageUrl function to get individual image URLs
        backgroundPosition: (i) => getBgPos(i),
        backfaceVisibility: 'hidden'
    })
    .from('.img', {
        duration: 1.5,
        y: 200,
        opacity: 0,
        stagger: 0.1,
        ease: 'expo'
    })
    .add(() => {
        document.querySelectorAll('.img').forEach(img => {
            img.addEventListener('mouseenter', (e) => {
                let current = e.currentTarget;
                gsap.to('.img', { opacity: (i, t) => (t == current) ? 1 : 0.5, ease: 'power3' })
            });

            img.addEventListener('mouseleave', (e) => {
                gsap.to('.img', { opacity: 1, ease: 'power2.inOut' })
            });
        });
    }, '-=0.5');

document.addEventListener('mousedown', dragStart);
document.addEventListener('touchstart', dragStart);

function dragStart(e) {
    if (e.touches) e.clientX = e.touches[0].clientX;
    xPos = Math.round(e.clientX);
    gsap.set('.ring', { cursor: 'grabbing' });
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
}

function drag(e) {
    if (e.touches) e.clientX = e.touches[0].clientX;
    gsap.to('.ring', {
        rotationY: '-=' + ((Math.round(e.clientX) - xPos) % 360),
        onUpdate: () => { gsap.set('.img', { backgroundPosition: (i) => getBgPos(i) }) }
    });

    xPos = Math.round(e.clientX);
}

document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);

function dragEnd(e) {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    gsap.set('.ring', { cursor: 'grab' });
}

// Create overlay element for enlarged view
const overlay = document.createElement('div');
overlay.className = 'enlarged-overlay';
overlay.style.display = 'none';
overlay.innerHTML = `
    <div class="enlarged-container">
        <img class="enlarged-img" src="" alt="Enlarged view">
        <button class="close-btn">&times;</button>
    </div>
`;
document.body.appendChild(overlay);

// Add click event to images
document.querySelectorAll('.img').forEach(img => {
    img.addEventListener('click', (e) => {
        // Get the index of the clicked image
        const index = Array.from(document.querySelectorAll('.img')).indexOf(e.currentTarget);
        
        // Get the corresponding image URL
        const imgUrl = getImageUrl(index);
        
        // Set the enlarged image source
        document.querySelector('.enlarged-img').src = imgUrl;
        
        // Show the overlay with animation
        gsap.to(overlay, {
            display: 'flex',
            opacity: 1,
            duration: 0.3
        });
    });
});

// Close button functionality
document.querySelector('.close-btn').addEventListener('click', () => {
    gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            overlay.style.display = 'none';
        }
    });
});

// Close when clicking outside the image
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                overlay.style.display = 'none';
            }
        });
    }
});

function getBgPos(i) { //returns the background-position string to create parallax movement in each image
    return (100 - gsap.utils.wrap(0, 360, gsap.getProperty('.ring', 'rotationY') - 180 - i * 36) / 500 * 500) + 'px 50%';
}

function getImageUrl(i) {
    // Define separate image URLs here for each image
    const imageUrls = [
        'images/img5.jpg',
        'images/img24.jpg',
        'images/img16.jpg',
        'images/img24.jpg',
        'images/img5.jpg',
        'images/img16.jpg',
        'images/img24.jpg',
        'images/img5.jpg',
        'images/img16.jpg',
        'images/img5.jpg'
    ];
    return imageUrls[i];
}

// Arrow controls functionality
const arrowLeft = document.querySelector('.arrow-left');
const arrowRight = document.querySelector('.arrow-right');
const rotationAmount = 36; // Degrees to rotate on each click

arrowLeft.addEventListener('click', () => {
    gsap.to('.ring', {
        rotationY: `+=${rotationAmount}`,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
            gsap.set('.img', { backgroundPosition: (i) => getBgPos(i) });
        }
    });
});

arrowRight.addEventListener('click', () => {
    gsap.to('.ring', {
        rotationY: `-=${rotationAmount}`,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
            gsap.set('.img', { backgroundPosition: (i) => getBgPos(i) });
        }
    });
});

// Keyboard arrow key support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        arrowLeft.click();
    } else if (e.key === 'ArrowRight') {
        arrowRight.click();
    }
});

// Fade out instruction text after 5 seconds
setTimeout(() => {
    gsap.to('.instruction', {
        opacity: 0.3,
        duration: 1,
        ease: 'power2.out'
    });
}, 5000);

// Make instruction text fully visible when hovering over gallery
document.querySelector('.container').addEventListener('mouseenter', () => {
    gsap.to('.instruction', {
        opacity: 0.8,
        duration: 0.3
    });
});

document.querySelector('.container').addEventListener('mouseleave', () => {
    gsap.to('.instruction', {
        opacity: 0.3,
        duration: 0.3
    });
});
