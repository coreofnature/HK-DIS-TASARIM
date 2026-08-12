document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Mobil Menü İşlemleri ---
    const hamburger = document.querySelector(".hamburger");
    // Not: CSS güncellemelerinde burayı "nav ul" yapmıştık, eğer mobilde menü açılmazsa 
    // ".nav-menu" yazan yeri "nav ul" olarak değiştirmeyi unutma kankam.
    const navMenu = document.querySelector(".nav-menu"); 

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });

        // Menüden bir linke tıklandığında menüyü kapat
        document.querySelectorAll(".nav-menu li a").forEach(n => n.addEventListener("click", () => {
            navMenu.classList.remove("active");
        }));
    }

    // --- 2. Hero Section Arka Plan Slider & Progress Bar ---
    const heroSection = document.getElementById('hero');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    const progressFill = document.getElementById('progress-fill');
    
    // Masaüstü ve Mobil için banner listeleri (Kendi isimlerine göre ayarla)
    const desktopImages = [
        'assets/img/banner-1.jpg', 
        'assets/img/banner-2.jpg',
        'assets/img/banner-3.jpg'
    ];

    const mobileImages = [
        'assets/img/banner-mobil-1.jpg',
        'assets/img/banner-mobil-2.jpg',
        'assets/img/banner-mobil-3.jpg'
    ];

    let isMobile = window.innerWidth <= 768;
    let currentImages = isMobile ? mobileImages : desktopImages;
    let currentIndex = 0;
    const slideDuration = 4500; // 4 Saniye

    // Toplam slayt sayısını yazdır (başına 0 ekleyerek)
    totalSlidesEl.textContent = currentImages.length.toString().padStart(2, '0');

    // Çift katmanlı pürüzsüz geçiş için background katmanları
    heroSection.style.backgroundImage = 'none'; 
    const bg1 = document.createElement('div');
    const bg2 = document.createElement('div');
    
    const bgStyles = `
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background-size: cover;
        background-position: center;
        transition: opacity 1.5s ease-in-out;
        z-index: 0;
    `;
    
    bg1.style.cssText = bgStyles;
    bg2.style.cssText = bgStyles;
    bg2.style.opacity = '0'; 
    
    heroSection.insertBefore(bg2, heroSection.firstChild);
    heroSection.insertBefore(bg1, heroSection.firstChild);

    let activeBg = bg1;
    let inactiveBg = bg2;

    // Progress Bar ve Numarayı Güncelleyen Fonksiyon
    function updateProgress() {
        // Geçerli slayt numarasını güncelle
        currentSlideEl.textContent = (currentIndex + 1).toString().padStart(2, '0');
        
        // Progress barı sıfırla
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        
        // Tarayıcıyı değişime zorla (Reflow)
        void progressFill.offsetWidth;
        
        // Animasyonu başlat
        progressFill.style.transition = `width ${slideDuration}ms linear`;
        progressFill.style.width = '100%';
    }

    function setHeroBackground() {
        inactiveBg.style.backgroundImage = `url('${currentImages[currentIndex]}')`;
        inactiveBg.style.opacity = '1';
        activeBg.style.opacity = '0';
        
        let temp = activeBg;
        activeBg = inactiveBg;
        inactiveBg = temp;

        updateProgress();
    }

    // İlk açılış
    activeBg.style.backgroundImage = `url('${currentImages[currentIndex]}')`;
    activeBg.style.opacity = '1';
    updateProgress();

    // Döngüyü başlat
    let slideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        setHeroBackground();
    }, slideDuration);

    // Ekran boyutu değişirse sistemi güncelle
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            currentImages = isMobile ? mobileImages : desktopImages;
            currentIndex = 0; 
            totalSlidesEl.textContent = currentImages.length.toString().padStart(2, '0');
            
            activeBg.style.backgroundImage = `url('${currentImages[currentIndex]}')`;
            updateProgress();
            
            // İntervali sıfırla ki süre şaşmasın
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % currentImages.length;
                setHeroBackground();
            }, slideDuration);
        }
    });
});