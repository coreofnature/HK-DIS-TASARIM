document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Mobil Menü İşlemleri ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    // Menüden bir linke tıklandığında menüyü kapat
    document.querySelectorAll(".nav-menu li a").forEach(n => n.addEventListener("click", () => {
        navMenu.classList.remove("active");
    }));


    // --- 2. Hero Section Arka Plan Slider ---
    const heroSection = document.getElementById('hero');
    
    // Klasörüne eklediğin resimlerin isimleri
    const images = [
        'assets/img/hakan10.jpg', // İlk açılış görseli (Taş duvar işçiliği harika durur)
        'assets/img/hakan3.png',
        'assets/img/hakan9.jpg',
        'assets/img/hakan1.jpg',
        'assets/img/hakan2.jpg'
    ];

    let currentIndex = 0;

    // İlk görseli hemen ata
    heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;

    // 5 saniyede bir görseli değiştir
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        heroSection.style.backgroundImage = `url('${images[currentIndex]}')`;
    }, 5000); // 5000ms = 5 Saniye
});