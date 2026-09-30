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

## H-1B records shared with a differently named company — 69 companies

Each of these companies carries an H-1B record that appears value for value on another company with a different normalized name. A run holds any role at these companies until a person checks whose record it is.

| Row | Company | Same record on |
|---|---|---|
| 768 | ADVOCATE INC | row 772 ADVOCATES INC (Los Angeles, CA) |
| 772 | ADVOCATES INC | row 768 ADVOCATE INC (BROOKLYN, NY) |
| 1073 | AKERO THERAPEUTICS INC | row 14308 KEROS THERAPEUTICS INC (LEXINGTON, MA) |
| 1260 | ALLAY THERAPEUTICS INC | row 1313 ALLOY THERAPEUTICS INC (WALTHAM, MA); row 1325 ALLY THERAPEUTICS INC (CAMBRIDGE, MA) |
| 1269 | ALLENA PHARMACEUTICALS INC | row 19558 PALLEON PHARMACEUTICALS INC (WALTHAM, MA) |
| 1313 | ALLOY THERAPEUTICS INC | row 1260 ALLAY THERAPEUTICS INC (SAN JOSE, CA); row 1325 ALLY THERAPEUTICS INC (CAMBRIDGE, MA) |
| 1325 | ALLY THERAPEUTICS INC | row 1260 ALLAY THERAPEUTICS INC (SAN JOSE, CA); row 1313 ALLOY THERAPEUTICS INC (WALTHAM, MA) |
| 1780 | ANTERA THERAPEUTICS INC | row 2806 AVERNA THERAPEUTICS INC (WATERTOWN, MA) |
| 1985 | APRICUS BIOSCIENCES INC | row 2318 ASCUS BIOSCIENCES INC (San Diego, CA) |
| 2318 | ASCUS BIOSCIENCES INC | row 1985 APRICUS BIOSCIENCES INC (SAN DIEGO, CA) |
| 2806 | AVERNA THERAPEUTICS INC | row 1780 ANTERA THERAPEUTICS INC (BOSTON, MA) |
| 3045 | BANYAN INFRASTRUCTURE CORP | row 3062 BARKING LABS CORP (BROOKLYN, NY) |
| 3062 | BARKING LABS CORP | row 3045 BANYAN INFRASTRUCTURE CORP (SAN FRANCISCO, CA) |
| 3276 | BELFRY SOFTWARE INC | row 17436 MULTIPLIER INC (NEW YORK, NY) |
| 3348 | BERKELEY RESEARCH GROUP HOLDINGS LLC | row 3349 BERKELEY RESEARCH GROUP LLC (EMERYVILLE, CA) |
| 3349 | BERKELEY RESEARCH GROUP LLC | row 3348 BERKELEY RESEARCH GROUP HOLDINGS LLC (EMERYVILLE, CA) |
| 3749 | BLADE THERAPEUTICS INC | row 5681 CLADE THERAPEUTICS INC (CAMBRIDGE, MA) |
| 4962 | CAREDOX INC | row 4963 CAREDX INC (BRISBANE, CA) |
| 4963 | CAREDX INC | row 4962 CAREDOX INC (Forest Hills, NY) |
| 5681 | CLADE THERAPEUTICS INC | row 3749 BLADE THERAPEUTICS INC (SOUTH SAN FRANCISCO, CA) |
| 6472 | CONVEY INC | row 6655 COVEY INC (SAN FRANCISCO, CA) |
| 6655 | COVEY INC | row 6472 CONVEY INC (Austin, TX) |
| 7522 | DENVER TECHNOLOGIES INC | row 24375 SISU DATA INC (SAN FRANCISCO, CA) |
| 7586 | DEWPOINT THERAPEUTICS INC | row 28743 VIEWPOINT THERAPEUTICS INC (SAN FRANCISCO, CA) |
| 8442 | EIKON THERAPEUTICS INC | row 8550 ELION THERAPEUTICS INC (NEW YORK, NY) |
| 8550 | ELION THERAPEUTICS INC | row 8442 EIKON THERAPEUTICS INC (HAYWARD, CA) |
| 10869 | GENERATE CAPITAL INC | row 10870 GENERATE CAPITAL PBC (SAN FRANCISCO, CA) |
| 10870 | GENERATE CAPITAL PBC | row 10869 GENERATE CAPITAL INC (SAN FRANCISCO, CA) |
| 12950 | IMAGEN TECHNOLOGIES INC | row 15940 MAGE TECHNOLOGIES INC (SANTA CLARA, CA) |
| 13119 | INDIE TECHNOLOGIES INC | row 13127 INDIO TECHNOLOGIES INC (SAN FRANCISCO, CA) |
| 13127 | INDIO TECHNOLOGIES INC | row 13119 INDIE TECHNOLOGIES INC (SAN FRANCISCO, CA) |
| 13594 | INVISIBLE TECHNOLOGIES INC | row 28878 VISIBLE TECHNOLOGIES INC (BELLEVUE, WA) |
| 14308 | KEROS THERAPEUTICS INC | row 1073 AKERO THERAPEUTICS INC (South San Francisco, CA) |
| 14800 | LAMBDA INC | row 14804 LAMDA INC (BELLEVUE, WA) |
| 14804 | LAMDA INC | row 14800 LAMBDA INC (SAN FRANCISCO, CA) |
| 15132 | LEVEL HEALTH INC | row 15137 LEVELS HEALTH INC (NEW YORK, NY) |
| 15137 | LEVELS HEALTH INC | row 15132 LEVEL HEALTH INC (SAN FRANCISCO, CA) |
| 15835 | LYNDRA THERAPEUTICS INC | row 15844 LYRA THERAPEUTICS INC (Watertown, MA) |
| 15844 | LYRA THERAPEUTICS INC | row 15835 LYNDRA THERAPEUTICS INC (WATERTOWN, MA) |
| 15940 | MAGE TECHNOLOGIES INC | row 12950 IMAGEN TECHNOLOGIES INC (NEW YORK, NY) |
| 17136 | MOLECULA CORP | row 28551 VERDANT ROBOTICS INC (HAYWARD, CA) |
| 17370 | MPARTICLE INC | row 19707 PARTICLE INC (Seattle, WA) |
| 17436 | MULTIPLIER INC | row 3276 BELFRY SOFTWARE INC (NEW YORK, NY) |
| 18515 | NTOPOLOGY INC | row 27086 TOPOLOGY INC (NEW YORK, NY) |
| 19558 | PALLEON PHARMACEUTICALS INC | row 1269 ALLENA PHARMACEUTICALS INC (NEWTON, MA) |
| 19707 | PARTICLE INC | row 17370 MPARTICLE INC (NEW YORK, NY) |
| 19754 | PATHAI INC | row 19760 PATHRAI INC (MOUNTAIN VIEW, CA) |
| 19760 | PATHRAI INC | row 19754 PATHAI INC (CAMBRIDGE, MA) |
| 23952 | SHIFT TECHNOLOGIES INC | row 24024 SHYFT TECHNOLOGIES INC (SEATTLE, WA) |
| 24024 | SHYFT TECHNOLOGIES INC | row 23952 SHIFT TECHNOLOGIES INC (SAN FRANCISCO, CA) |
| 24290 | SIMPLE RULES CO | row 24295 SIMPLED RULES CO (SUNNYVALE, CA) |
| 24295 | SIMPLED RULES CO | row 24290 SIMPLE RULES CO (SUNNYVALE, CA) |
| 24375 | SISU DATA INC | row 7522 DENVER TECHNOLOGIES INC (NEW YORK, NY) |
| 25512 | STOKE THERAPEUTICS INC | row 25534 STORK THERAPEUTICS INC (SAN FRANCISCO, CA) |
| 25534 | STORK THERAPEUTICS INC | row 25512 STOKE THERAPEUTICS INC (Bedford, MA) |
| 25965 | SWING THERAPEUTICS INC | row 29616 WINGS THERAPEUTICS INC (BERKELEY, CA) |
| 27086 | TOPOLOGY INC | row 18515 NTOPOLOGY INC (NEW YORK, NY) |
| 27768 | TWIN HEALTH INC | row 27771 TWINE HEALTH INC (CAMBRIDGE, MA) |
| 27771 | TWINE HEALTH INC | row 27768 TWIN HEALTH INC (MOUNTAIN VIEW, CA) |
| 28551 | VERDANT ROBOTICS INC | row 17136 MOLECULA CORP (AUSTIN, TX) |
| 28679 | VIA TRANSPORATION INC | row 28680 VIA TRANSPORTATION INC (New York, NY) |
| 28680 | VIA TRANSPORTATION INC | row 28679 VIA TRANSPORATION INC (NEW YORK, NY) |
| 28743 | VIEWPOINT THERAPEUTICS INC | row 7586 DEWPOINT THERAPEUTICS INC (Boston, MA) |
| 28878 | VISIBLE TECHNOLOGIES INC | row 13594 INVISIBLE TECHNOLOGIES INC (SAN FRANCISCO, CA) |
| 28977 | VIVOSENS INC | row 28978 VIVOSENSE INC (NEWPORT COAST, CA) |
| 28978 | VIVOSENSE INC | row 28977 VIVOSENS INC (SAN FRANCISCO, CA) |
| 29616 | WINGS THERAPEUTICS INC | row 25965 SWING THERAPEUTICS INC (SAN FRANCISCO, CA) |
| 30110 | ZAPATA COMPUTING HOLDINGS INC | row 30111 ZAPATA COMPUTING INC (BOSTON, MA) |
| 30111 | ZAPATA COMPUTING INC | row 30110 ZAPATA COMPUTING HOLDINGS INC (BOSTON, MA) |

## Run record

- Rules: `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/rules.json` v0.2.0 (sha256 `96507d9f5a90…`)
- Sponsorship file: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` · sha256 `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270`
