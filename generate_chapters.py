#!/usr/bin/env python3
"""
Generate chapter HTML files for all 3 subjects using JSON data.
Reads from data/subject1.json, writes to subject1/chap*.html
"""
import json
import os

def generate_derivation_section(derivations):
    if not derivations:
        return ""
    html = '      <!-- Derivation Sums -->\n'
    html += '      <div class="derivation-section">\n'
    html += '        <h3>DERIVATION SUMS (Step-by-Step)</h3>\n'
    for i, d in enumerate(derivations, 1):
        html += f'        <div class="derivation-card">\n'
        html += f'          <h4>{i}. {d["title"]}</h4>\n'
        html += f'          <p><strong>Steps:</strong></p>\n'
        html += '          <ol class="steps">\n'
        for step in d["steps"]:
            html += f'            <li>{step}</li>\n'
        html += '          </ol>\n'
        html += f'          <p><strong>Formula:</strong> <code>{d["formula"]}</code></p>\n'
        html += '        </div>\n'
    html += '      </div>\n'
    return html

def generate_numerical_section(problems):
    if not problems:
        return ""
    html = '      <!-- Numerical Problems -->\n'
    html += '      <div class="numerical-section">\n'
    html += '        <h3>NUMERICAL PROBLEMS (Solved)</h3>\n'
    for i, p in enumerate(problems, 1):
        html += f'        <div class="numerical-card">\n'
        html += f'          <h4>Problem {i}: {p["question"]}</h4>\n'
        html += f'          <p><strong>Given:</strong> {p["given"]}</p>\n'
        html += f'          <p><strong>Solution:</strong> {p["solution"]}</p>\n'
        html += f'          <p><strong>Answer:</strong> {p["answer"]}</p>\n'
        html += '        </div>\n'
    html += '      </div>\n'
    return html

def generate_resources_section(sources):
    if not sources:
        return ""
    html = '      <!-- PDF Resources -->\n'
    html += '      <div class="resources-section">\n'
    html += '        <h3>PDF RESOURCES</h3>\n'
    html += '        <ul>\n'
    for src in sources:
        html += f'          <li>{src}</li>\n'
    html += '        </ul>\n'
    html += '      </div>\n'
    return html

def generate_chapter_html(subject_num, chapter_data, subject_name, subject_code):
    chap_id = chapter_data["id"]
    title = chapter_data["title"]
    content = chapter_data["content"]
    derivations = chapter_data.get("derivations", [])
    numericals = chapter_data.get("numericalProblems", [])
    pdf_sources = chapter_data.get("pdfSources", [])
    tanglish = chapter_data.get("tanglishNotes", "")
    
    deriv_section = generate_derivation_section(derivations)
    num_section = generate_numerical_section(numericals)
    res_section = generate_resources_section(pdf_sources)
    
    # Revision points
    revision_html = '      <div class="revision-points">\n'
    revision_html += '        <h3>LET\'S REMEMBER:</h3>\n'
    revision_html += '        <ul>\n'
    for kp in chapter_data.get("keyPoints", []):
        revision_html += f'          <li>{kp}</li>\n'
    revision_html += '        </ul>\n'
    revision_html += '      </div>\n'
    
    # Notes panel
    notes_html = '      <!-- Notes Panel (with Tanglish) -->\n'
    notes_html += '      <div class="notes-panel" id="notes">\n'
    notes_html += '        <h3>SIMPLE NOTES (Tanglish Supported):</h3>\n'
    notes_html += '        <ul>\n'
    for kp in chapter_data.get("keyPoints", []):
        notes_html += f'          <li>{kp}</li>\n'
    if tanglish:
        notes_html += f'          <li><strong>Tanglish:</strong> {tanglish}</li>\n'
    notes_html += '        </ul>\n'
    notes_html += '      </div>\n'
    
    # Navigation
    if chap_id > 1:
        prev_link = f"chap{chap_id-1}.html"
        prev_text = f"Chapter {chap_id-1}"
    else:
        prev_link = "../index.html"
        prev_text = "Back to Home"
        
    if chap_id < 5:
        next_link = f"chap{chap_id+1}.html"
        next_text = f"Chapter {chap_id+1} ->"
    else:
        next_link = "../index.html"
        next_text = "Back to Home ->"
    
    # Build content
    content_html = '      <div id="chapter-content">\n'
    content_html += f'        <h1>Chapter {chap_id}: {title}</h1>\n'
    content_html += f'        <div class="chapter-section">\n'
    content_html += f'          <p>{content}</p>\n'
    content_html += '        </div>\n'
    content_html += '      </div>\n'
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AMIE ECE Learner - Chapter {chap_id}: {title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Comic+Neue:wght@300;400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <main id="main-content">
    <!-- Progress Bar -->
    <section style="margin:20px 0;">
      <p style="font-size:18px; margin-bottom:8px;">Chapter {chap_id} of 5 — {subject_name}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width:{chap_id*20}%"></div>
      </div>
    </section>
    
    <!-- TTS Audio Controls -->
    <div class="audio-controls">
      <button class="btn btn-primary" id="tts-play-btn" aria-label="Play chapter text">Play</button>
      <button class="btn btn-secondary" id="tanglish-btn" aria-label="Toggle Tanglish mode">Tanglish: OFF</button>
      <button class="btn btn-secondary" id="notes-btn" aria-label="Toggle notes panel">Notes</button>
    </div>
    
    <!-- Chapter Content -->
{content_html}
{revision_html}
{notes_html}
{deriv_section}
{num_section}
{res_section}
    
    <!-- Quiz and Navigation -->
    <div class="nav-links">
      <a href="{prev_link}" class="btn btn-secondary"><- {prev_text}</a>
      <a href="{next_link}" class="btn btn-primary">{next_text}</a>
    </div>
    
    <div style="text-align:center; margin:32px 0;">
      <a href="../quiz/quiz-s{subject_num}.html" class="btn btn-primary">TAKE QUIZ</a>
    </div>
    
    <footer class="footer">
      <p>Subject {subject_num}: {subject_name} — Chapter {chap_id} of 5</p>
    </footer>
  </main>
   
  <script src="../assets/js/tts.js"></script>
  <script src="../assets/js/storage.js"></script>
  <script src="../assets/js/app.js"></script>
  <script>
    // Mark chapter as viewed
    markChapterViewed({subject_num}, {chap_id});

    // TTS: Play chapter text with Tanglish support
    const ttsBtn = document.getElementById('tts-play-btn');
    if (ttsBtn) {{
      ttsBtn.addEventListener('click', () => {{
        const content = document.getElementById('chapter-content');
        if (content) {{
          // Auto-detect Tamil content
          if (content.innerText.match(/[\\u0B80-\\u0BFF]/)) {{
            TTS.currentLang = 'ta-IN';
            TTS.tanglishMode = true;
          }}
          TTS.speak(content.innerText);
        }}
      }});
    }}

    // Toggle notes panel
    const notesBtn = document.getElementById('notes-btn');
    const notesPanel = document.getElementById('notes');
    if (notesBtn && notesPanel) {{
      notesBtn.addEventListener('click', () => {{
        notesPanel.classList.toggle('show');
      }});
    }}

    // Initialize Tanglish button
    const tanglishBtn = document.getElementById('tanglish-btn');
    if (tanglishBtn) {{
      const isTanglish = localStorage.getItem('tanglish-mode') === 'true';
      tanglishBtn.textContent = isTanglish ? 'Tanglish: ON' : 'Tanglish: OFF';
      tanglishBtn.addEventListener('click', () => {{
        TTS.toggleTanglish();
        const newState = TTS.tanglishMode;
        tanglishBtn.textContent = newState ? 'Tanglish: ON' : 'Tanglish: OFF';
      }});
    }}
  </script>
</body>
</html>'''
    
    return html

def main():
    # Process all 3 subjects
    subjects = [
        ("data/subject1.json", "Microwave Engineering", "S1", 1, "subject1"),
        ("data/subject2.json", "Electronic Circuits", "S2", 2, "subject2"),
        ("data/subject3.json", "Design of Electronic Devices & Circuits", "S3", 3, "subject3")
    ]
    
    for json_path, name, code, num, folder in subjects:
        if not os.path.exists(json_path):
            print(f"Warning: {json_path} not found, skipping...")
            continue
            
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for chapter in data["chapters"]:
            chap_id = chapter["id"]
            html = generate_chapter_html(num, chapter, name, code)
            
            output_path = f"{folder}/chap{chap_id}.html"
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"Generated: {output_path}")
    
    print("\nAll chapter HTML files generated successfully!")

if __name__ == "__main__":
    main()
