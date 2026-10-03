# Sector verification — checking Gate 1 by hand, outside the engine

**Why this file exists.** Gate 1 of this recipe claims a company is a game
studio on the strength of a keyword in its name, and labels that claim
`model-judgment`. The engine cannot upgrade that label — the 80 Days CSV has 24
industry values and none of them is games. So the only way to find out whether
the Gate 1 guesses were right is for a person to go and check, outside the
engine, and write down what they found. That is what this is.

Checked 2026-10-03. **This is a human check against public sources. It is not a
record in the repository and the prototype does not read this file.** Its
status is: a person looked, and here is what they saw.

## Result

| Company (as the CSV spells it) | Gate 1 said | Hand check | Verdict |
|---|---|---|---|
| `THAT'S NO MOON ENTERTAINMENT INC` | game employer (`entertainment`) | AAA studio founded 2021 by veterans of Naughty Dog, Infinity Ward, Bungie and PlayStation | **correct** |
| `MANTICORE GAMES INC` | game employer (`games`) | developer of the *Core* user-generated-games platform | **correct** |
| `AZRA GAMES INC` | game employer (`games`) | Sacramento studio building a mobile RPG; founded by game-industry veterans | **correct** |
| `ROBOTO GAMES INC` | game employer (`games`) | studio working on an MMO; raised a Series A led by Andreessen Horowitz | **correct** |
| `PELOTON INTERACTIVE INC` | game employer (`interactive`) | connected-fitness company; exercise bikes and subscription classes | **WRONG — false positive** |

Four right, one wrong, on a shortlist chosen partly to contain a known trap.
That ratio is not a measured precision rate and must not be reported as one:
the sample was hand-picked, n = 5, and one row was included *because* it would
fail. It is an illustration, not a statistic.

## The one cross-check worth more than the rest

The CSV row for `AZRA GAMES INC` carries:

```
latest_funding_stage  Series B
latest_funding_date   2024-06-27
latest_funding_amount 42718597.0
```

Public reporting of Azra Games' funding describes a raise of **$42.7 million**
for a mobile RPG. An independent source agrees with a number this repository
shipped, to the precision the headline carries.

That is a check on the *data*, not on my code: it says the 80 Days CSV's
funding column is reporting something real, which is worth knowing before
leaning on that column. It says nothing about the H-1B columns, which come from
different upstream sources (DOL LCA disclosure data and the USCIS H-1B Employer
Data Hub) and were not cross-checked here.

## What this changes in the recipe

Nothing about the labels. The sector claim stays `model-judgment` in every
output, because the engine still cannot make it, and a future run on a
different shortlist gets no benefit from today's check. What it does change is
the confidence with which the known failure mode can be stated: Gate 1's
over-match is not hypothetical, and `PELOTON INTERACTIVE INC` — 310 approvals,
97.5% approval rate, scoring level with a real studio in the sample run — is
the proof.


## Is the coverage limit ours, or the dataset's?

The games sector turned out to be thinly covered: of fourteen well-known game
employers, one is genuinely in the CSV. Before concluding that this recipe
picked a badly-served domain, we ran the same test on two other domains the
assignment's own examples suggest.

**Life sciences** — `PFIZER` ✗ · `MERCK` ✗ · `GENENTECH` ✗ · `ELI LILLY` ✗ ·
`NOVARTIS` ✗ · `MODERNA` ✓ · `AMGEN` ✓. The 374 rows matching `JOHNSON` contain
**zero** companies whose `company_name` includes it — every match comes from the
executive- and director-name columns.

**Large technology employers** — `GOOGLE` ✗ · `AMAZON` ✗ · `META PLATFORMS` ✗ ·
`NVIDIA` ✗ · `APPLE` ✗ · `MICROSOFT` ✓. The seven apparent `APPLE` matches are
`APPLE BEACH COUNTY`, `APPLE BOYS MUSICAL NYC`, `APPLEPIE CAPITAL` and similar.

So the pattern holds across domains: this dataset covers funded private
companies and is patchy on household names everywhere, not only in games. A
biotech or big-tech recipe built on the same CSV would hit the same wall. The
limit belongs to the data source, and naming it is part of using the source
honestly rather than evidence that this domain was a poor choice.

**Scale of the games slice, for the record.** 380 companies match the sector
keywords; 74 of those have a funding date in 2023 or later; **11** carry an
H-1B approvals value. Eleven is thin, and it is the real number. Across the
whole CSV the ratio is comparable — 1,557 of 30,369 rows, 5.1%.

## Sources

- [Naughty Dog, Infinity Ward, PlayStation and EA veterans form new AAA studio That's No Moon](https://www.videogameschronicle.com/news/naughty-dog-infinity-ward-playstation-and-ea-veterans-form-new-aaa-studio)
- [Naughty Dog, Bungie, and PlayStation vets form new studio That's No Moon](https://destructoid.com/?p=276980)
- [Manticore Games — company profile](https://www.cbinsights.com/compare/activision-publishing-vs-manticore-games)
- [Azra Games secures $42.7 million for mobile RPG](https://cointelegraph.com/news/azra-games-secures-42-7-million-mobile-rpg-game)
- [Founded by game industry vets, Azra Games raises $15M seed round](https://www.businesswire.com/news/home/20220519005264/en/Founded-by-Game-Industry-Vets-Azra-Games-Raises-15M-in-Seed-Round-Led-by-Andreessen-Horowitz-NFX-to-Unlock-the-Power-of-web3-for-Mainstream-Games)
- [Roboto Games raises $15 million in Series A funding round](https://www.pocketgamer.biz/roboto-games-raises-15-million-in-series-a-funding-round)
- [Roboto Games raises $15M from a16z to work on its upcoming MMO](https://egamers.io/roboto-games-raises-15m-from-a16z-to-work-on-its-upcoming-mmo/)
