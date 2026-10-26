"""Hero panel as a looping GIF. GitHub shows SVG images without CSS motion."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source" / "portrait.png"
OUT = ROOT / "assets"

WIDTH = 880
HEIGHT = 404
COLS = 86
CX, CY, RADIUS = 724, 208, 116
FRAMES = 16
FRAME_MS = 90
SCALE = 2

THEMES = {
    "dark": {
        "bg": "#05060A",
        "fg": "#F4F7FF",
        "accent": "#F6D43A",
        "muted": "#8B97B3",
        "line": "#1A4DFF",
        "wallHi": "#5C86FF",
        "ink": "#070B16",
        "ready": "#3DDC6A",
    },
    "light": {
        "bg": "#EEF2FA",
        "fg": "#101827",
        "accent": "#C89600",
        "muted": "#5C6B82",
        "line": "#1A4DFF",
        "wallHi": "#6E97FF",
        "ink": "#12306E",
        "ready": "#1F9D4E",
    },
}

PROPOSAL = [
    "I design and build digital solutions",
    "that transform opportunities into",
    "scalable products, processes",
    "and experiences.",
]

FONT_SANS = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FONT_MONO = Path(r"C:\Windows\Fonts\consola.ttf")


def hex_to_rgb(value):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    t = min(1, max(0, t))
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def portrait_samples():
    img = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")
    w, h = img.size
    side = int(min(w, h) * 0.86)
    left = min(max(int(w * 0.50 - side / 2), 0), w - side)
    top = min(max(int(h * 0.39 - side / 2), 0), h - side)
    img = img.crop((left, top, left + side, top + side))
    gray = img.convert("L")
    gray = ImageOps.autocontrast(gray, cutoff=0.6)
    gray = ImageEnhance.Contrast(gray).enhance(1.28)
    gray = gray.filter(ImageFilter.UnsharpMask(radius=1.3, percent=150, threshold=1))
    small = gray.resize((COLS, COLS), Image.Resampling.LANCZOS)
    return list(small.getdata())


def portrait_dots(theme_name, grid, frame):
    theme = THEMES[theme_name]
    accent = hex_to_rgb(theme["accent"])
    fg = hex_to_rgb(theme["fg"])
    cell = (RADIUS * 2) / COLS
    dots = []
    dark = theme_name == "dark"
    scan_y = -1.15 + 2.3 * (frame / FRAMES)
    for index, lum in enumerate(grid):
        col = index % COLS
        row = index // COLS
        nx = ((col + 0.5) / COLS) * 2 - 1
        ny = ((row + 0.5) / COLS) * 2 - 1
        dist = math.hypot(nx, ny)
        if dist > 1:
            continue
        lum_n = lum / 255
        if lum_n > 0.935:
            continue
        feather = 1.0 if dist < 0.95 else (1 - dist) / 0.05
        band = math.exp(-((ny - scan_y) ** 2) / 0.018)
        if dark:
            tone = lum_n ** 1.05
            radius = (0.16 + 0.84 * tone) * cell * 0.47 * feather
            fill = mix(hex_to_rgb(theme["line"]), fg, 0.22 + 0.78 * lum_n)
        else:
            tone = (1 - lum_n) ** 0.72
            radius = (0.1 + 0.9 * tone) * cell * 0.46 * feather
            fill = mix(hex_to_rgb(theme["line"]), fg, min(1, 0.12 + tone * 0.9))
        radius *= 1 + 0.42 * band
        fill = mix(fill, accent, 0.72 * band)
        if radius < 0.34:
            continue
        dots.append((CX + nx * RADIUS, CY + ny * RADIUS, radius, fill))
    return dots


def render_frame(theme_name, grid, frame):
    theme = {key: hex_to_rgb(value) for key, value in THEMES[theme_name].items()}
    image = Image.new("RGB", (WIDTH * SCALE, HEIGHT * SCALE), theme["bg"])
    draw = ImageDraw.Draw(image)
    band = 6 * SCALE
    draw.rectangle((0, 0, WIDTH * SCALE - 1, HEIGHT * SCALE - 1), outline=theme["line"], width=band)
    draw.rectangle((2 * SCALE, 2 * SCALE, WIDTH * SCALE - 1 - 2 * SCALE, 4 * SCALE), fill=theme["wallHi"])
    draw.rectangle((2 * SCALE, 2 * SCALE, 4 * SCALE, HEIGHT * SCALE - 1 - 2 * SCALE), fill=theme["wallHi"])

    def pt(value):
        return value * SCALE

    mono = ImageFont.truetype(str(FONT_MONO), 15 * SCALE)
    name = ImageFont.truetype(str(FONT_BOLD), 40 * SCALE)
    role = ImageFont.truetype(str(FONT_MONO), 16 * SCALE)
    body = ImageFont.truetype(str(FONT_SANS), 22 * SCALE)
    ready = ImageFont.truetype(str(FONT_MONO), 15 * SCALE)

    draw.text((pt(32), pt(38)), "Portfolio", font=mono, fill=theme["muted"], anchor="ls")
    draw.ellipse((pt(164), pt(29), pt(172), pt(37)), fill=theme["accent"])
    draw.text((pt(848), pt(38)), "Argentina  ·  Public", font=mono, fill=theme["accent"], anchor="rs")
    draw.line((pt(32), pt(56), pt(848), pt(56)), fill=theme["line"], width=SCALE)
    draw.text((pt(32), pt(112)), "Lautaro Lopez Lecube", font=name, fill=theme["fg"], anchor="ls")
    draw.text((pt(32), pt(146)), "SOFTWARE DEVELOPER", font=role, fill=theme["accent"], anchor="ls")
    for index, line in enumerate(PROPOSAL):
        draw.text((pt(32), pt(214 + index * 32)), line, font=body, fill=theme["fg"], anchor="ls")

    for x, y, radius, fill in portrait_dots(theme_name, grid, frame):
        draw.ellipse(
            (pt(x - radius), pt(y - radius), pt(x + radius), pt(y + radius)),
            fill=fill,
        )

    draw.ellipse(
        (pt(CX - RADIUS), pt(CY - RADIUS), pt(CX + RADIUS), pt(CY + RADIUS)),
        outline=theme["line"],
        width=4 * SCALE,
    )
    sweep = frame / FRAMES * 360
    draw.arc(
        (pt(CX - RADIUS), pt(CY - RADIUS), pt(CX + RADIUS), pt(CY + RADIUS)),
        start=sweep,
        end=sweep + 46,
        fill=theme["accent"],
        width=2 * SCALE,
    )
    for angle in (0, 90, 180, 270):
        rad = math.radians(angle - 90)
        x1 = CX + math.cos(rad) * (RADIUS + 5)
        y1 = CY + math.sin(rad) * (RADIUS + 5)
        x2 = CX + math.cos(rad) * (RADIUS + 13)
        y2 = CY + math.sin(rad) * (RADIUS + 13)
        draw.line((pt(x1), pt(y1), pt(x2), pt(y2)), fill=theme["accent"], width=SCALE)

    draw.line((pt(32), pt(356), pt(848), pt(356)), fill=theme["line"], width=SCALE)
    draw.text((pt(32), pt(382)), "ready", font=ready, fill=theme["ready"], anchor="ls")
    if frame % 6 == 0:
        draw.rectangle((pt(84), pt(370), pt(92), pt(384)), fill=theme["accent"])
    return image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)


def quantize(frames):
    width, height = frames[0].size
    sheet = Image.new("RGB", (width, height * len(frames)))
    for index, frame in enumerate(frames):
        sheet.paste(frame, (0, index * height))
    palette = sheet.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    return [palette.crop((0, index * height, width, (index + 1) * height)) for index in range(len(frames))]


def main():
    grid = portrait_samples()
    for name in THEMES:
        frames = quantize([render_frame(name, grid, frame) for frame in range(FRAMES)])
        path = OUT / f"hero-{name}.gif"
        frames[0].save(
            path,
            save_all=True,
            append_images=frames[1:],
            duration=FRAME_MS,
            loop=0,
            optimize=True,
            disposal=2,
        )
        print(f"hero-{name}.gif  {path.stat().st_size} bytes  {FRAMES} frames")


if __name__ == "__main__":
    main()
