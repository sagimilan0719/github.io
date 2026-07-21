import os

# ---- Messe München slides ----
base = '/Users/biamilu/Downloads/portfolio/banners/messe_munchen/'

src = open(base + 'slide_01.html', encoding='utf-8').read()

# slide_02: headlineShadow, bg_02, headlline: Güçlü ilişkiler., opacity 0.4, no logo
s2 = src
s2 = s2.replace('V1_01.jpg', 'V1_02.jpg')
s2 = s2.replace('logo headlineShadow">', 'headlineShadow">')
s2 = s2.replace('Güvenilir gayrimenkul çözümleri.', 'Güçlü ilişkiler.')
s2 = s2.replace('opacity: 0.15;', 'opacity: 0.4;')
s2 = s2.replace('src="exporeal_logo.svg"', 'src=""')
open(base + 'slide_02.html', 'w', encoding='utf-8').write(s2)

# slide_03: logo headlineShadow, bg_03, headline: Değerli bağlantılar., opacity 0.25
s3 = src
s3 = s3.replace('V1_01.jpg', 'V1_03.jpg')
s3 = s3.replace('Güvenilir gayrimenkul çözümleri.', 'Değerli bağlantılar.')
s3 = s3.replace('opacity: 0.15;', 'opacity: 0.25;')
open(base + 'slide_03.html', 'w', encoding='utf-8').write(s3)

# slide_04: logo cta top up, bg_05, headline: Liderlerle etkileşime girin., subheadline, cta
s4 = src
s4 = s4.replace('V1_01.jpg', 'V1_05.jpg')
s4 = s4.replace('logo headlineShadow">', 'logo cta top up">')
s4 = s4.replace('Güvenilir gayrimenkul çözümleri.', 'Liderlerle etkileşime girin.')
s4 = s4.replace('<div class="headline_shadow_layer" style="opacity: 0.15;"></div>', '<div class="headline_shadow_layer"></div>')
s4 = s4.replace('<p class="subheadline_text_1"></p>', '<p class="subheadline_text_1">5–7 Ekim 2026, Messe München</p>')
s4 = s4.replace('<p class="cta_text cta_text_1"></p>', '<p class="cta_text cta_text_1" style="font-size: 1.9rem;">Erken rezervasyon biletinizi alın</p>')
open(base + 'slide_04.html', 'w', encoding='utf-8').write(s4)

print('Messe München slides OK')

# ---- P&C slides ----
pc_base = '/Users/biamilu/Downloads/portfolio/banners/p&c_banner/'
pc_src = open(pc_base + 'index.html', encoding='utf-8').read()

def make_pc_slide(src, variant, bg, headline, sub1, sub2, date, cta, sticker1, sticker2):
    s = src
    s = s.replace('{{advert_name}}', 'Juli-Kampagne')
    s = s.replace('{{targeting_audiences_names}}', 'Düsseldorf')
    s = s.replace('href="[[css]]"', 'href="1200x1200.css"')
    s = s.replace('{{template_variant_class}}', variant)
    s = s.replace('{{click_url}}', '')
    s = s.replace('url({{background_image_1}})', 'url(' + bg + ')')
    s = s.replace('{{background_image_1}}', bg)
    s = s.replace('[[position_1]]', 'background-size: cover; background-position: center top;')
    s = s.replace('{{headline_style_1}}', '')
    s = s.replace('{{headline_text_1}}', headline)
    s = s.replace('{{subheadline_text_1}}', sub1)
    s = s.replace('{{subheadline_text_2}}', sub2)
    s = s.replace('{{date_text}}', date)
    s = s.replace('{{cta_text_1}}', cta)
    s = s.replace('{{sticker_image_1}}', sticker1)
    s = s.replace('{{sticker_image_2}}', sticker2)
    return s

common = {
    'headline': 'ON TOP AUF SALE',
    'sub1': 'ab 99€ Sale-Einkafswert*',
    'sub2': 'Nur für INSIDER und alle, die es werden!',
    'date': 'Bis zum 13.07.2026',
    'cta': '',
    'sticker1': 'discount_badge.png',
    'sticker2': 'in_store_only.png',
}

s1 = make_pc_slide(pc_src, 'logo',
    bg='sRGB_4K_2026-1-00103_HIGHSUMMER_DOB_008-1952_online.jpg', **common)
s1 = s1.replace(
    'background-size: cover; background-position: center top;',
    'background-size: cover; background-position: top; background-size: 145%; background-position-x: -540px; background-position-y: -502px;'
)
open(pc_base + 'slide_01.html', 'w', encoding='utf-8').write(s1)

s2 = make_pc_slide(pc_src, 'logo',
    bg='sRGB_4K_2026-1-00103_HIGHSUMMER_DOB_003-1002_online.jpg', **common)
open(pc_base + 'slide_02.html', 'w', encoding='utf-8').write(s2)

s3 = make_pc_slide(pc_src, 'logo blue',
    bg='sRGB_4K_2026-1-00103_HIGHSUMMER_DOB_003-1002_online.jpg', **common)
open(pc_base + 'slide_03.html', 'w', encoding='utf-8').write(s3)

print('P&C slides OK')
