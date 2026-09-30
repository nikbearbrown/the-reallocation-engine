# Title-rules audit — rules v0.2.0

## Executive summary

This audit shows what the declared title rules do to every company in the sponsorship file: how many companies land in each tier, and every sponsored title the rules counted as ML/AI. It is for a person to read before trusting the rules. It says what the rules found; it does not say the rules are right.

Of 30369 companies, 28817 have no usable H-1B record, and 1552 were tiered. 21 distinct ML/AI titles carry no seniority or level marker, so they count as role-level evidence. Read that list first: any title in it that is not an ML/AI engineering job, or not an entry-level one, is a rule to fix.

## Tiers

| Tier | Companies |
|---|---|
| Likely (marked-only) | 47 |
| Likely (no-role-family-title) | 1460 |
| Likely (thin-record) | 18 |
| Proven (role-level match) | 27 |
| held: no-approvals-on-record | 5 |
| held: no-h1b-record | 28812 |

## ML/AI titles with no seniority or level marker (these create Proven) — 21

| Title | Companies | Matched by |
|---|---|---|
| AI Design Engineer | 1 | \bai\b |
| AI PERFORMANCE ENGINEER | 1 | \bai\b |
| AI Research Engineer | 1 | \bai\b |
| AI TOOLS ENGINEER | 1 | \bai\b |
| AI/DS Engineer | 1 | \bai\b |
| Computer Vision Engineer | 4 | \bcomputer vision\b |
| Computer Vision and Machine Learning Research Engineer | 1 | \bmachine learning\b, \bcomputer vision\b |
| Data Scientist, Machine Learning | 1 | \bmachine learning\b |
| Deep Learning Engineer | 3 | \bdeep learning\b |
| Engineer, Data and Machine Learning | 1 | \bmachine learning\b |
| ML Platform Engineer | 1 | \bml\b |
| Machine Learning Engineer | 21 | \bmachine learning\b |
| Machine Learning Engineer / AI Scientist | 1 | \bmachine learning\b, \bai\b |
| Machine Learning Systems Engineer | 1 | \bmachine learning\b |
| NLP Engineer | 1 | \bnlp\b |
| NLP Scientist | 1 | \bnlp\b |
| Robotics and Machine Learning Engineer | 1 | \bmachine learning\b |
| Software Engineer - Data & Machine Learning | 1 | \bmachine learning\b |
| Software Engineer - Machine Learning | 1 | \bmachine learning\b |
| Software Engineer - Perception ML | 1 | \bml\b |
| Software Engineer, Machine Learning | 2 | \bmachine learning\b |

## ML/AI titles with a level marker — 3

| Title | Companies | Matched by |
|---|---|---|
| Machine Learning Engineer (L2) | 1 | \bmachine learning\b, \bl2\b |
| Machine Learning Engineer II | 4 | \bmachine learning\b, \bii\b |
| Machine Learning Operations Engineer II | 1 | \bmachine learning\b, \bii\b |

## ML/AI titles with a seniority marker — 32

| Title | Companies | Matched by |
|---|---|---|
| AI Engineering Lead | 1 | \bai\b, \blead\b |
| Director of AI | 1 | \bai\b, \bdirector\b |
| Engineering Manager, Machine Learning Systems | 1 | \bmachine learning\b, \bmanager\b |
| Founding ML Engineer | 1 | \bml\b, \bfounding\b |
| Lead Machine Learning Engineer | 1 | \bmachine learning\b, \blead\b |
| Lead Software Engineer - Machine Learning | 1 | \bmachine learning\b, \blead\b |
| Machine Learning Engineer III | 3 | \bmachine learning\b, \biii\b |
| Principal Machine Learning Engineer - Personalization | 1 | \bmachine learning\b, \bprincipal\b |
| SENIOR COMPUTER VISION RESEARCH ENGINEER | 1 | \bcomputer vision\b, \bsenior\b |
| SENIOR MACHINE LEARNING ENGINEER | 1 | \bmachine learning\b, \bsenior\b |
| Senior Computer Vision Scientist | 1 | \bcomputer vision\b, \bsenior\b |
| Senior Machine Learning DevOps Engineer | 1 | \bmachine learning\b, \bsenior\b |
| Senior Machine Learning Engineer | 16 | \bmachine learning\b, \bsenior\b |
| Senior Machine Learning Engineer I | 1 | \bmachine learning\b, \bsenior\b |
| Senior Machine Learning Scientist | 1 | \bmachine learning\b, \bsenior\b |
| Senior Machine Learning Software Engineer | 1 | \bmachine learning\b, \bsenior\b |
| Senior NLP Data Scientist | 1 | \bnlp\b, \bsenior\b |
| Senior NLP Engineer | 1 | \bnlp\b, \bsenior\b |
| Senior NLP Research Scientist | 1 | \bnlp\b, \bsenior\b |
| Senior Security Machine Learning Researcher | 1 | \bmachine learning\b, \bsenior\b |
| Senior Software Engineer (AI Platform) | 1 | \bai\b, \bsenior\b |
| Senior Software Engineer - AI/Algo | 1 | \bai\b, \bsenior\b |
| Senior Software Engineer - Machine Learning | 1 | \bmachine learning\b, \bsenior\b |
| Senior Software Engineer I, Machine Learning | 1 | \bmachine learning\b, \bsenior\b |
| Senior Software Engineer – Machine Learning Data Infrastruct | 1 | \bmachine learning\b, \bsenior\b |
| Sr. Machine Learning Engineer | 1 | \bmachine learning\b, \bsr\b |
| Sr. Software Engineer, Machine Learning | 1 | \bmachine learning\b, \bsr\b |
| Staff AI/ML Data Engineer | 1 | \bml\b, \bai\b, \bstaff\b |
| Staff Backend Engineer, ML Operations | 1 | \bml\b, \bstaff\b |
| Staff Data Scientist, Machine Learning Analytics | 1 | \bmachine learning\b, \bstaff\b |
| Staff Machine Learning Engineer | 2 | \bmachine learning\b, \bstaff\b |
| Staff Software Engineer - Machine Learning | 1 | \bmachine learning\b, \bstaff\b |

## Titles an ML/AI pattern touched but an exclusion removed — 6

| Title | Companies | Matched by |
|---|---|---|
| AI DEVELOPER ADVOCATE | 1 | \bai\b, \badvocate\b |
| AI Success Manager | 1 | \bai\b, \bsuccess\b, \bmanager\b |
| Enterprise Business Operations Manager - AI | 1 | \bai\b, \bbusiness\b, \bmanager\b |
| Information Systems Manager, Machine Learning | 2 | \bmachine learning\b, \binformation systems\b, \bmanager\b |
| Principal Product Manager - Machine Learning | 1 | \bmachine learning\b, \bproduct manager\b, \bprincipal\b, \bmanager\b |
| Principal Product Manager – Machine Learning | 1 | \bmachine learning\b, \bproduct manager\b, \bprincipal\b, \bmanager\b |

## Run record

- Rules: `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/rules.json` v0.2.0 (sha256 `96507d9f5a90…`)
- Sponsorship file: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` · sha256 `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270`
