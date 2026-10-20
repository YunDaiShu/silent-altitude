# Composes public/lanyard/card-front.png: the black-gold ID card front with a
# circular avatar. Re-run after swapping assets/avatar.jpg.
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 900, 1260
INK, PAPER, GOLD = (11, 11, 13), (244, 241, 234), (201, 161, 63)
SS = 4  # supersample factor for smooth circles

font_cn = ImageFont.truetype(r'C:\Windows\Fonts\STSONG.TTF', 104)
font_cn_small = ImageFont.truetype(r'C:\Windows\Fonts\STSONG.TTF', 34)
font_lat = ImageFont.truetype(r'C:\Windows\Fonts\georgia.ttf', 40)
font_lat_small = ImageFont.truetype(r'C:\Windows\Fonts\georgia.ttf', 25)
font_lat_tiny = ImageFont.truetype(r'C:\Windows\Fonts\georgia.ttf', 20)


def tracked(draw, cx, y, text, font, fill, tracking=0):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking
    return total


def background():
    img = Image.new('RGB', (W, H), INK)
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        shade = int(20 - 12 * t)
        d.line([(0, y), (W, y)], fill=(shade, shade, shade + 2))
    grain = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grain)
    for i in range(-H, W, 9):
        gd.line([(i, 0), (i + H, H)], fill=(255, 255, 255, 5), width=1)
    return Image.alpha_composite(img.convert('RGBA'), grain)


def avatar_panel(size):
    src = Image.open(os.path.join(ROOT, 'assets', 'avatar.jpg')).convert('RGB')
    side = min(src.size)
    src = src.crop(((src.width - side) // 2, (src.height - side) // 2,
                    (src.width + side) // 2, (src.height + side) // 2)).resize((size * SS, size * SS), Image.LANCZOS)
    mask = Image.new('L', (size * SS, size * SS), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * SS, size * SS), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    return src.resize((size, size), Image.LANCZOS), mask


img = background()
d = ImageDraw.Draw(img)

# hairline frames
d.rectangle((48, 48, W - 48, H - 48), outline=GOLD + (140,), width=2)
d.rectangle((60, 60, W - 60, H - 60), outline=GOLD + (60,), width=1)

# card header
d.text((104, 108), 'NO. 0001', font=font_lat_tiny, fill=PAPER + (150,))
w = d.textlength('2026', font=font_lat_tiny)
d.text((W - 104 - w, 108), '2026', font=font_lat_tiny, fill=PAPER + (150,))

# avatar
size = 340
cx, cy = W // 2, 470
av, mask = avatar_panel(size)
img.paste(av, (cx - size // 2, cy - size // 2), mask)
d = ImageDraw.Draw(img)
d.ellipse((cx - size // 2 - 7, cy - size // 2 - 7, cx + size // 2 + 7, cy + size // 2 + 7), outline=GOLD + (220,), width=3)
d.ellipse((cx - size // 2 - 24, cy - size // 2 - 24, cx + size // 2 + 24, cy + size // 2 + 24), outline=GOLD + (70,), width=1)

# name block
tracked(d, cx, 726, '云戴舒', font_cn, PAPER + (255,), tracking=14)
d.line([(cx - 80, 872), (cx + 80, 872)], fill=GOLD + (150,), width=1)
tracked(d, cx, 898, 'YUN DAISHU', font_lat_small, PAPER + (235,), tracking=9)
tracked(d, cx, 952, 'ART DIRECTOR', font_lat_tiny, GOLD + (235,), tracking=7)

# footer
d.line([(cx - 130, 1120), (cx + 130, 1120)], fill=PAPER + (40,), width=1)
tracked(d, cx, 1144, 'SILENT ALTITUDE', font_lat_tiny, PAPER + (110,), tracking=6)

img.convert('RGB').save(os.path.join(ROOT, 'public', 'lanyard', 'card-front.png'), optimize=True)
print('card-front.png written', img.size)
