/*
 * ============================================================
 *  BEFORE / AFTER STYLE  -  After Effects ExtendScript
 * ============================================================
 *  How to use:
 *   1. Open the comp that has your 2 videos (Before + After).
 *   2. File > Scripts > Run Script File...  > choose this file.
 *   3. The script builds a new 1080x1920 comp "<name> - BeforeAfter",
 *      opens it and adds it to the Render Queue. You just press Render.
 *
 *  Which video is Before / After?
 *   - Layer (or file) name contains "before" / "قبل"  -> Before
 *   - Layer (or file) name contains "after"  / "بعد"  -> After
 *   - Otherwise: TOP video layer = After, the one under it = Before.
 *
 *  Audio: After audio is kept, Before is muted.
 *  Any audio-only layers (music / SFX) in the comp are copied too.
 * ============================================================
 */
(function BeforeAfterStyle() {

    // ---------------- CONFIG (edit freely) ----------------
    var CFG = {
        W: 1080, H: 1920,
        ctaLine1: "Ready to elevate your story?",
        ctaLine2: "Comment \"Edit\"",
        ctaFont1: "SegoeUI",          // fallback: AE substitutes if missing
        ctaFont2: "SegoeUI-Bold",
        pillFont: "TimesNewRomanPSMT",
        beforeLabel: "Before",
        afterLabel: "After",
        addToRenderQueue: true
    };

    // Layout measured from the reference (720x1280) and scaled x1.5
    var L = {
        after:  { cx: 709, cy: 906,   w: 540, h: 960, r: 20 },
        before: { cx: 240, cy: 919.5, w: 330, h: 587, r: 16 },
        afterPill:  { cx: 724.5, cy: 384, w: 237, h: 60, dotX: 645,  dotD: 34, textX: 682,   base: 402, textW: 123, size: 54 },
        beforePill: { cx: 244.5, cy: 583, w: 135, h: 35, dotX: 196.5, dotD: 20, textX: 217.5, base: 593, textW: 72,  size: 30 },
        cta1: { x: 237, base: 1527, w: 532, size: 44 },
        cta2: { x: 237, base: 1612, w: 525, size: 76 }
    };

    // ---------------- helpers ----------------
    function hex(h) {
        h = h.replace("#", "");
        return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
    }
    function setP(prop, val) { // set even if keyframed
        try {
            while (prop.numKeys > 0) prop.removeKey(1);
            if (prop.expressionEnabled) prop.expression = "";
            prop.setValue(val);
        } catch (e) {}
    }
    function fx(layer, match) { return layer.property("ADBE Effect Parade").addProperty(match); }
    function setOpacity255(prop, pct) { try { prop.setValue(pct / 100 * 255); } catch (e) { try { prop.setValue(pct); } catch (e2) {} } }

    function dropShadow(layer, color, opacityPct, dirDeg, dist, soft) {
        var d = fx(layer, "ADBE Drop Shadow");
        d.property("ADBE Drop Shadow-0001").setValue(color);
        setOpacity255(d.property("ADBE Drop Shadow-0002"), opacityPct);
        d.property("ADBE Drop Shadow-0003").setValue(dirDeg);
        d.property("ADBE Drop Shadow-0004").setValue(dist);
        d.property("ADBE Drop Shadow-0005").setValue(soft);
        return d;
    }

    function shapeLayer(comp, name) {
        var s = comp.layers.addShape();
        s.name = name;
        s.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]);
        return s;
    }
    function addRect(shape, name, cx, cy, w, h, r, color, opacity) {
        var g = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        g.name = name;
        var c = g.property("ADBE Vectors Group");
        var rc = c.addProperty("ADBE Vector Shape - Rect");
        rc.property("ADBE Vector Rect Size").setValue([w, h]);
        rc.property("ADBE Vector Rect Position").setValue([cx, cy]);
        rc.property("ADBE Vector Rect Roundness").setValue(r);
        var f = c.addProperty("ADBE Vector Graphic - Fill");
        f.property("ADBE Vector Fill Color").setValue(color);
        if (opacity !== undefined) f.property("ADBE Vector Fill Opacity").setValue(opacity);
        return g;
    }
    function addEllipse(shape, name, cx, cy, d, color) {
        var g = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
        g.name = name;
        var c = g.property("ADBE Vectors Group");
        var e = c.addProperty("ADBE Vector Shape - Ellipse");
        e.property("ADBE Vector Ellipse Size").setValue([d, d]);
        e.property("ADBE Vector Ellipse Position").setValue([cx, cy]);
        c.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(color);
        return g;
    }

    // Smooth closed mask through points; pts[i][2]===1 marks a sharp corner
    function smoothShape(pts) {
        var n = pts.length, v = [], it = [], ot = [], k = 0.18;
        for (var i = 0; i < n; i++) {
            var p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
            v.push([p[0], p[1]]);
            if (p[2] === 1) { it.push([0, 0]); ot.push([0, 0]); }
            else {
                var tx = (b[0] - a[0]) * k, ty = (b[1] - a[1]) * k;
                it.push([-tx, -ty]); ot.push([tx, ty]);
            }
        }
        var s = new Shape();
        s.vertices = v; s.inTangents = it; s.outTangents = ot; s.closed = true;
        return s;
    }
    function addMask(layer, shp, feather) {
        var m = layer.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
        m.property("ADBE Mask Shape").setValue(shp);
        if (feather) m.property("ADBE Mask Feather").setValue([feather, feather]);
        return m;
    }
    function rampSolid(comp, name, p1, c1, p2, c2) {
        var s = comp.layers.addSolid([1, 1, 1], name, comp.width, comp.height, 1, comp.duration);
        var r = fx(s, "ADBE Ramp");
        r.property("ADBE Ramp-0001").setValue(p1);
        r.property("ADBE Ramp-0002").setValue(c1);
        r.property("ADBE Ramp-0003").setValue(p2);
        r.property("ADBE Ramp-0004").setValue(c2);
        return s;
    }

    function addText(comp, str, font, size, color, x, base, targetW, tracking) {
        var t = comp.layers.addText(str);
        var sp = t.property("ADBE Text Properties").property("ADBE Text Document");
        var td = sp.value;
        td.resetCharStyle();
        try { td.font = font; } catch (e) {}
        td.fontSize = size;
        td.applyFill = true;
        td.fillColor = color;
        td.applyStroke = false;
        td.tracking = tracking || 0;
        td.justification = ParagraphJustification.LEFT_JUSTIFY;
        sp.setValue(td);
        if (targetW) { // fit the measured width of the reference
            var r = t.sourceRectAtTime(0, false);
            if (r.width > 0) {
                td = sp.value;
                td.fontSize = size * targetW / r.width;
                sp.setValue(td);
            }
        }
        t.property("ADBE Transform Group").property("ADBE Position").setValue([x, base]);
        return t;
    }

    // ---------------- find source comp + layers ----------------
    var src = app.project.activeItem;
    if (!(src instanceof CompItem)) { alert("Open (select) the comp that has your Before + After videos first."); return; }

    var vids = [];
    for (var i = 1; i <= src.numLayers; i++) {
        var ly = src.layer(i);
        if (!(ly instanceof AVLayer) || !ly.hasVideo || !ly.source || ly.adjustmentLayer || ly.nullLayer) continue;
        if (ly.source.mainSource && ly.source.mainSource instanceof SolidSource) continue;
        if (ly.source.mainSource && ly.source.mainSource.isStill) continue;
        vids.push(ly);
    }
    if (vids.length < 2) { alert("Need 2 video layers in the comp (Before + After). Found: " + vids.length); return; }

    function nm(l) { return (l.name + " " + l.source.name).toLowerCase(); }
    var beforeL = null, afterL = null;
    for (i = 0; i < vids.length; i++) {
        var n = nm(vids[i]);
        if (!beforeL && (n.indexOf("before") >= 0 || n.indexOf("قبل") >= 0)) beforeL = vids[i];
        else if (!afterL && (n.indexOf("after") >= 0 || n.indexOf("بعد") >= 0)) afterL = vids[i];
    }
    if (!afterL || !beforeL || afterL === beforeL) {
        var sel = src.selectedLayers, pool = (sel.length === 2) ? [sel[0], sel[1]] : [vids[0], vids[1]];
        pool.sort(function (a, b) { return a.index - b.index; });
        if (!afterL && !beforeL) { afterL = pool[0]; beforeL = pool[1]; }
        else if (!afterL) afterL = (pool[0] === beforeL) ? pool[1] : pool[0];
        else beforeL = (pool[0] === afterL) ? pool[1] : pool[0];
    }

    app.beginUndoGroup("Before After Style");

    var folder = app.project.items.addFolder(src.name + " - BeforeAfter parts");
    var dur = src.duration, fps = src.frameRate;

    // ---------------- card precomps ----------------
    function makeCard(name, layer, box) {
        var c = app.project.items.addComp(name, box.w, box.h, 1, dur, fps);
        c.parentFolder = folder;
        layer.copyToComp(c);
        var v = c.layer(1);
        v.enabled = true;
        try { v.parent = null; } catch (e) {}
        try { v.threeDLayer = false; } catch (e) {}
        var tr = v.property("ADBE Transform Group");
        var sw = v.source.width * (v.source.pixelAspect || 1), sh = v.source.height;
        var s = Math.max(box.w / sw, box.h / sh) * 100;
        setP(tr.property("ADBE Anchor Point"), [v.source.width / 2, v.source.height / 2]);
        setP(tr.property("ADBE Position"), [box.w / 2, box.h / 2]);
        setP(tr.property("ADBE Scale"), [s, s]);
        setP(tr.property("ADBE Rotate Z"), 0);
        setP(tr.property("ADBE Opacity"), 100);

        var m = shapeLayer(c, "Rounded Matte");
        addRect(m, "Rect", box.w / 2, box.h / 2, box.w, box.h, box.r, [1, 1, 1]);
        m.moveBefore(v);
        if (typeof v.setTrackMatte === "function") v.setTrackMatte(m, TrackMatteType.ALPHA);
        else v.trackMatteType = TrackMatteType.ALPHA;
        return c;
    }
    var afterComp = makeCard("AFTER card", afterL, L.after);
    var beforeComp = makeCard("BEFORE card", beforeL, L.before);

    // ---------------- background precomp ----------------
    var bg = app.project.items.addComp("BG - BeforeAfter", CFG.W, CFG.H, 1, dur, fps);
    bg.parentFolder = folder;

    bg.layers.addSolid(hex("F7F7F7"), "White base", CFG.W, CFG.H, 1, dur);

    // orange curved panel (top band + left side)
    var org = rampSolid(bg, "Orange panel", [0, 0], hex("F8DCBB"), [1080, 260], hex("E29A45"));
    addMask(org, smoothShape([
        [0, 0, 1], [1080, 0, 1], [1080, 225, 1],
        [960, 375], [780, 560], [600, 800], [460, 1050],
        [345, 1320], [350, 1560], [420, 1760], [452, 1920, 1],
        [0, 1920, 1]
    ]), 8);

    // small white sliver on the left edge
    var sl = bg.layers.addSolid(hex("F2F2F0"), "Left white sliver", CFG.W, CFG.H, 1, dur);
    addMask(sl, smoothShape([[-40, 560], [70, 640], [95, 850], [60, 1060], [-40, 1140]]), 40);
    sl.property("ADBE Transform Group").property("ADBE Opacity").setValue(75);

    // window-light shadows (mullions) on the upper part
    var win = shapeLayer(bg, "Window shadows");
    var blk = [0, 0, 0];
    var bars = [ // [x,y,w,h] in 1080 space
        [0, 0, 18, 1150], [165, 0, 150, 1150], [600, 0, 75, 1000], [930, 0, 70, 900],
        [0, 360, 1080, 90], [0, 840, 1080, 80]
    ];
    for (i = 0; i < bars.length; i++) addRect(win, "bar" + i, bars[i][0] + bars[i][2] / 2, bars[i][1] + bars[i][3] / 2, bars[i][2], bars[i][3], 0, blk);
    win.property("ADBE Transform Group").property("ADBE Opacity").setValue(16);
    win.blendingMode = BlendingMode.MULTIPLY;
    fx(win, "ADBE Gaussian Blur 2").property("ADBE Gaussian Blur 2-0001").setValue(10);
    var winMask = smoothShape([[-50, -50, 1], [1130, -50, 1], [1130, 900], [500, 1250], [-50, 1350, 1]]);
    // shape layers can take masks too
    addMask(win, winMask, 220);

    // bottom shading
    var shade = rampSolid(bg, "Bottom shade", [540, 1580], [1, 1, 1], [540, 1920], hex("BDBDBD"));
    shade.blendingMode = BlendingMode.MULTIPLY;

    // subtle grain
    var grain = bg.layers.addSolid([1, 1, 1], "Grain (adjust)", CFG.W, CFG.H, 1, dur);
    grain.adjustmentLayer = true;
    var nz = fx(grain, "ADBE Noise");
    try { nz.property("ADBE Noise-0001").setValue(2.5); } catch (e) {}
    try { nz.property("ADBE Noise-0002").setValue(0); } catch (e) {} // no color noise

    // ---------------- final comp ----------------
    var fin = app.project.items.addComp(src.name + " - BeforeAfter", CFG.W, CFG.H, 1, dur, fps);
    fin.workAreaStart = src.workAreaStart;
    fin.workAreaDuration = src.workAreaDuration;

    var bgL = fin.layers.add(bg);
    bgL.audioEnabled = false;

    var bL = fin.layers.add(beforeComp);
    bL.name = "BEFORE";
    bL.property("ADBE Transform Group").property("ADBE Position").setValue([L.before.cx, L.before.cy]);
    bL.audioEnabled = false;
    dropShadow(bL, [0, 0, 0], 45, 180, 14, 45);

    var aL = fin.layers.add(afterComp);
    aL.name = "AFTER";
    aL.property("ADBE Transform Group").property("ADBE Position").setValue([L.after.cx, L.after.cy]);
    dropShadow(aL, [0, 0, 0], 50, 180, 20, 60);

    // pills
    function makePill(label, p, dotColor) {
        var body = shapeLayer(fin, label + " pill");
        addRect(body, "Body", p.cx, p.cy, p.w, p.h, p.h / 2, hex("0D0D0D"));
        addRect(body, "Gloss", p.cx, p.cy - p.h * 0.22, p.w - p.h * 0.5, p.h * 0.38, p.h * 0.19, [1, 1, 1], 9);
        var st = body.property("ADBE Root Vectors Group").property(1).property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
        st.property("ADBE Vector Stroke Color").setValue(hex("6A6A6A"));
        st.property("ADBE Vector Stroke Width").setValue(p.h > 50 ? 2.5 : 1.5);
        st.property("ADBE Vector Stroke Opacity").setValue(55);
        dropShadow(body, [0, 0, 0], 55, 180, p.h * 0.12, p.h * 0.35);

        var dot = shapeLayer(fin, label + " dot");
        addEllipse(dot, "Dot", p.dotX, p.cy, p.dotD, dotColor);
        dropShadow(dot, dotColor, 85, 0, 0, p.dotD * 0.6); // glow

        addText(fin, label, CFG.pillFont, p.size, [1, 1, 1], p.textX, p.base, p.textW).name = label + " label";
    }
    makePill(CFG.beforeLabel, L.beforePill, hex("FF1E1E"));
    makePill(CFG.afterLabel, L.afterPill, hex("3EE61A"));

    // CTA
    addText(fin, CFG.ctaLine1, CFG.ctaFont1, L.cta1.size, hex("111111"), L.cta1.x, L.cta1.base, L.cta1.w, -15).name = "CTA line 1";
    addText(fin, CFG.ctaLine2, CFG.ctaFont2, L.cta2.size, hex("0A0A0A"), L.cta2.x, L.cta2.base, L.cta2.w, -25).name = "CTA line 2";

    // extra audio-only layers (music / sfx)
    for (i = src.numLayers; i >= 1; i--) {
        var al = src.layer(i);
        if (al instanceof AVLayer && al.hasAudio && !al.hasVideo) {
            try { al.copyToComp(fin); fin.layer(1).moveToEnd(); } catch (e) {}
        }
    }

    fin.openInViewer();
    if (CFG.addToRenderQueue) { try { app.project.renderQueue.items.add(fin); } catch (e) {} }

    app.endUndoGroup();
})();
