# Design System — Neobrutalism

> Gaya desain yang diterapkan: **Neobrutalism** — tebal, keras, kontras tinggi, dan tidak malu-malu.

---

## Design Tokens

### Colors

```css
--color-text:       #280609    /* near-black */
--color-background: #e7fdfd    /* pale cyan */
--color-primary:    #22ddcd    /* vibrant teal */
--color-secondary:  #f5c1c6    /* soft pink */
--color-accent:     #20cbbd    /* teal accent */
--color-custom-1:   #d1f2f5    /* light cyan */
--color-custom-2:   #b1a2e2    /* lavender */
--color-custom-3:   #de86ea    /* magenta/pink */
--color-custom-4:   #8fb3ff    /* light blue */
```

Semua warna cerah, jenuh, dan dipakai blok besar — tanpa gradasi halus.

### Typography

| Level | Font | Weight | Size |
|-------|------|--------|------|
| h1 | Cascadia Mono | ExtraBold (800) | 5xl — 5rem |
| h2 | Cascadia Mono | ExtraBold (800) | 4xl — 6xl |
| h3 | Space Grotesk | Bold (700) | xl — 2xl |
| h4 | Space Grotesk | SemiBold (600) | base — xl |
| Body | Space Grotesk | Medium (500) | base |
| Display | Mechsuit | — | custom |
| Dekoratif | Angeles | — | drop-cap float |

Fonts:
- **Cascadia Mono** — monospace untuk heading, memberi kesan teknis/brutal
- **Space Grotesk** — sans-serif untuk body, bersih dan terbaca
- **Mechsuit** — font kustom tebal untuk logo/display
- **Angeles** — font dekoratif cursive untuk drop cap

### Spacing

Container: `max-w-screen-2xl` dengan padding `px-2 sm:px-16 md:px-20 lg:px-24 xl:px-28`.

### Borders

- **Border width**: `border-2`, `border-4` — tebal dan mencolok
- **Border color**: `border-slate-900` (hitam pekat) atau warna brand
- Setiap kartu, button, section separator pakai border tebal

### Shadows (Elevasi Neobrutalism)

Tidak ada `box-shadow` CSS biasa. Efek "shadow" dicapai dengan **offset**:

```
translate(-6px, -6px)   /* default offset */
translate(-8px, -8px)   /* hover */
translate(0, 0)         /* active/click */
```

Ini adalah signature neobrutalism — elemen seolah "menempel" dengan bayangan semu lewat offset.

### Animation

| Animasi | Duration | Easing | Penggunaan |
|---------|----------|--------|------------|
| `scale-up-center` | 1s | `cubic-bezier(0.4, 0, 0.2, 1)` | Entrance semua section via `Saos` |
| `marquee` | 15s (konfigurabel) | linear | Scrolling text banner |
| `drops-reveal` | 1067ms | `cubic-bezier(1, 0, 0.5, 1)` | PhotoCard halftone reveal |
| `200ms` ease | — | — | Hover/active transisi |
| `300ms` ease | — | — | Navbar transisi |
| `800ms` ease | — | — | Dark mode toggle |

---

## Components

### Button

Komponen serba guna untuk link dan tombol.

**Signature neobrutalism**: outer container warna gelap (`bg-slate-900`) + inner container berwarna dengan offset.

```
Outer:  bg-slate-900 inline-block
Inner:  bg-{variant} border-2 border-slate-900
        -translate-x-1.5 -translate-y-1.5   ← offset
        hover: -translate-x-2 -translate-y-2
        active: translate-x-0 translate-y-0 ← "ditekan"
```

**Variant**: primary, secondary, white, disabled, dan 15+ social brand colors.

**Size**: default & small (`text-sm`).

**States**: default, hover (offset membesar), active (offset hilang — efek ditekan), disabled (warna netral).

### ProjectCard

Kartu proyek dengan gaya neobrutalism lengkap:

- Outer shadow: `bg-slate-900`
- Inner: border-4, offset `-translate-x-1.5 -translate-y-1.5`
- Hover: offset membesar, overlay gelap "View detail"
- Active: offset hilang
- 6 varian warna: default (cyan), blue, yellow, red, purple, green
- Tags dengan warna sesuai teknologi
- Stats (stars, forks) dari GitHub API

### PhotoCard (About section)

- Stack kartu foto tumpuk dengan z-index berbeda
- Efek **halftone printing** — foto terlihat seperti cetakan dot screen CMYK
- Animasi `drops-reveal` — foto muncul dari titik-titik kecil seperti tinta
- Random rotate offset pada halftone untuk kesan organik
- Hover: kartu naik ke z-index 39, lainnya redup

### MarqueeText

- Scrolling text horizontal tanpa henti
- Arah: left atau right
- Duration dan repeat konfigurabel
- Dipakai sebagai banner dekoratif di About dan Portfolio

### ThemeButton

- Toggle dark/light mode
- Disimpan di `localStorage.theme`
- Inline script di `<svelte:head>` untuk flash prevention
- Ikon: moon (SVG custom) / sun (lingkaran)

### Wrappper (Container)

Wrapper konsisten untuk semua section:
```
mx-auto w-full max-w-screen-2xl
px-2 sm:px-16 md:px-20 lg:px-24 xl:px-28
flex overflow-x-clip
```

### Hamburger

- Navigasi mobile dengan icon SVG (burger / close)
- Menu dropdown dengan border-4, absolute positioning
- Click-outside to close
- Dark mode toggle di dalam menu

### Form Input

- `border-4 border-slate-900 dark:border-white`
- `focus:ring-1 focus:ring-offset-1` dengan warna kontras
- `focus:invalid:border-red-500` — validasi visual
- Background: `bg-sky-50 dark:bg-slate-600`

---

## Layout & Page Structure

### Page Sections (berurutan)

1. **Navbar** — fixed top, auto-hide on scroll, transparan → solid
2. **Hero** — full screen, halftone background, typewriter effect, emblem logo, CTA buttons
3. **About** — marquee banner, stacked PhotoCards, deskripsi dengan drop cap
4. **Portfolio** — staggered card reveal, ProjectCards dalam grid 2 kolom
5. **Achievements** — kompetisi & kursus dalam card berwarna random
6. **Tools** — masonry columns, icon grid per kategori
7. **Social** — grid tombol social media
8. **Contact** — form message + contact buttons
9. **Footer** — emblem, navlinks, social icons, copyright

### Section Separator

Setiap section dipisah dengan `border-t-4` atau `border-y-4` dengan warna kontras (`border-slate-900`).

Marquee banner horizontal membentang di atas section About dan Portfolio.

### Dark Mode

- Class-based: `dark` class di `<html>`
- Persist: `localStorage.theme`
- Setiap komponen punya varian dark masing-masing
- Background berubah ke slate-800/700, warna tetap cerah tapi lebih berani
- Halftone dots: `--dot-color` berubah jadi slate-500

---

## Signatures Neobrutalism

1. **Offset shadow semu** — `-translate-x-1.5 -translate-y-1.5` pada button dan card
2. **Border tebal** — `border-2`, `border-4` di mana-mana
3. **Warna blok berani** — background solid cerah (cyan, pink, magenta, kuning)
4. **High contrast** — `bg-slate-900` (hitam) sebagai warna bayangan/shadow
5. **Monospace heading** — Cascadia Mono memberi kesan teknis
6. **Halftone dots** — elemen dekoratif brutalis, mengingatkan pada koran/print
7. **Banner marquee** — strip horizontal dengan teks bergerak
8. **Tanpa gradasi halus** — flat colors, transisi hanya untuk interaksi

---

## Catatan Teknis

