# BLS/O*NET Source Audit

**Generated at:** 2026-05-28T22:53:31.964986+00:00
**Source directory:** `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/data/BLS`

## Role in The Reallocation Engine

Treat `data/BLS` as source/reference data for the role-quality and labor-market-direction side of the engine.
It supports SOC/O*NET occupation mapping, cognitive demand features, wage/employment context, and the broader Cognitive Pivot argument.

## Inventory

- Files: 253
- Directories: 21
- O*NET text tables: 42
- Latest OEWS national workbook used: `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/data/BLS/oesm24nat/national_M2024_dl.xlsx`
- Latest OEWS year: 2024

## Compact Extract

- Output: `/Users/bear/Documents/CoWork/bear-textbooks/books/the-reallocation-engine/data/BLS/compact/soc_occupation_compact.csv`
- SHA-256: `bac5acf77ca2d25268c75b3706084f7f67bcc0c6e3cc68cd03e0ebd2598343d1`
- Occupations: 1,016
- Occupations matched to latest OEWS detailed SOC rows: 962 (94.7%)

## Compact Columns

- Occupation identity: O*NET-SOC code, BLS SOC code, title, description.
- Job preparation: O*NET job zone.
- Search support: alternate title count and sample alternate titles.
- Labor market context: latest OEWS employment, mean/median wage, hourly wage, PRSE.
- Cognitive demand features: selected O*NET ability and skill Level scores.
- `cognitive_pivot_score`: average of selected reasoning, judgment, and systems scores.

## Large Files

| File | Size |
|---|---:|
| `db_30_2_mssql/20_work_context.sql` | 91.0 MB |
| `db_30_2_mysql/20_work_context.sql` | 91.0 MB |

## Source Files Used

| File | SHA-256 |
|---|---|
| `db_30_2_text/Occupation Data.txt` | `63e6029d3d30ff5c7cf39b5304a733b77a409e01c65ae7095fe92f6d18d74a66` |
| `db_30_2_text/Abilities.txt` | `822f866b0f441376edc8a282bf0f77c8c3f687c456dcd607b12de86fccba8e71` |
| `db_30_2_text/Skills.txt` | `d6832c9c195742524a9e48598d962140aaa499c2f78046d4be3af0b69f2686be` |
| `db_30_2_text/Alternate Titles.txt` | `909a8bf1c7c36931398090faeb4fb14ae58e156c960596f6031ee1eabca758f4` |
| `db_30_2_text/Job Zones.txt` | `004acd60c0a96fb69be615f889d02a79036ebd025e5265a36945741b92807989` |
| `oesm24nat/national_M2024_dl.xlsx` | `a9bad3093703e28d7490cedb765b6730f4eaa4b37a7c8f68e866814167761f11` |

## Notes

- The MySQL and MSSQL O*NET SQL exports duplicate most of the text/Excel source data and include two ~91 MB `20_work_context.sql` files.
- The compact table is the preferred working asset for downstream scoring; keep the full BLS/O*NET archive as provenance.
- The current extract does not estimate employment trend slopes yet. That should be a separate step using the 2012-2024 OEWS national files.
