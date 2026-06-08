// --- 1. KÁRTYÁK SZŰRÉSE (Összes / Statikus / DCO) ---
function filterSelection(category) {
    const items = document.querySelectorAll('.filter-item');
    const buttons = document.querySelectorAll('.filter-buttons .btn');
    
    // Gombok aktív állapotának vizuális cseréje
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Kártyák megjelenítése/elrejtése
    items.forEach(item => {
        if (category === 'all') {
            item.style.display = 'flex';
        } else {
            if (item.classList.contains(category)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// --- 2. NYELVVÁLTÓ LOGIKA (HU / EN) ---
function switchLanguage(lang) {
    // A szövegek cseréje az összes 'lang-text' osztállyal rendelkező elemen
    const elements = document.querySelectorAll('.lang-text');
    elements.forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText) {
            el.innerHTML = newText; // innerHTML-t használunk, ha esetleg <br> lenne a szövegben
        }
    });

    // A gombok aktív állapotának frissítése (jobb felső sarok)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Elmentjük a böngészőbe a választást
    localStorage.setItem('portfolioLang', lang);
}

// --- 3. INICIALIZÁLÁS BETÖLTÉSKOR ---
window.addEventListener('DOMContentLoaded', () => {
    // Megnézzük, volt-e már elmentett nyelv, ha nem, a magyar az alapértelmezett
    const savedLang = localStorage.getItem('portfolioLang') || 'hu';
    switchLanguage(savedLang);

    // --- 4. IFRAME ANIMÁCIÓK INDÍTÁSA GÖRGETÉSRE ---
    const animatedGroups = document.querySelectorAll('.scroll-animated-group');
    const deferredIframes = [];

    animatedGroups.forEach(group => {
        group.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.getAttribute('src');
            if (!src || src === 'about:blank') return;

            iframe.dataset.lazySrc = src;
            iframe.setAttribute('src', 'about:blank');
            iframe.setAttribute('loading', 'lazy');
            deferredIframes.push(iframe);
        });
    });

    if (!deferredIframes.length) return;

    const startIframe = (iframe) => {
        const lazySrc = iframe.dataset.lazySrc;
        if (!lazySrc) return;

        iframe.setAttribute('src', lazySrc);
        delete iframe.dataset.lazySrc;
    };

    if (!('IntersectionObserver' in window)) {
        deferredIframes.forEach(startIframe);
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const group = entry.target;
            group.querySelectorAll('iframe').forEach(startIframe);
            obs.unobserve(group);
        });
    }, {
        root: null,
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px'
    });

    animatedGroups.forEach(group => observer.observe(group));
});