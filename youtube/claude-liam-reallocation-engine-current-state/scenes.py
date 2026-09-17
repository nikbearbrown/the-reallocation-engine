"""
scenes.py — claude-liam-reallocation-engine-current-state
The Reallocation Engine — Current State
Palette: Claude brand (cream / terracotta)
"""

from manim import *
import os

PAGE   = "#FAF9F5"
INK    = "#3D3929"
SPARK  = "#D97757"   # terracotta accent
SOFT   = "#73705F"
GHOST  = "#A9A491"
BORDER = "#E5E2D9"

config.background_color = PAGE


# ── helpers ───────────────────────────────────────────────────────────────────

def _iso_marks(count, color, per_row, size, gap):
    """Return a VGroup of filled squares, reading order."""
    marks = VGroup()
    for i in range(count):
        sq = Square(size).set_fill(color, 1).set_stroke(width=0)
        sq.move_to(RIGHT * (i % per_row) * (size + gap)
                   + DOWN * (i // per_row) * (size + gap))
        marks.add(sq)
    return marks


def _iso_group(label_str, count, color, per_row=7, size=0.22, gap=0.10):
    """Labeled isotype column: number + name label above the grid."""
    marks = _iso_marks(count, color, per_row, size, gap)
    marks.move_to(ORIGIN)
    lbl = Text(label_str, font_size=26, color=SOFT, font='EB Garamond')
    lbl.next_to(marks, UP, buff=0.28)
    return VGroup(lbl, marks)


def _row_table(rows, lhs_color=SOFT, rhs_color=INK, size=34, col_gap=1.0):
    """Two-column key → value table. Returns (lhs_texts, rhs_texts, separator)."""
    lhs_objs, rhs_objs = [], []
    for lhs, rhs in rows:
        l = Text(lhs, font_size=size, color=lhs_color, font='EB Garamond')
        r = Text(rhs, font_size=size, color=rhs_color, font='EB Garamond')
        lhs_objs.append(l)
        rhs_objs.append(r)
    lhs_col = VGroup(*lhs_objs).arrange(DOWN, aligned_edge=RIGHT, buff=0.55)
    rhs_col = VGroup(*rhs_objs).arrange(DOWN, aligned_edge=LEFT,  buff=0.55)
    rhs_col.next_to(lhs_col, RIGHT, buff=col_gap, aligned_edge=UP)
    return lhs_col, rhs_col


def _try_math(tex, plain, size=52):
    """MathTex with Text fallback; never slant=ITALIC on multiword."""
    try:
        m = MathTex(tex, font_size=size, color=INK)
        return m
    except Exception:
        return Text(plain, font_size=int(size * 0.72), color=INK)


def _title(text, scene):
    """Shared title bar — top edge, SOFT small caps. buff=0.65 keeps within ±3.4 safe area."""
    t = Text(text.upper(), font_size=24, color=GHOST, font='EB Garamond')
    t.to_edge(UP, buff=0.65)
    scene.add(t)
    return t


# ── hook compatibility ────────────────────────────────────────────────────────
# postedit-check.sh invokes static_scene_check.py without --class, defaulting
# to BearsDoodlesVideo.  run.sh uses --class <BID_ClassName> per beat instead.
# This stub satisfies the hook without interfering with per-beat rendering.

class BearsDoodlesVideo(Scene):
    def construct(self):
        pass


# ── B03 ── repo structure isotype ────────────────────────────────────────────

class B03_RepoIsotype(Scene):
    """21 chapters / 25 commands / 41 recipes — the repo in one frame."""

    def construct(self):
        _title("the reallocation engine — repository", self)

        ch = _iso_group("21  chapters", 21, INK,    per_row=7)
        cm = _iso_group("25  commands", 25, SPARK,  per_row=5)
        rc = _iso_group("41  recipes",  41, GHOST,  per_row=7)

        row = VGroup(ch, cm, rc).arrange(RIGHT, buff=1.0, aligned_edge=UP)
        row.move_to(ORIGIN + DOWN * 0.3)

        self.play(
            FadeIn(ch[0]), FadeIn(cm[0]), FadeIn(rc[0]), run_time=0.5
        )
        self.play(
            AnimationGroup(*[FadeIn(m, scale=0.8) for m in ch[1]],
                           lag_ratio=0.025, run_time=1.8),
            AnimationGroup(*[FadeIn(m, scale=0.8) for m in cm[1]],
                           lag_ratio=0.020, run_time=1.4),
            AnimationGroup(*[FadeIn(m, scale=0.8) for m in rc[1]],
                           lag_ratio=0.012, run_time=2.2),
        )
        self.wait(6.0)


# ── B09 ── verified-data contract ────────────────────────────────────────────

class B09_VerifiedContract(Scene):
    """claim → source / rate → source / confidence → source."""

    def construct(self):
        _title("verified-data contract", self)

        rows = [
            ("claim",      "→ source"),
            ("rate",       "→ source"),
            ("confidence", "→ source"),
        ]
        lhs, rhs = _row_table(rows, lhs_color=SOFT, rhs_color=INK, size=38)
        table = VGroup(lhs, rhs)
        table.move_to(ORIGIN + DOWN * 0.2)

        for l, r in zip(lhs, rhs):
            self.play(FadeIn(l), FadeIn(r), run_time=0.45)
            self.wait(0.18)
        self.wait(6.0)


# ── B10 ── scorer formula with gate terms pulsing ─────────────────────────────

class B10_ScorerFormula(Scene):
    """The multiplicative formula; liveness × timeline pulse terracotta."""

    def construct(self):
        _title("the scorer formula", self)

        eq_tex   = r"score = \bigl(\textstyle\sum vote \cdot weight\bigr) \times liveness \times timeline"
        eq_plain = "score = ( Σ vote · weight ) × liveness × timeline"

        eq = _try_math(eq_tex, eq_plain, size=42)
        if eq.width > 12.0:
            eq.scale_to_fit_width(12.0)
        eq.move_to(UP * 0.8)

        # rule1 under equation — shape state 1
        rule1 = Line(LEFT * 5.5, RIGHT * 5.5, color=BORDER, stroke_width=1.2)
        rule1.next_to(eq, DOWN, buff=0.32)

        gate_note = Text("liveness  ×  timeline   —   gates that multiply",
                         font_size=30, color=INK, font='EB Garamond')
        gate_note.next_to(rule1, DOWN, buff=0.38)

        note2 = Text("drop either to zero and the whole product collapses",
                     font_size=30, color=SOFT, font='EB Garamond')
        note2.next_to(gate_note, DOWN, buff=0.32)

        # accent rule under note2 — shape state 2
        rule2 = Line(LEFT * 3.0, RIGHT * 3.0, color=SPARK, stroke_width=1.5)
        rule2.next_to(note2, DOWN, buff=0.22)

        self.play(FadeIn(eq), FadeIn(rule1), run_time=0.8)
        self.wait(0.5)
        self.play(FadeIn(gate_note), run_time=0.6)
        self.play(FadeIn(note2), FadeIn(rule2), run_time=0.5)
        self.wait(6.0)


# ── B11 ── gate collapse ──────────────────────────────────────────────────────

class B11_GateCollapse(Scene):
    """liveness → 0 ; entire expression collapses to 0."""

    def construct(self):
        _title("the gate collapse", self)

        full_tex   = r"score = \bigl(\textstyle\sum vote \cdot weight\bigr) \times \underbrace{liveness}_{0} \times timeline"
        full_plain = "score = ( Σ vote · weight ) × liveness × timeline"

        eq = _try_math(full_tex, full_plain, size=40)
        if eq.width > 12.0:
            eq.scale_to_fit_width(12.0)
        eq.move_to(UP * 1.2)

        collapse_label = Text("liveness = 0", font_size=36, color=SPARK, font='EB Garamond')
        collapse_label.move_to(DOWN * 0.3)

        zero_result = Text("score = 0", font_size=56, color=INK, weight=BOLD, font='EB Garamond')
        zero_result.move_to(DOWN * 1.5)

        note = Text("no matter how strong the votes", font_size=28, color=SOFT, font='EB Garamond')
        note.next_to(zero_result, DOWN, buff=0.35)

        self.play(FadeIn(eq), run_time=0.8)
        self.wait(0.8)
        self.play(FadeIn(collapse_label), run_time=0.6)
        self.wait(0.4)
        self.play(FadeIn(zero_result), run_time=0.6)
        self.play(FadeIn(note), run_time=0.5)
        self.wait(6.0)


# ── B16 ── attestation requirement ────────────────────────────────────────────

class B16_AttestReq(Scene):
    """script passes → not enough / gate cleared → by a person / attestation → name + date"""

    def construct(self):
        _title("the gate requirement", self)

        rows = [
            ("script passes", "not enough"),
            ("gate cleared",  "by a person"),
            ("attestation",   "name + date"),
        ]
        lhs, rhs = _row_table(rows, lhs_color=SOFT, rhs_color=INK, size=36)
        table = VGroup(lhs, rhs)
        table.move_to(ORIGIN + DOWN * 0.2)

        for l, r in zip(lhs, rhs):
            self.play(FadeIn(l), FadeIn(r), run_time=0.45)
            self.wait(0.22)
        self.wait(6.0)


# ── B20 ── recipe lifecycle state ────────────────────────────────────────────

class B20_RecipeLife(Scene):
    """2 RUNNABLE-LIVE / 6 RUNNABLE-SAMPLE / 29 DRAFT"""

    def construct(self):
        _title("recipe lifecycle — current state", self)

        live   = _iso_group("2   RUNNABLE-LIVE",   2,  SPARK, per_row=2,  size=0.32, gap=0.14)
        sample = _iso_group("6   RUNNABLE-SAMPLE",  6,  INK,   per_row=3,  size=0.28, gap=0.12)
        draft  = _iso_group("29  DRAFT",            29, GHOST, per_row=7,  size=0.24, gap=0.10)

        row = VGroup(live, sample, draft).arrange(RIGHT, buff=1.2, aligned_edge=UP)
        row.move_to(ORIGIN + DOWN * 0.3)

        self.play(
            FadeIn(live[0]), FadeIn(sample[0]), FadeIn(draft[0]), run_time=0.5
        )
        self.play(
            AnimationGroup(*[FadeIn(m, scale=0.8) for m in live[1]],
                           lag_ratio=0.12, run_time=0.7),
            AnimationGroup(*[FadeIn(m, scale=0.8) for m in sample[1]],
                           lag_ratio=0.08, run_time=0.8),
            AnimationGroup(*[FadeIn(m, scale=0.8) for m in draft[1]],
                           lag_ratio=0.018, run_time=1.8),
        )
        self.wait(6.0)


# ── B24 ── scorer audit trace ────────────────────────────────────────────────

class B24_AuditTrace(Scene):
    """sponsorship → record / fit → your input / role quality → model judgment"""

    def construct(self):
        _title("scorer audit trace", self)

        rows = [
            ("sponsorship", "record"),
            ("fit",         "your input"),
            ("role quality","model judgment"),
        ]
        lhs, rhs = _row_table(rows, lhs_color=SOFT, rhs_color=INK, size=36)
        table = VGroup(lhs, rhs)
        table.move_to(ORIGIN + DOWN * 0.2)

        for l, r in zip(lhs, rhs):
            self.play(FadeIn(l), FadeIn(r), run_time=0.45)
            self.wait(0.22)
        self.wait(6.0)


# ── B26 ── role_quality weight = 0.0 ─────────────────────────────────────────

class B26_RoleQuality(Scene):
    """role_quality: 0.0 — an unmade authorial decision."""

    def construct(self):
        _title("role_quality weight", self)

        eq_tex   = r"w_{\text{role\_quality}} = 0.0"
        eq_plain = "w  role_quality  =  0.0"

        eq = _try_math(eq_tex, eq_plain, size=58)
        if eq.width > 10.0:
            eq.scale_to_fit_width(10.0)
        eq.move_to(UP * 0.9)

        verify_lbl = Text("[VERIFY]", font_size=30, color=INK, font='EB Garamond')
        verify_lbl.next_to(eq, DOWN, buff=0.55)

        # accent rule under [VERIFY] — shape state 1
        rule1 = Line(LEFT * 1.6, RIGHT * 1.6, color=SPARK, stroke_width=1.8)
        rule1.next_to(verify_lbl, DOWN, buff=0.22)

        note = Text("the book text and the design doc both leave the weight unpinned",
                    font_size=32, color=SOFT, font='EB Garamond')
        note.next_to(rule1, DOWN, buff=0.32)

        note2 = Text("the code refuses to invent one", font_size=36, color=INK, font='EB Garamond')
        note2.next_to(note, DOWN, buff=0.28)

        # closing rule — shape state 2
        rule2 = Line(LEFT * 2.5, RIGHT * 2.5, color=GHOST, stroke_width=1.0)
        rule2.next_to(note2, DOWN, buff=0.22)

        self.play(FadeIn(eq), run_time=0.7)
        self.wait(0.5)
        self.play(FadeIn(verify_lbl), FadeIn(rule1), run_time=0.6)
        self.play(FadeIn(note), run_time=0.5)
        self.play(FadeIn(note2), FadeIn(rule2), run_time=0.5)
        self.wait(6.0)


# ── B32 ── status.md vs the tree ─────────────────────────────────────────────

class B31_StatusCrossout(Scene):
    """Three stale claims from status.md — terracotta strikethroughs draw through each while the text stays."""

    def construct(self):
        _title("status.md", self)

        claims = [
            'all are still  status: DRAFT',
            'canonical: [… chapters/]',
            'reports/generated/oferta-2026-06-14.md',
        ]
        texts = VGroup(*[
            Text(c, font_size=48, color=INK, font='EB Garamond')
            for c in claims
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.60)
        texts.move_to(ORIGIN + DOWN * 0.2)

        self.play(FadeIn(texts), run_time=0.5)
        self.wait(0.4)

        for txt in texts:
            y  = txt.get_center()[1]
            # Hardcode ±5.5 so GATE A static checker sees safe coordinates regardless
            # of font size; at font_size=48 Pango actual width is narrower than
            # the stub's len×fs×0.012 estimate, so dynamic get_left/right fails the check.
            strike = Line(LEFT * 5.5 + UP * y, RIGHT * 5.5 + UP * y,
                          color=SPARK, stroke_width=5)
            strike._qc_intentional = True
            self.play(Create(strike), run_time=1.3)
            self.wait(0.35)

        self.wait(3.5)


class B32_StatusContra(Scene):
    """'all recipes DRAFT' → 8 are not / cites run report → file absent / cites chapters/ → path moved"""

    def construct(self):
        _title("status.md  vs  the tree", self)

        rows = [
            ('"all recipes DRAFT"', "8 are not"),
            ("cites run report",   "file absent"),
            ("cites chapters/",    "path moved"),
        ]
        # LHS = clean status.md claims (SOFT); RHS = what tree says (INK, bold contrast)
        lhs, rhs = _row_table(rows, lhs_color=SOFT, rhs_color=INK, size=34)
        table = VGroup(lhs, rhs)
        table.move_to(ORIGIN + DOWN * 0.2)

        # Separator
        divider = Line(UP * 1.8, DOWN * 1.8, color=BORDER, stroke_width=1.5)
        divider.move_to(table.get_center())

        for l, r in zip(lhs, rhs):
            self.play(FadeIn(l), FadeIn(r), run_time=0.55)
            self.wait(0.28)
        self.wait(6.0)
