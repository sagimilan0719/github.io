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
});