# Webforensik — автоматичний перескан

Workflow `.github/workflows/webforensik-scan.yml` раз на 15 хв бере **перший** домен з `queue.txt`,
сканує на webforensik.de і дописує рядок у `results.tsv` (час Київ · домен · scan_id · бал),
повний звіт — у `reports/json/<scan_id>.json`. Просканований домен зникає з черги; при 429 (ліміт) лишається.

- Додати домени: відредагувати `queue.txt` (по одному на рядок).
- Запустити зараз: Actions → Webforensik Scan → Run workflow.
- Зупинити: Actions → Webforensik Scan → ⋯ → Disable workflow.
- Звіт на сайті: https://webforensik.de/results.php?id=<scan_id>&lang=de
