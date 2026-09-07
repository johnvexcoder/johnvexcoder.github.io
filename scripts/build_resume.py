"""Build the one-page resume from project facts, user-confirmed credits, and project READMEs.
Run with Python + reportlab from the repository root.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/johnangelodejoya.pdf'
# Embed fonts so headings render consistently across PDF readers.
FONT_DIR = Path('/usr/share/fonts/liberation-sans-fonts')
pdfmetrics.registerFont(TTFont('Resume', str(FONT_DIR / 'LiberationSans-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Resume-Bold', str(FONT_DIR / 'LiberationSans-Bold.ttf')))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='Resume-Bold')
W, H = 595.28, 841.89
c = canvas.Canvas(str(OUT), pagesize=(W, H))
c.setTitle('John De Joya | Developer & Infrastructure')
c.setAuthor('John De Joya')
ink, muted, accent = '#132233', '#4D5E70', '#08768F'
style = ParagraphStyle('body', fontName='Resume', fontSize=10, leading=14, textColor=HexColor(ink), alignment=TA_LEFT)
y = H - 44

def text(value, size=10, color=ink, bold=False, gap=0):
    global y
    st = ParagraphStyle('p', parent=style, fontSize=size, leading=size*1.4, textColor=HexColor(color), fontName='Resume-Bold' if bold else 'Resume')
    p = Paragraph(value, st)
    _, h = p.wrap(W-88, 800)
    p.drawOn(c,44,y-h)
    y -= h + gap

def section(title):
    global y
    y -= 15
    text(title.upper(), 9, accent, True, 5)
    c.setStrokeColor(HexColor('#D5E0E8'));c.setLineWidth(.5);c.line(44,y,W-44,y)
    y -= 9

text('JOHN DE JOYA', 27, ink, True, 2)
text('J0hnvexcoder  /  Web Development &amp; Infrastructure',11,accent,True,8)
text('Philippines  |  <link href="mailto:johnangelodejoya@gmail.com">johnangelodejoya@gmail.com</link>  |  +63 933 104 5271',9,muted,gap=2)
text('<link href="https://johnvexcoder.github.io">johnvexcoder.github.io</link>  |  <link href="https://github.com/johnvexcoder">github.com/johnvexcoder</link>',9,muted)
section('Profile')
text('Web developer and IT enthusiast building practical software and self-hosted systems. Hands-on work spans Linux, Docker, Proxmox, networking, and technical support. Technical skills developed through independent study, experimentation, and open-source projects.')
section('Professional experience')
text('IT / Web Developer  |  Telework',11,ink,True)
text('November 2025 - January 2026',9,muted,gap=9)
text('IT (Full-time)  |  Hospitality / IT Environment',11,ink,True)
text('January 2025 - August 2025',9,muted,gap=3)
text('Computer configuration, networking, room access point setup, troubleshooting, and basic IT infrastructure support.',gap=9)
text('IT  |  Hundredfold Digital',11,ink,True)
section('Selected independent projects')
projects = [
('HomeLab-OS','HomeLab-OS','Real-time infrastructure dashboard with WebSocket telemetry, topology mapping, and Proxmox integration; includes a simulated demo fleet.'),
('HomeLab-Agent','HomeLab-Agent','Modular Linux telemetry agent that reports host, hardware, Docker, disk, and network data to HomeLab OS.'),
('CompressMe','CompressMe','Cross-platform Python image compression tool with a PySide6 GUI and CLI, batch processing, and duplicate detection.'),
('MovieFlix','MovieFlix','Self-hosted media platform with local media scanning, HTTP range streaming, and FFmpeg transcoding.')]
for title,repo,desc in projects:
    text(f'<link href="https://github.com/johnvexcoder/{repo}"><b>{title}</b></link> - {desc}',gap=7)
section('Technical toolkit')
text('<b>Development:</b> HTML, CSS, JavaScript, Python, Java, Next.js, SQLite, Git / GitHub<br/><b>Infrastructure:</b> Linux, Docker / Compose, Proxmox VE, Nginx, Tailscale, WordPress')
section('Education & current focus')
text('<b>Bachelor of Science in Hospitality Management</b>  |  2024 - 2025',gap=5)
text('Building a first server cluster; studying network architecture, service communication, information security, and penetration testing.',10,muted)
section('Achievements')
text('Youth Leadership Award, 2024 - 2025<br/>NC II Bartending, 2023  |  NC II Bread and Pastry, 2024')
assert y > 45, f'Resume exceeds page: {y}'
c.setStrokeColor(HexColor('#D5E0E8'));c.line(44,35,W-44,35)
c.setFillColor(HexColor(muted));c.setFont('Resume',8);c.drawString(44,23,'JOHN DE JOYA');c.drawRightString(W-44,23,'DEVELOPMENT / LINUX / SYSTEMS')
c.showPage();c.save()
print(f'Built {OUT}; content bottom: {y:.1f}pt')
