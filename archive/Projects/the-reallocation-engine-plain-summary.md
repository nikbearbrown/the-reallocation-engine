# The Reallocation Engine — Plain Language Summary

**For:** A smart person who does not write code and wants to understand what this system is, what it does, and why every feature exists.

---

## The problem in one paragraph

International students on F-1 and OPT visas are spending 8 hours a day applying to jobs. They apply to the same 500 well-known companies everyone else applies to. Most of those applications are rejected automatically by software before a human ever reads them. Many of the job postings they apply to are not real — companies post them to look like they are growing, with no intention of filling the role. The students have no time left for networking or building portfolio work — the two activities that actually result in jobs. And every random application to a company that will never sponsor a visa quietly damages their algorithmic score on platforms like Eightfold AI, making every future application slightly harder. They are not failing because they lack talent. They are failing because they are solving the wrong problem with the wrong strategy and no data.

---

## What The Reallocation Engine does

It is a personal AI-powered tool that runs on your computer through Claude Code — a conversational AI system that can read files, write files, and execute tasks. You tell it your situation. It tells you where to spend your time.

Specifically: it looks at a job posting and answers one question — **is this application worth sending?** Not "is this a good company" and not "am I qualified" but: given your visa status, your expiration date, this company's history of sponsoring visas, the probability this role is real, and how well your background matches — what is the actual probability that applying here results in a hire?

If the probability is high enough, it helps you apply well. If it is not, it tells you to skip — and reminds you to spend that time networking or building your portfolio instead.

That is the reallocation. Fewer applications. Better targeted. More time on the things that actually work.

---

## The five features and why each one exists

### 1. The Visa Timeline Manager
**What it does:** Tracks your OPT expiration date, your STEM OPT extension eligibility, and your H-1B lottery window. Flags any job whose hiring timeline would extend past your work authorization.

**Why it exists:** A student with 3 months of OPT remaining who applies to a company with a 4-month hiring process cannot accept the offer even if they get it. This happens constantly — not because students are careless but because no tool surfaces the conflict at the moment of decision. The Visa Timeline Manager makes the conflict visible before the application is sent, not after the offer arrives.

**The specific calculation:** Every role gets a visa timeline factor — a number between 0 and 1. If the expected start date is after your authorization expires, the factor is zero and the system recommends skip regardless of how good the fit is. If the timeline is compatible, the factor scales based on how much buffer you have.

---

### 2. The 80 Days Sponsorship Scorer
**What it does:** Queries a database built from three public U.S. government datasets — SEC Form D filings (which companies have raised money), Department of Labor LCA disclosure data (which companies have applied for work visas), and USCIS H-1B employer data (which companies' applications were approved vs. denied). It assigns every company a sponsorship tier: Proven, Likely, Unknown, or Avoid.

**Why it exists:** Students cannot see this information anywhere. LinkedIn does not show it. Indeed does not show it. The data exists in public government records but requires a data pipeline to make it usable. The 80 Days to Stay project — a Humanitarians AI initiative — built that pipeline. The Reallocation Engine plugs into it.

**The insight it surfaces:** There are thousands of funded startups and small labs — many in Boston biotech, many in AI — that have money, need talent, and have a documented history of sponsoring visas. They are invisible to students who only look at brand-name employers. The sponsorship scorer makes them visible and rankable.

**The scoring math:** The system combines LCA filing rate (40% weight), H-1B approval rate (30% weight), funding recency from SEC data (20% weight), and company size signals (10% weight) into a single probability. A company with 12 LCA filings in 3 years and an 85% H-1B approval rate scores very differently from a famous tech company that has never filed an LCA.

---

### 3. The Bayesian Role Scorer
**What it does:** Combines four probability estimates into a single composite score for each job posting: probability the company sponsors (from the Sponsorship Scorer), probability you are a fit (from comparing your CV to the job description), probability the role is real and currently being filled, and the visa timeline factor. Produces an Apply, Consider, or Skip recommendation.

**Why it exists:** Students make application decisions based on brand recognition and gut feel. "Google is a great company so I should apply" — but Google has a 0% historical sponsorship rate and the role requires skills the student does not have. "This small biotech in Cambridge sounds risky" — but it has 15 LCA filings and the job description matches the student's thesis work exactly. The Bayesian scorer replaces gut feel with math.

**The key design decision:** Sponsorship probability is weighted at 35% — the highest single factor. This is higher than fit, higher than liveness, higher than timeline. The reasoning: a perfect-fit application to a company that will never sponsor is worth exactly zero. The constraint unique to international students dominates the score.

**What it catches:** Ghost jobs — postings companies maintain with no intention of filling. The system estimates role liveness from signals like posting age, application volume indicators, and ATS patterns. A role posted 6 weeks ago with no updates scores lower on liveness. A role at a company that just raised a Series B and posted the role last week scores higher.

---

### 4. The OPT Framing Generator
**What it does:** Generates application materials — professional summary, cover letter — with visa-aware language calibrated to what the specific employer actually knows about OPT.

**Why it exists:** Most employers misunderstand OPT. They think it requires immediate visa sponsorship, costs them money, and creates legal risk. None of this is true during the OPT and STEM OPT window. Students on F-1 OPT are already authorized to work. Employers do not need to do anything for 1 to 3 years. Students on OPT are actually FICA-exempt — meaning the employer saves approximately 7.65% in payroll taxes compared to a domestic hire. But students do not know how to communicate this without sounding defensive, and most do not know they should communicate it at all.

**How framing changes by tier:**

For companies with a Proven sponsorship history — they already know how OPT works. Mention it directly. State the authorization date clearly. They will not be confused.

For companies likely to sponsor — lead with work authorization, not visa type. Frame the FICA savings as a concrete employer benefit. Do not use the acronym OPT unless they ask.

For companies with Unknown sponsorship history — do not mention OPT or visa status in initial written materials at all. These employers may have an automatic negative reaction to any visa mention before they have evaluated the candidate. Focus entirely on fit and proof. Visa framing happens in the interview, not the application.

For companies in the Avoid tier — the system has already recommended skip. No materials are generated.

**What it never does:** Fabricate credentials, invent metrics, or misrepresent the student's actual authorization status. Framing is accurate information presented strategically — not spin.

---

### 5. The Pipeline Tracker
**What it does:** Logs every application decision — including skips — with the composite score, sponsorship tier, visa timeline flag, and outcome. Produces a daily allocation summary showing how many applications were sent, what the skip rate was, and a reminder of how much time remains for networking and portfolio work.

**Why it exists:** Without a tracker, students have no feedback loop. They do not know their response rate. They do not know whether the applications they sent to Proven-tier companies perform better than applications to Unknown-tier companies. They cannot see whether they are holding to the 3-3-2 time allocation or drifting back to 8 hours of clicking.

**The specific metric it watches:** Skip rate. The system targets a skip rate of 50% or higher — meaning the student skips at least as many roles as they apply to. This sounds counterintuitive. It is the reallocation principle made concrete: if you are applying to everything the system evaluates, the system is not filtering aggressively enough and you are back to spray-and-pray. A high skip rate is evidence the system is working.

---

## The reallocation target

The system is built around one daily allocation:

**2 hours** on applications — using The Reallocation Engine to find, score, and send high-probability targeted applications.

**3 hours** on networking — informational interviews, alumni outreach, building relationships with people at target companies. Referred candidates are 4 to 10 times more likely to be hired than cold applicants. 54% of all hires come through connections. This is where the majority of hiring actually happens.

**3 hours** on portfolio — building proof of competence. Deployed projects, quantified results, documented work. Workers with validated AI skills command a 56% wage premium. The portfolio is what makes networking conversations lead to offers rather than polite dead ends.

The Reallocation Engine compresses the "2" so aggressively — through sponsorship filtering, Bayesian scoring, and ghost-job detection — that the 3+3 becomes possible. That is the whole purpose. A tool that makes applying faster without improving targeting has missed the point entirely.

---

## What The Reallocation Engine does not do

It does not submit applications. It stops before every send and requires the student to review and confirm. This is not a safety feature added as an afterthought. It is architecture. The student's judgment about their own application is irreplaceable — the system cannot know that a recruiter they met at a conference works at this company, or that they heard the role is being expanded, or that the job description undersells the actual work. The human gate is where that knowledge enters.

It does not predict whether a student will get a visa. It estimates the probability that a company has historically been willing to sponsor. Past behavior does not guarantee future decisions.

It does not replace networking or portfolio work. It creates space for them.

It does not work well if the student uses it for 8 hours a day. That is the wrong usage. The onboarding sequence tells every student explicitly: if you are spending more than 2 hours a day in this system, the system is failing its core purpose.

---

## Who built the underlying data

The sponsorship data comes from three sources, all public and free:

**SEC Form D filings** — companies must file with the SEC when they raise private capital. This tells the system which companies are funded and recently so.

**DOL LCA Disclosure Data** — every time a company applies for an H-1B, H-1B1, or E-3 visa for an employee, it files a Labor Condition Application with the Department of Labor. This data is public and released quarterly. It shows exactly which companies have a history of hiring and sponsoring international workers.

**USCIS H-1B Employer Data Hub** — the U.S. immigration agency publishes approval and denial rates by employer. A company that files many LCAs but has a high denial rate is a very different signal from a company with the same filing count and a high approval rate.

The 80 Days to Stay project — led by Nik Bear Brown through Humanitarians AI — built the pipeline that merges these three sources into a usable database. The Reallocation Engine is a consumer of that database.

---

## The student's role

The Reallocation Engine does not think for the student. It does the math. The student does the judgment.

Specifically: the student decides what their Bayesian weights should be given their actual visa situation. If they have 2 months of OPT remaining, visa timeline should be weighted more heavily than the default. If they have a strong referral network, the referral override should be set aggressively. These are decisions that require knowing your own situation — and the system makes them explicit rather than hiding them in defaults.

The student also decides when to override the system's recommendation. The system says skip. The student knows the hiring manager through a mutual connection. They apply anyway. That is the right use of judgment. What the system prevents is the opposite — applying to everything because skipping feels like giving up.

---

*The Reallocation Engine — Humanitarians AI / Irreducibly Human Curriculum*
*Plain language summary v0.1*
