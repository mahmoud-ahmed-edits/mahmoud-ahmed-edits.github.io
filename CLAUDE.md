# Notes for Claude

## Saved editing styles
- **"Before After" / "بيفور افتر"**: `before-after-style/`. When the user says "طبق ستايل بيفور افتر" (apply the Before After style) with two videos on an After Effects timeline, give them `before-after-style/BeforeAfter_Style.jsx` to run from File > Scripts > Run Script File. It builds the full 1080x1920 comp and adds it to the Render Queue (the user renders it themselves). The spec is in `before-after-style/STYLE.md`. Any change to the style goes into the script.
- **Editing tricks inside the reference "After" video** (captions, B-roll builds, transitions, look, SFX): `before-after-style/AFTER_EDIT_TRICKS.md`. Use it when the user asks for this editing style or these tricks.
