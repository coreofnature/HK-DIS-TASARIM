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

    // --- 2. Hero Section Arka Plan Slider (Kusursuz Fade-In / Fade-Out) ---
    const heroSection = document.getElementById('hero');
    
    // Masaüstü ve Mobil için banner listeleri
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

    // Pürüzsüz çapraz geçiş (crossfade) için iki arka plan katmanı oluşturuyoruz
    heroSection.style.backgroundImage = 'none'; // CSS'teki varsayılan resmi eziyoruz
    
    const bg1 = document.createElement('div');
    const bg2 = document.createElement('div');
    
    const bgStyles = `
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background-size: cover;
        background-position: center;
        transition: opacity 1.5s ease-in-out; /* 1.5 saniyelik yumuşak geçiş */
        z-index: 0;
    `;
    
    bg1.style.cssText = bgStyles;
    bg2.style.cssText = bgStyles;
    bg2.style.opacity = '0'; // 2. katman başlangıçta gizli
    
    // Katmanları hero section'ın içine (karanlık overlay'in arkasına) ekliyoruz
    heroSection.insertBefore(bg2, heroSection.firstChild);
    heroSection.insertBefore(bg1, heroSection.firstChild);

    let activeBg = bg1;
    let inactiveBg = bg2;

    function setHeroBackground() {
        // Sıradaki resmi görünmeyen (inaktif) katmana yükle
        inactiveBg.style.backgroundImage = `url('${currentImages[currentIndex]}')`;
        
        // Görünmeyen katmanı yavaşça aydınlat (Fade In)
        inactiveBg.style.opacity = '1';
        // Görünen katmanı yavaşça karart (Fade Out)
        activeBg.style.opacity = '0';
        
        // Katmanların rolünü değiştir (Swap)
        let temp = activeBg;
        activeBg = inactiveBg;
        inactiveBg = temp;
    }

    // Sayfa açıldığında ilk görseli yükle
    activeBg.style.backgroundImage = `url('${currentImages[currentIndex]}')`;
    activeBg.style.opacity = '1';

    // 5 saniyede bir görseli değiştir
    setInterval(() => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        setHeroBackground();
    }, 5000);

    // Ekran boyutu değişirse (PC'den mobile geçerse vs.)
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            currentImages = isMobile ? mobileImages : desktopImages;
            currentIndex = 0; // Başa dön
            
            // Hemen yeni cihazın ilk görseline geçiş yap
            activeBg.style.backgroundImage = `url('${currentImages[currentIndex]}')`;
        }
    });
});