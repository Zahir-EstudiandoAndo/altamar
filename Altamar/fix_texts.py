import re

with open('/Users/alan/Downloads/Altamar/styles.css', 'r') as f:
    css = f.read()

# Add text-dim if not exists
if '.text-dim' not in css:
    css = css.replace('.hero-h3{', '.text-dim{color:rgba(255,255,255,0.45)}\n.hero-h2{font-size:var(--lg);line-height:1.05;letter-spacing:-0.15rem;color:var(--fg)}\n.hero-h3{')
    with open('/Users/alan/Downloads/Altamar/styles.css', 'w') as f:
        f.write(css)

with open('/Users/alan/Downloads/Altamar/index.html', 'r') as f:
    html = f.read()

# Replace heroH3
old_h3 = '<h3 class=\"hero-h3\" id=\"heroH3\">El estudio detrás de las principales empresas del mundo.</h3>'
new_h2 = '<h2 class=\"hero-h2\" id=\"heroH3\"><span class=\"text-dim\">El estudio detrás de las</span> principales empresas <span class=\"text-dim\">del mundo.</span></h2>'
html = html.replace(old_h3, new_h2)

# Replace fpHeading
old_fp = '<h2 id=\"fpHeading\">Filter is full stack. We do everything, one studio.</h2>'
new_fp = '<h2 id=\"fpHeading\"><span class=\"text-dim\">Altamar es full stack.</span> Hacemos todo, <span class=\"text-dim\">en un solo estudio.</span></h2>'
html = html.replace(old_fp, new_fp)

with open('/Users/alan/Downloads/Altamar/index.html', 'w') as f:
    f.write(html)
print('Updated HTML and CSS for text styling')
