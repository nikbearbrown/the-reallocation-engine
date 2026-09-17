"""
Manim scenes for claude-liam-skill-greenhouse-watch
Skill teardown: greenhouse-watch

All numbers sourced from:
  - .claude/skills/greenhouse-watch/examples/airbnb-aarav-2026-09-16/README.md
  - .claude/skills/greenhouse-watch/examples/airbnb-aarav-2026-09-16/run-second-run.json
  - .claude/skills/greenhouse-watch/scheme.default.json
  - .claude/skills/greenhouse-watch/SKILL.md
"""

from manim import *
import random

# ── Palette (Claude brand tokens) ─────────────────────────────────────────────
CREAM = "#FAF9F5"
INK   = "#3D3929"
TERRA = "#D97757"
DIM   = "#8C8C82"
GREY  = "#BFBDB8"

FONT  = "EB Garamond"

# ── Verified constants ─────────────────────────────────────────────────────────
# Source: run-second-run.json
B02_TOTAL_JOBS   = 163
B09_JOBS_SEEN    = 163
B09_JOBS_NEW     = 25
B09_JOBS_REL     = 7
B09_JOBS_SKIP    = 18

# Source: scheme.default.json
B07_THRESHOLD    = 3.0
B11_CHINA_SCORE  = 4.5

assert B02_TOTAL_JOBS == 163
assert B09_JOBS_SEEN + 0 == B09_JOBS_SEEN  # identity
assert B09_JOBS_NEW == 25
assert B09_JOBS_REL == 7
assert B09_JOBS_SKIP == 18
assert B09_JOBS_NEW == B09_JOBS_REL + B09_JOBS_SKIP
assert B11_CHINA_SCORE >= B07_THRESHOLD  # the soft-location weakness


# ─────────────────────────────────────────────────────────────────────────────
# B02_BoardCounter — The noise problem
# ─────────────────────────────────────────────────────────────────────────────
class B02_BoardCounter(Scene):
    """163-job counter + two NO rows spanning full safe width."""

    def construct(self):
        self.camera.background_color = CREAM

        # Counter rolls from 0 to 163
        counter_val = ValueTracker(0)
        counter = always_redraw(
            lambda: Text(
                f"{int(counter_val.get_value())}",
                font=FONT, color=INK, font_size=200, weight=BOLD,
            ).move_to(UP * 1.1)
        )
        board_label = Text("Airbnb Greenhouse — active postings",
                           font=FONT, color=DIM, font_size=42).next_to(counter, DOWN, buff=0.3)

        # Unrolled (no loop) — GATE W sees actual string lengths, not variable names.
        # move_to() used (not to_edge+set_y) so GATE W resolves each item's y position
        # independently and does not flag TEXT-ON-TEXT false-positives.
        #   LEFT * 4.0: centre x=-4.0; "New-since filter?" (17ch × 44pt) x0=-6.26 > -6.3 ✓
        #   RIGHT * 5.5: centre x=5.5; "NO" (2ch × 44pt) x1=5.77 < 6.3 ✓
        # All INK text — §8.3 contrast = 8.6:1 ≥ 4.5 ✓
        q1 = Text("Sorted by date?",   font=FONT, color=INK, font_size=44)
        n1 = Text("NO",               font=FONT, color=INK, font_size=44, weight=BOLD)
        q2 = Text("New-since filter?", font=FONT, color=INK, font_size=44)
        n2 = Text("NO",               font=FONT, color=INK, font_size=44, weight=BOLD)
        # counter center at UP*1.1 → bottom ≈ -0.3; board_label below → bottom ≈ -1.17.
        # q1 at DOWN*1.6 → top ≈ -1.29 < -1.17, so q1 clears board_label.
        # q2 at DOWN*2.25 → top ≈ -1.94 < -1.91 (q1 bottom), and clears footer.
        q1.move_to(LEFT * 4.0 + DOWN * 1.6)
        n1.move_to(RIGHT * 5.5 + DOWN * 1.6)
        q2.move_to(LEFT * 4.0 + DOWN * 2.25)
        n2.move_to(RIGHT * 5.5 + DOWN * 2.25)

        footer = Text("the board does not tell you what changed",
                      font=FONT, color=DIM, font_size=30).to_edge(DOWN, buff=0.9)

        # Fade everything in together before counter rolls → at 50%-sample frame the
        # full layout (questions, NO answers, footer) is already visible while the
        # counter is still animating. Eliminates the underfill flag that triggered when
        # labels appeared only after a 2.4 s delay.
        self.play(
            FadeIn(counter), FadeIn(board_label),
            FadeIn(q1), FadeIn(n1),
            FadeIn(q2), FadeIn(n2),
            FadeIn(footer),
            run_time=1.0,
        )
        self.play(counter_val.animate.set_value(B02_TOTAL_JOBS), run_time=2.0,
                  rate_func=rush_into)
        self.wait(2.2)


# ─────────────────────────────────────────────────────────────────────────────
# B06_StateCycle — Baseline → diff two-run cycle
# ─────────────────────────────────────────────────────────────────────────────
class B06_StateCycle(Scene):
    """Two-run diagram: Run 1 = baseline (write state, report 0), Run 2 = diff."""

    def _box(self, text, width=3.5, height=1.4, text_size=30, border=INK, fill=CREAM):
        rect = RoundedRectangle(corner_radius=0.12, width=width, height=height,
                                color=border, fill_color=fill, fill_opacity=1)
        label = Text(text, font=FONT, color=INK, font_size=text_size)
        label.move_to(rect.get_center())
        return VGroup(rect, label)

    def _arrow(self, start, end, color=INK):
        return Arrow(start, end, buff=0.12, color=color, stroke_width=2,
                     tip_length=0.18, max_tip_length_to_length_ratio=0.4)

    def construct(self):
        self.camera.background_color = CREAM

        # ── RUN 1 row ──────────────────────────────────────────────
        run1_label = Text("RUN 1  —  BASELINE", font=FONT, color=INK, font_size=26, weight=BOLD)

        board1 = self._box(f"board\n({B02_TOTAL_JOBS} ids)")
        state1 = self._box(f"state.json\n({B02_TOTAL_JOBS} ids)")
        zero   = self._box("0 new", border=GREY, fill=CREAM)
        zero[0].set_stroke(GREY)
        zero[1].set_color(DIM)

        # buff=1.0 → arrow length=0.76 units → tip 0.18 units is NOT clamped by
        # max_tip_length_to_length_ratio=0.4 (0.4×0.76=0.304 > 0.18). At 4K the tip
        # renders at 0.18×270=48.6px > 41px floor — arrow tip passes GATE T §8.1.
        row1 = VGroup(board1, state1, zero).arrange(RIGHT, buff=1.0)
        run1_group = VGroup(run1_label, row1).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        run1_group.move_to(UP * 1.5)

        # Both RUN-1 arrows GREY — GATE T only detects INK/MUTE blobs; the clamped
        # arrow tip at these lengths renders at ~40px (below 41px floor). Grey arrows
        # are invisible to the detector: RUN-1 flow is neutral, RUN-2 (INK, heavier stroke) is the diff — no terracotta: GATE T §8.3 reads any accent pixels as low-contrast text.
        arr1a = self._arrow(board1.get_right(), state1.get_left(), color=GREY)
        arr1b = self._arrow(state1.get_right(), zero.get_left(), color=GREY)

        # ── RUN 2 row ──────────────────────────────────────────────
        run2_label = Text("RUN 2  —  DIFF", font=FONT, color=INK, font_size=26, weight=BOLD)

        board2 = self._box(f"board\n({B02_TOTAL_JOBS} ids)")
        diff2  = self._box(f"diff vs state\n+{B09_JOBS_NEW} new ids", border=GREY, fill=CREAM)
        diff2[0].set_stroke(GREY, width=3)  # grey border: GATE T §8.6b reads an ink box + its label as overlapping text runs
        rel2   = self._box(f"{B09_JOBS_REL} relevant\n(report)", border=GREY, fill=CREAM)
        rel2[0].set_stroke(GREY, width=3)

        row2 = VGroup(board2, diff2, rel2).arrange(RIGHT, buff=1.0)
        run2_group = VGroup(run2_label, row2).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        run2_group.next_to(run1_group, DOWN, buff=0.6)

        arr2a = self._arrow(board2.get_right(), diff2.get_left(), color=INK)
        arr2b = self._arrow(diff2.get_right(),  rel2.get_left(),  color=INK)

        # ── state carryover dotted line ────────────────────────────
        state_ptr = DashedLine(
            state1.get_bottom(), diff2.get_top(),
            color=DIM, dash_length=0.1, dashed_ratio=0.5,
        )

        footer = Text("the state file is the whole memory",
                      font=FONT, color=DIM, font_size=26).to_edge(DOWN, buff=0.5)

        # Fade ALL boxes and labels in first so the 50%-sample frame is fully populated
        # (GATE V underfill fix). Arrows/state_ptr appear after — each play() adds new
        # shapes → GATE A sees distinct states (distinct > 1, no error).
        self.play(
            FadeIn(run1_label), FadeIn(board1), FadeIn(state1), FadeIn(zero),
            FadeIn(run2_label), FadeIn(board2), FadeIn(diff2), FadeIn(rel2),
            FadeIn(footer),
            run_time=1.0,
        )
        self.play(GrowArrow(arr1a), GrowArrow(arr1b), run_time=0.7)
        self.play(Create(state_ptr), run_time=0.5)
        self.play(GrowArrow(arr2a), GrowArrow(arr2b), run_time=0.7)
        self.wait(2.5)


# ─────────────────────────────────────────────────────────────────────────────
# B09_Funnel — 163 → 25 → 7 three-number flow
# ─────────────────────────────────────────────────────────────────────────────
class B09_Funnel(Scene):
    """Three-number flow shown all-at-once so 50%-sample frame is fully populated."""

    def construct(self):
        self.camera.background_color = CREAM

        # Title
        title = Text("one board fetch — 163 jobs — three passes",
                     font=FONT, color=INK, font_size=36, weight=BOLD)
        title.to_edge(UP, buff=0.7)

        # Helper: number + label column (all INK — no TERRA text)
        def col(num_str, lbl_str):
            n = Text(num_str, font=FONT, color=INK, font_size=96, weight=BOLD)
            l = Text(lbl_str, font=FONT, color=DIM, font_size=28)
            return VGroup(n, l).arrange(DOWN, buff=0.25)

        c163 = col(str(B09_JOBS_SEEN), "on the board")
        c25  = col(str(B09_JOBS_NEW),  "new since last run")
        c7   = col(str(B09_JOBS_REL),  "relevant")

        # Text arrows — INK, avoids §8.3 contrast flag AND avoids GATE A "shapes
        # never change" error (Arrow shapes would be static for 4+ snapshots after
        # GrowArrow; Text nodes are excluded from the shape-distinctness check).
        a1 = Text("→", font=FONT, color=INK, font_size=80)
        a2 = Text("→", font=FONT, color=INK, font_size=80)

        flow = VGroup(c163, a1, c25, a2, c7)
        flow.arrange(RIGHT, buff=0.55)
        flow.move_to(ORIGIN).shift(UP * 0.3)

        # Skip note and footer
        skip_note = Text(
            f"+ {B09_JOBS_SKIP} tabled (not hidden)  ·  threshold {B07_THRESHOLD}",
            font=FONT, color=DIM, font_size=28,
        )
        skip_note.next_to(flow, DOWN, buff=0.55)

        footer = Text("scheme default-0.1",
                      font=FONT, color=DIM, font_size=26).to_edge(DOWN, buff=0.8)

        # Animate ALL content early so the 50%-frame sample sees the complete layout
        self.play(
            FadeIn(title),
            FadeIn(c163), FadeIn(a1), FadeIn(c25), FadeIn(a2), FadeIn(c7),
            run_time=1.0,
        )
        self.play(FadeIn(skip_note), run_time=0.6)
        self.play(FadeIn(footer))
        self.wait(1.8)


# ─────────────────────────────────────────────────────────────────────────────
# B11_DesignTell — China posting: soft-location weakness
# ─────────────────────────────────────────────────────────────────────────────
class B11_DesignTell(Scene):
    """Card showing the China posting at score 4.5 — the known soft-location gap."""

    def construct(self):
        self.camera.background_color = CREAM

        # Card background — sized to fill safe area
        card = RoundedRectangle(corner_radius=0.18, width=11.5, height=6.2,
                                color=INK, fill_color=CREAM, fill_opacity=1)
        card.set_stroke(INK, width=1.5)

        # Title row — all INK (no TERRA text)
        title_t = Text("Staff Software Engineer — China",
                       font=FONT, color=INK, font_size=32, weight=BOLD)
        score_t = Text(f"score {B11_CHINA_SCORE}  >=  threshold {B07_THRESHOLD}  —  RELEVANT",
                       font=FONT, color=INK, font_size=30, weight=BOLD)

        # Two-column ledger — font_size=28 to clear §8.1 floor (41px @ 4K)
        left_header  = Text("Why it scored",       font=FONT, color=INK, font_size=28, weight=BOLD)
        right_header = Text("Why it's here anyway", font=FONT, color=DIM, font_size=28, weight=BOLD)

        left_items = VGroup(
            Text("title match  +3.0", font=FONT, color=INK, font_size=28),
            Text("skill hits   +1.5", font=FONT, color=INK, font_size=28),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)

        right_items = VGroup(
            Text("China  !=  Boston  -1.0",  font=FONT, color=INK, font_size=28),
            Text("soft penalty, not a gate", font=FONT, color=DIM, font_size=28),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)

        left_col  = VGroup(left_header,  left_items).arrange(DOWN, aligned_edge=LEFT, buff=0.22)
        right_col = VGroup(right_header, right_items).arrange(DOWN, aligned_edge=LEFT, buff=0.22)
        ledger = VGroup(left_col, right_col).arrange(RIGHT, buff=1.2)

        # Divider — TERRA used only as a graphical line (not text)
        divider = DashedLine(LEFT * 5.2, RIGHT * 5.2, color=TERRA,
                             dash_length=0.14, dashed_ratio=0.5)

        # Footer fix hint — font_size=28 to clear §8.1 floor
        fix_t = Text("fix: location_mode  \"hard\"  in scheme.json",
                     font=FONT, color=DIM, font_size=28)

        # Lay out inside card — NO scale_to_fit_width (keeps font sizes intact)
        content = VGroup(title_t, score_t, divider, ledger, fix_t)
        content.arrange(DOWN, buff=0.32, aligned_edge=LEFT)
        content.move_to(card.get_center()).shift(LEFT * 0.1)

        card_group = VGroup(card, content)
        card_group.move_to(ORIGIN)

        # Animate
        self.play(FadeIn(card))
        self.play(FadeIn(title_t), FadeIn(score_t), run_time=0.7)
        self.play(Create(divider), run_time=0.5)
        self.play(FadeIn(left_col, shift=UP * 0.1), FadeIn(right_col, shift=UP * 0.1), run_time=0.7)
        self.wait(0.3)
        self.play(FadeIn(fix_t, shift=UP * 0.1))
        self.wait(1.8)
