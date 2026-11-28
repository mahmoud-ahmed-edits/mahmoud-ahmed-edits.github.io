---
name: before-after
description: Apply the user's "Before After" (بيفور افتر) showcase template in After Effects. Use when the user says "طبق ستايل بيفور افتر", "apply before after style", or has two videos named After and Before on an After Effects timeline and wants the side-by-side showcase video. This is ONLY the showcase layout. It never touches the editing inside the videos.
---

# Before After style

A static showcase layout. A small **Before** frame on the left and a big **After** frame on the right, both playing at the same time, on a warm orange and white background, with a CTA underneath. It matches the reference exactly. **Do not add any editing tricks inside the videos.** Those belong to the `short-form-editing` skill and are a separate thing.

## What to do when the user asks for it
1. Tell the user to name the two videos **After** and **Before** (layer name or file name, e.g. `After.mp4` / `Before.mp4`). The script only picks them by name and stops with a message if it can't find them.
2. Give them `before-after-style/BeforeAfter_Style.jsx` to run from **File > Scripts > Run Script File** while the comp with the two videos is open.
3. The script builds a ready 1080x1920 comp `<name> - BeforeAfter`, opens it, and adds it to the Render Queue. **The user renders it themselves.**

## Fixed decisions from the user
- **Font:** Alexandria (Google Fonts) for all text: the CTA and the Before/After labels (`Alexandria-Regular`, `Alexandria-Medium`, `Alexandria-Bold`). It must be installed.
- **Floating Shadow (Motion Kit)** on the frames (both videos), the labels and the CTA text. The script applies `FloatingShadow.ffx` if it is next to the script (or the path in `CFG.floatingShadowPreset`). The user saves it once from Motion Kit: apply the floating shadow to a layer, then **Animation > Save Animation Preset** as `FloatingShadow.ffx`. Without the file, the script uses a built-in two-layer floating shadow.
- Audio: After only.

## Files
- `before-after-style/BeforeAfter_Style.jsx`: the script. All edits to the style go here (`CFG` and `L` at the top).
- `before-after-style/STYLE.md`: measurements, colors and background.
- `before-after-style/preview/`: the reference frame and a side-by-side of the reference and the rebuild.
