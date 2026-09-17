from manim import *
import numpy as np

BG    = ManimColor("#F2F0E9")
INK   = ManimColor("#3D3929")
ACC   = ManimColor("#D97757")
SOFT  = ManimColor("#73705F")
GHOST = ManimColor("#A9A491")

SCENARIO_CREDIT = "the book's opening scenario"


def credit(text=SCENARIO_CREDIT):
    return Text(text, font_size=11, color=GHOST, font='EB Garamond').to_corner(DR, buff=0.9)


# ─── B01_TwoCounters ────────────────────────────────────────────────────────
# Two large numerals in counterpoint: APPLICATIONS SENT climbs 0→200 in ink;
# DAYS OF CLOCK LEFT falls 90→31 and lands terracotta.
# B11_TheReallocation re-establishes this same frame — keep layout identical.
# ────────────────────────────────────────────────────────────────────────────
class B01_TwoCounters(Scene):
    def construct(self):
        self.camera.background_color = BG
        self.add(credit())

        rule = Line(UP * 2.8, DOWN * 2.2, stroke_width=1, color=SOFT).set_opacity(0.35)
        self.add(rule)

        lbl_left = Text("APPLICATIONS SENT", font_size=17, color=SOFT, weight=BOLD, font='EB Garamond')
        lbl_left.shift(LEFT * 3.5 + UP * 2.8)
        lbl_right = Text("DAYS OF CLOCK LEFT", font_size=17, color=SOFT, weight=BOLD, font='EB Garamond')
        lbl_right.shift(RIGHT * 3.5 + UP * 2.8)
        self.play(FadeIn(lbl_left), FadeIn(lbl_right), run_time=0.4)

        # Counters — use ValueTracker + always_redraw for reliable animation
        left_val  = ValueTracker(0)
        right_val = ValueTracker(90)

        left_num  = always_redraw(lambda: Integer(int(left_val.get_value()), font_size=148, color=INK)
                                          .move_to(LEFT * 3.5 + UP * 0.2))
        right_num = always_redraw(lambda: Integer(int(right_val.get_value()), font_size=148,
                                          color=(INK if right_val.get_value() > 31.1 else ACC))
                                          .move_to(RIGHT * 3.5 + UP * 0.2))
        self.add(left_num, right_num)

        # Left climbs first
        self.play(left_val.animate.set_value(200), run_time=2.2, rate_func=linear)
        self.wait(0.25)

        # Right falls, arrives terracotta
        self.play(right_val.animate.set_value(31), run_time=2.0, rate_func=smooth)

        # Floor mark — terracotta accent under the right numeral (31-day floor)
        floor_mark = Line(RIGHT * 2.0 + DOWN * 1.1, RIGHT * 5.0 + DOWN * 1.1,
                          stroke_width=3, color=ACC)
        self.play(FadeIn(floor_mark), run_time=0.4)
        self.wait(1.1)


# ─── B04_TwoLetterGrades ────────────────────────────────────────────────────
# Two vertical bars from a shared zero baseline.
# hand-coded → 67%; AI-assisted → 50%.
# Gap arrow + "~17 points ≈ two letter grades".
# Sting: terracotta label "felt they had learned more" on the LOWER bar.
# Cite small, once.
# ────────────────────────────────────────────────────────────────────────────
class B04_TwoLetterGrades(Scene):
    def construct(self):
        self.camera.background_color = BG
        self.add(credit())
        title = Text("EXAM PERFORMANCE", font_size=28, color=INK, weight=BOLD, font='EB Garamond').move_to(UP * 3.0)
        self.add(title)

        baseline_y = -2.0
        max_h = 4.2
        bar_w = 1.3
        left_x, right_x = -2.4, 2.4

        h_left  = 0.67 * max_h   # 2.814
        h_right = 0.50 * max_h   # 2.100

        # Axis baseline
        axis = Line(LEFT * 4.5, RIGHT * 4.5, stroke_width=2, color=INK).shift(UP * baseline_y)
        self.play(Create(axis), run_time=0.4)

        # Group labels
        lbl_l = Text("hand-coded",  font_size=22, color=SOFT, font='EB Garamond').move_to([left_x,  baseline_y - 0.55, 0])
        lbl_r = Text("AI-assisted", font_size=22, color=SOFT, font='EB Garamond').move_to([right_x, baseline_y - 0.55, 0])
        self.play(FadeIn(lbl_l), FadeIn(lbl_r), run_time=0.4)

        # Left bar 67%
        bar_l = Rectangle(width=bar_w, height=h_left,
                          fill_color=INK, fill_opacity=0.82, stroke_color=INK, stroke_width=1.5)
        bar_l.move_to([left_x, baseline_y + h_left / 2, 0])
        val_l = Text("67%", font_size=32, color=INK, weight=BOLD, font='EB Garamond').move_to([left_x, baseline_y + h_left + 0.4, 0])
        self.play(GrowFromEdge(bar_l, DOWN), run_time=1.0)
        self.play(FadeIn(val_l), run_time=0.3)

        # Right bar 50%
        bar_r = Rectangle(width=bar_w, height=h_right,
                          fill_color=INK, fill_opacity=0.82, stroke_color=INK, stroke_width=1.5)
        bar_r.move_to([right_x, baseline_y + h_right / 2, 0])
        val_r = Text("50%", font_size=32, color=INK, weight=BOLD, font='EB Garamond').move_to([right_x, baseline_y + h_right + 0.4, 0])
        self.play(GrowFromEdge(bar_r, DOWN), run_time=0.9)
        self.play(FadeIn(val_r), run_time=0.3)

        # Gap bracket: DoubleArrow on the right side spanning left-top to right-top height
        gap_x = right_x + bar_w / 2 + 0.5
        gap_arrow = DoubleArrow(
            [gap_x, baseline_y + h_right, 0],
            [gap_x, baseline_y + h_left,  0],
            stroke_width=2.5, color=INK, buff=0, tip_length=0.18
        )
        gap_lbl = Text("~17 pts", font_size=18, color=INK, font='EB Garamond').next_to(gap_arrow, RIGHT, buff=0.2)
        grade_note = Text("two letter grades", font_size=15, color=SOFT, font='EB Garamond').next_to(gap_lbl, DOWN, buff=0.12)
        self.play(FadeIn(gap_arrow), FadeIn(gap_lbl), run_time=0.7)
        self.play(FadeIn(grade_note), run_time=0.3)

        # Sting: terracotta label + arrow → LOWER bar
        sting_txt = Text("felt they had learned more", font_size=19, color=ACC, weight=BOLD, font='EB Garamond')
        sting_txt.move_to([right_x, baseline_y + h_right / 2 + 0.6, 0]).shift(LEFT * 2.4)
        sting_arrow = Arrow(
            sting_txt.get_right() + RIGHT * 0.1,
            [right_x, baseline_y + h_right / 2, 0],
            stroke_width=2, color=ACC, buff=0.12
        )
        self.play(FadeIn(sting_txt), GrowArrow(sting_arrow), run_time=0.9)

        # Citation — buff=0.9 keeps it inside the ±6.3x / ±3.4y safe area
        cite = Text(
            "Shen & Tamkin, Anthropic, 2026  ·  n = 52  ·  arXiv:2601.20245",
            font_size=10, color=GHOST, font='EB Garamond'
        ).to_corner(DR, buff=0.9)
        self.play(FadeIn(cite), run_time=0.4)
        self.wait(1.5)


# ─── B09_SelfAudit ───────────────────────────────────────────────────────────
# A WEIGHTS box emits an output card; an audit arrow curves BACK into the same
# box (the self-audit loop). Loop dims. Then a terracotta external arrow from
# "someone with stakes" lands on the output card — the only terracotta.
# ────────────────────────────────────────────────────────────────────────────
class B09_SelfAudit(Scene):
    def construct(self):
        self.camera.background_color = BG
        self.add(credit())
        title = Text("SELF-AUDIT LOOP", font_size=44, color=INK, weight=BOLD, font='EB Garamond').move_to(UP * 3.0)
        self.add(title)

        # WEIGHTS box (left centre)
        w_box = Rectangle(width=2.8, height=1.1,
                          fill_color=WHITE, fill_opacity=0.85,
                          stroke_color=INK, stroke_width=2.5).move_to(LEFT * 2.5 + UP * 0.4)
        w_lbl = Text("WEIGHTS", font_size=26, color=INK, weight=BOLD, font='EB Garamond').move_to(w_box)

        # OUTPUT card (centre-right)
        o_card = Rectangle(width=2.2, height=0.85,
                           fill_color=WHITE, fill_opacity=0.85,
                           stroke_color=INK, stroke_width=1.5).move_to(RIGHT * 2.0 + DOWN * 1.0)
        o_lbl = Text("output", font_size=22, color=INK, font='EB Garamond').move_to(o_card)

        # Emit arrow: weights → output
        emit = Arrow(w_box.get_bottom() + RIGHT * 0.6,
                     o_card.get_top(), stroke_width=2, color=INK, buff=0.08)

        self.play(FadeIn(w_box), FadeIn(w_lbl), run_time=0.5)
        self.play(GrowArrow(emit), run_time=0.5)
        self.play(FadeIn(o_card), FadeIn(o_lbl), run_time=0.4)

        # Audit arc: output → back into weights (loop)
        audit_arc = CurvedArrow(
            o_card.get_left() + UP * 0.15,
            w_box.get_bottom() + LEFT * 0.4,
            angle=-TAU / 4.5, stroke_width=2, color=INK
        )
        audit_lbl = Text("audit", font_size=19, color=SOFT, font='EB Garamond').move_to(LEFT * 0.4 + DOWN * 0.8)
        self.play(Create(audit_arc), FadeIn(audit_lbl), run_time=1.0)

        # Loop dims — circuit cannot see its own fault
        loop = VGroup(w_box, w_lbl, emit, o_card, o_lbl, audit_arc, audit_lbl)
        self.play(loop.animate.set_opacity(0.32), run_time=0.8)

        # External check: terracotta arrow from "someone with stakes"
        s_chip = Rectangle(width=2.8, height=0.85,
                           fill_color=WHITE, fill_opacity=0.90,
                           stroke_color=ACC, stroke_width=2.5).move_to(RIGHT * 4.8 + DOWN * 0.2)
        s_lbl = Text("someone with stakes", font_size=15, color=ACC, font='EB Garamond').move_to(s_chip)

        ext_arrow = Arrow(
            s_chip.get_left(),
            o_card.get_right() + UP * 0.1,
            stroke_width=3, color=ACC, buff=0.1
        )
        self.play(FadeIn(s_chip), FadeIn(s_lbl), run_time=0.6)
        self.play(GrowArrow(ext_arrow), run_time=0.8)
        self.wait(1.5)


# ─── B11_TheReallocation ─────────────────────────────────────────────────────
# Deliberate visual rhyme with B01_TwoCounters — SAME two numerals, SAME
# positions. This time effort tokens route through two ink gates into a terracotta
# row of evidenced roles BEFORE the clock hits its floor. The callback is the
# point: the reader sees B01's frame and reads a different outcome.
# ────────────────────────────────────────────────────────────────────────────
class B11_TheReallocation(Scene):
    def construct(self):
        self.camera.background_color = BG
        self.add(credit())

        # Re-establish B01's end-frame identically
        rule = Line(UP * 2.8, DOWN * 2.2, stroke_width=1, color=SOFT).set_opacity(0.35)
        self.add(rule)

        lbl_left = Text("APPLICATIONS SENT", font_size=17, color=SOFT, weight=BOLD, font='EB Garamond')
        lbl_left.shift(LEFT * 3.5 + UP * 2.8)
        lbl_right = Text("DAYS OF CLOCK LEFT", font_size=17, color=SOFT, weight=BOLD, font='EB Garamond')
        lbl_right.shift(RIGHT * 3.5 + UP * 2.8)
        self.add(lbl_left, lbl_right)

        n_left  = Integer(200, font_size=148, color=INK).move_to(LEFT  * 3.5 + UP * 0.2)
        n_right = Integer(31,  font_size=148, color=INK).move_to(RIGHT * 3.5 + UP * 0.2)
        self.play(FadeIn(n_left), FadeIn(n_right), run_time=0.6)

        # Rule served its callback purpose — fade before gate labels appear (avoids TEXT_ON_CURVE)
        self.play(rule.animate.set_opacity(0), run_time=0.3)

        # Effort stream routing: left counter → gate 1 → gate 2 → evidenced roles
        gate_y1, gate_y2 = 0.5, -0.5
        g1 = Rectangle(width=0.9, height=0.55, fill_color=WHITE, fill_opacity=0.9,
                        stroke_color=INK, stroke_width=2).move_to([0, gate_y1, 0])
        g1_lbl = Text("liveness", font_size=14, color=SOFT, font='EB Garamond').move_to(g1)
        g2 = Rectangle(width=0.9, height=0.55, fill_color=WHITE, fill_opacity=0.9,
                        stroke_color=INK, stroke_width=2).move_to([0, gate_y2, 0])
        g2_lbl = Text("sponsor",  font_size=14, color=SOFT, font='EB Garamond').move_to(g2)

        arr_in = Arrow(LEFT * 1.85 + UP * gate_y1, LEFT * 0.5 + UP * gate_y1,
                       stroke_width=2, color=INK, buff=0.08)
        arr_mid = Arrow([0.5, gate_y1, 0], [0.5, gate_y2 + 0.28, 0],
                        stroke_width=2, color=INK, buff=0.08)

        self.play(GrowArrow(arr_in), run_time=0.4)
        self.play(FadeIn(g1), FadeIn(g1_lbl), run_time=0.35)
        self.play(GrowArrow(arr_mid), run_time=0.3)
        self.play(FadeIn(g2), FadeIn(g2_lbl), run_time=0.35)

        # Evidenced roles arrive — arrow terracotta, label INK (passes §8.3 contrast)
        roles = Text("evidenced roles", font_size=26, color=INK, weight=BOLD, font='EB Garamond')
        roles.move_to([2.6, gate_y2, 0])
        arr_out = Arrow([0.5, gate_y2, 0], [1.5, gate_y2, 0],
                        stroke_width=2.5, color=ACC, buff=0.08)
        self.play(GrowArrow(arr_out), run_time=0.4)
        self.play(FadeIn(roles), run_time=0.6)

        # Clock stops short — stays INK (outcome change signalled by terracotta arrow above)
        self.play(n_right.animate.set_color(INK), run_time=0.5)
        self.wait(1.5)


# ─── BearsDoodlesVideo ───────────────────────────────────────────────────────
# Aggregate sentinel required by the static-scene hook (it looks for this class
# when no --class is given). Runs all per-beat constructs so the hook sees the
# full video's visual variety.
# ────────────────────────────────────────────────────────────────────────────
class BearsDoodlesVideo(Scene):
    def construct(self):
        for cls in [B01_TwoCounters, B04_TwoLetterGrades, B09_SelfAudit, B11_TheReallocation]:
            cls().construct()
