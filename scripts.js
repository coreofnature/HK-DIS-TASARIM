document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Dinamik (Scroll) Navbar ve Mobil Menü İşlemleri ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("nav ul"); 
    const headerEl = document.getElementById("header"); // Çakışmayı önlemek için adını headerEl yaptık

    // Kullanıcı sayfayı kaydırdığında tetiklenir (Mobilde ve Desktopta)
    window.addEventListener('scroll', () => {
        // Eğer sayfa yukarıdan 50px'den fazla kaydırıldıysa
        if (window.scrollY > 50) {
            headerEl.classList.add('header-scrolled'); // Beyaz stili ekle
        } else {
            // Eğer mobil menü açıksa, sayfa yukarı çıksa bile beyaz kalmalı.
            // Sadece menü kapalıysa şeffaf stile dön.
            if(!navMenu.classList.contains("active")){
               headerEl.classList.remove('header-scrolled'); 
            }
        }
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            // Menüyü aç/kapat
            navMenu.classList.toggle("active");
            
            // Eğer sayfa en üstteyse ve menü açıldıysa, header'ı beyaz yap
            // Eğer menü kapatıldıysa ve sayfa hala en üstteyse, şeffaflığa geri dön
            if(navMenu.classList.contains("active")) {
                headerEl.classList.add("header-scrolled"); 
            } else {
                if(window.scrollY <= 50) {
                    headerEl.classList.remove("header-scrolled");
                }
            }
        });

        // Menüden bir linke tıklandığında menüyü kapat
        document.querySelectorAll(".nav-menu li a").forEach(n => n.addEventListener("click", () => {
            navMenu.classList.remove("active");
            if(window.scrollY <= 50) {
                headerEl.classList.remove("header-scrolled"); 
            }
        }));
    }

    // --- 2. Hero Section Arka Plan Slider & Progress Bar ---
    const heroSection = document.getElementById('hero');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    const progressFill = document.getElementById('progress-fill');
    
    // Masaüstü ve Mobil için banner listeleri
    const desktopImages = [
        'assets/img/banner/banner-1.jpg', 
        'assets/img/banner/banner-2.jpg',
        'assets/img/banner/banner-3.jpg'
    ];

    const mobileImages = [
        'assets/img/banner-mobile/banner-mobil-1.jpg',
        'assets/img/banner-mobile/banner-mobil-2.jpg',
        'assets/img/banner-mobile/banner-mobil-3.jpg'
    ];

    let isMobile = window.innerWidth <= 768;
    let currentImages = isMobile ? mobileImages : desktopImages;
    let currentIndex = 0;
    const slideDuration = 4500; // 4.5 Saniye

    // Toplam slayt sayısını yazdır (başına 0 ekleyerek)
    if(totalSlidesEl) {
        totalSlidesEl.textContent = currentImages.length.toString().padStart(2, '0');
    }

    // Çift katmanlı pürüzsüz geçiş için background katmanları
    if(heroSection) {
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
            if(!currentSlideEl || !progressFill) return;
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
                if(totalSlidesEl){
                     totalSlidesEl.textContent = currentImages.length.toString().padStart(2, '0');
                }
                
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
    }

    // --- 4. Lightbox (Referans Görsellerini Büyütme) İşlemleri ---
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");
    const triggers = document.querySelectorAll(".lightbox-trigger");

if (modal && modalImg && closeBtn) {
        triggers.forEach(img => {
            img.addEventListener("click", function() {
                modal.style.display = "block";
                modalImg.src = this.src; 
                
                // İlk 3 veriyi standart çekiyoruz
                const uygulama = this.getAttribute("data-uygulama") || "Belirtilmedi";
                const konum = this.getAttribute("data-konum") || "Belirtilmedi";
                const urunler = this.getAttribute("data-urunler") || "Belirtilmedi";
                
                // 4. Başlığın (Yıl veya Özellik) dinamik olarak belirlenmesi
                const yil = this.getAttribute("data-yil");
                const ozellik = this.getAttribute("data-ozellik");
                
                let dorduncuBaslik = "Yıl"; // Varsayılan başlık
                let dorduncuDeger = yil || "Belirtilmedi";
                
                // Eğer HTML'de data-ozellik kullanılmışsa başlığı "Özellik" yap
                if (ozellik) {
                    dorduncuBaslik = "Özellik";
                    dorduncuDeger = ozellik;
                }
                
                // 4'lü dinamik detay alanını HTML olarak içeriye basıyoruz
                captionText.innerHTML = `
                    <div class="lightbox-details">
                        <div class="detail-item">
                            <h4>Uygulama</h4>
                            <p>${uygulama}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Konum</h4>
                            <p>${konum}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Ürünler</h4>
                            <p>${urunler}</p>
                        </div>
                        <div class="detail-item">
                            <h4>${dorduncuBaslik}</h4>
                            <p>${dorduncuDeger}</p>
                        </div>
                    </div>
                `;
                
                // Arka planın kaymasını engelle
                document.body.style.overflow = "hidden";
            });
        });

        // X butonuna basınca kapat
        closeBtn.addEventListener("click", function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; 
        });

        // Resmin dışındaki karanlık alana tıklayınca da kapat
        modal.addEventListener("click", function(e) {
            if (e.target !== modalImg) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
});