import re

with open('/Users/alan/Downloads/Altamar/index.html', 'r') as f:
    content = f.read()

# Define the exact 5 cards HTML
cards_html = """
        <div class="cr-card">
          <div class="cr-card-img-area">
            <div class="placeholder-media" style="background:#093222">lute is</div>
            <span class="cr-tag">Client Review</span>
          </div>
          <div class="cr-card-body">
            <div class="cr-meta">
              <div class="cr-avatar"></div>
              <span class="cr-name">Counter — Founder</span>
              <div class="cr-co-logo"></div>
              <span class="cr-handle">@lute</span>
            </div>
            <p>Our brand went from forgettable to immediately recognizable. Filter gets the culture — they don't just make it look good, they make it feel right. The social work alone changed how people perceive us.</p>
          </div>
        </div>
        <div class="cr-card">
          <div class="cr-card-img-area">
            <div class="placeholder-media">Sperm Racing</div>
            <span class="cr-tag">Client Review</span>
          </div>
          <div class="cr-card-body">
            <div class="cr-meta">
              <div class="cr-avatar"></div>
              <span class="cr-name">Eric Zhu — Founder</span>
              <div class="cr-co-logo"></div>
              <span class="cr-handle">Aviato &amp; Sperm Racing</span>
            </div>
            <p>Genuinely the best design team I've worked with. We came in with a concept that was... let's say unconventional. They came back with something even wilder. That creative range is rare — and it's why I keep coming back.</p>
          </div>
        </div>
        <div class="cr-card cr-card-wide">
          <div class="cr-card-img-area">
            <div class="placeholder-media" style="background:#e8edf5">Acctualteam</div>
            <span class="cr-tag">Client Review</span>
          </div>
          <div class="cr-card-body">
            <div class="cr-meta">
              <div class="cr-avatar"></div>
              <span class="cr-name">Atikh — CEO</span>
              <div class="cr-co-logo"></div>
              <span class="cr-handle">Acctualteam</span>
            </div>
            <p>Filter redesigned our entire product experience from the ground up. The invoice flows feel native, the brand feels premium. It's the kind of design work that earns trust before a user reads a single word.</p>
          </div>
        </div>
        <div class="cr-card">
          <div class="cr-card-img-area">
            <div class="placeholder-media">Azura</div>
            <span class="cr-tag">Client Review</span>
          </div>
          <div class="cr-card-body">
            <div class="cr-meta">
              <div class="cr-avatar"></div>
              <span class="cr-name">Jackson Denka — CEO</span>
              <div class="cr-co-logo"></div>
              <span class="cr-handle">Azura</span>
            </div>
            <p>Filter doesn't do ordinary — and I mean that literally. Every single delivery pushed the envelope. The kind of work that makes your users stop mid-scroll.</p>
          </div>
        </div>
        <div class="cr-card">
          <div class="cr-card-img-area">
            <div class="placeholder-media">Project 5</div>
            <span class="cr-tag">Client Review</span>
          </div>
          <div class="cr-card-body">
            <div class="cr-meta">
              <div class="cr-avatar"></div>
              <span class="cr-name">Alex M. — Founder</span>
              <div class="cr-co-logo"></div>
              <span class="cr-handle">@hello</span>
            </div>
            <p>Working with Filter was a turning point for our product. They have an uncanny ability to translate abstract ideas into stunning visual systems that actually convert and drive real growth.</p>
          </div>
        </div>
"""

new_container_html = f"""  <div class="cr-container" id="crContainer">
    <div class="cr-viewport">
      <div class="cr-track" id="crTrack">
        <div class="cr-track-inner" style="display:flex; gap:1.5rem; padding-right:1.5rem;">
{cards_html}
        </div>
        <div class="cr-track-inner" style="display:flex; gap:1.5rem; padding-right:1.5rem;">
{cards_html}
        </div>
      </div>
    </div>
  </div>"""

# Replace everything from <div class="cr-container" to right before </section>
start_idx = content.find('<div class="cr-container" id="crContainer">')
end_idx = content.find('</section>', start_idx)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_container_html + "\n" + content[end_idx:]
    with open('/Users/alan/Downloads/Altamar/index.html', 'w') as f:
        f.write(new_content)
    print('Fixed carousel successfully!')
else:
    print('Could not find cr-container or </section>')
