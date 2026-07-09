# Generatore cartellini A6

## Versione web

La versione web e' in `webapp/` ed e' una app statica: non richiede backend
o build. `index.html` nella root reindirizza automaticamente a `webapp/`, cosi
GitHub Pages puo' aprire l'app direttamente dalla root del sito.

Per provarla in locale, apri:

```text
webapp/index.html
```

Oppure, dopo la pubblicazione con GitHub Pages:

```text
https://killato122.github.io/Generatore-Cartellini-a6/
```

## Pubblicazione GitHub Pages

1. Pusha il repository su GitHub.
2. Apri `Settings > Pages` nella repository GitHub.
3. In `Build and deployment`, scegli `Deploy from a branch`.
4. Seleziona il branch `main` e la cartella `/(root)`.
5. Salva. La pubblicazione puo' richiedere qualche minuto.

## File da usare

Avviare:

```powershell
python genera_cartellini.py
```

Questo file e' un launcher. Il codice principale dell'applicazione e' in:

```text
src/generatore_cartellini.py
```

Le immagini sono in `assets/images/`, le immagini saldi in
`assets/images/saldi/`, e i file Excel di esempio/input in `data/`.

## Build eseguibile

Per ricreare l'eseguibile con PyInstaller:

```powershell
pyinstaller GeneraCartellini.spec
```

Le cartelle `build/`, `dist/`, `.venv/`, `__pycache__/` e
`cartellini_A6_output/` sono ignorate da Git perche' sono ambiente locale
o output rigenerabili.
