# Composes public/lanyard/card-back.png so the reverse side matches the front
# (same name and year). Re-run after renaming in site.config.js.
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 900, 1260
INK, PAPER, GOLD = (11, 11, 13), (244, 241, 234), (201, 161, 63)

font_cn_big = ImageFont.truetype(r'C:\Windows\Fonts\STSONG.TTF', 132)
font_cn = ImageFont.truetype(r'C:\Windows\Fonts\STSONG.TTF', 56)
font_lat = ImageFont.truetype(r'C:\Windows\Fonts\georgia.ttf', 26)
font_tiny = ImageFont.truetype(r'C:\Windows\Fonts\georgia.ttf', 20)


def tracked(draw, cx, y, text, font, fill, tracking=0):
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = cx - total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking


img = Image.new('RGB', (W, H), INK)
d = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    shade = int(18 - 11 * t)
    d.line([(0, y), (W, y)], fill=(shade, shade, shade + 2))
grain = Image.new('RGBA', (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(grain)
for i in range(-H, W, 9):
    gd.line([(i, 0), (i + H, H)], fill=(255, 255, 255, 5), width=1)
img = Image.alpha_composite(img.convert('RGBA'), grain)
d = ImageDraw.Draw(img)

d.rectangle((48, 48, W - 48, H - 48), outline=GOLD + (140,), width=2)
cx = W // 2

# monogram
r = 148
d.ellipse((cx - r, 300, cx + r, 300 + 2 * r), outline=GOLD + (210,), width=2)
d.ellipse((cx - r - 18, 300 - 18, cx + r + 18, 300 + 2 * r + 18), outline=GOLD + (60,), width=1)
tracked(d, cx, 362, '云', font_cn_big, PAPER + (255,), tracking=0)

tracked(d, cx, 660, '云戴舒', font_cn, PAPER + (255,), tracking=10)
d.line([(cx - 70, 762), (cx + 70, 762)], fill=GOLD + (150,), width=1)
tracked(d, cx, 790, 'YUN DAISHU', font_lat, PAPER + (230,), tracking=10)
tracked(d, cx, 842, '2026', font_lat, GOLD + (220,), tracking=8)

d.line([(cx - 130, 1100), (cx + 130, 1100)], fill=PAPER + (40,), width=1)
tracked(d, cx, 1124, 'SHENZHEN · SILENT ALTITUDE', font_tiny, PAPER + (110,), tracking=5)

img.convert('RGB').save(os.path.join(ROOT, 'public', 'lanyard', 'card-back.png'), optimize=True)
print('card-back.png written', img.size)
