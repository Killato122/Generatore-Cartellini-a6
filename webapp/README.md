# Webapp Cartellini A6

Questa cartella contiene una prima versione statica del generatore.
Funziona nel browser e usa SheetJS locale per leggere file Excel.
In alternativa puoi usare la modalita manuale per compilare uno o piu
cartellini A6 con titolo, varianti e prezzi.

## Prova locale

Apri `webapp/index.html` nel browser, carica un Excel e premi
`Genera HTML`. Per creare cartellini senza Excel, passa a `Manuale`,
inserisci uno o piu cartellini con titolo e prezzi, poi genera o stampa.

## Pubblicazione GitHub Pages

Opzione semplice:

1. Metti il repository su GitHub.
2. Vai in `Settings > Pages`.
3. Seleziona `Deploy from a branch`.
4. Scegli il branch e la cartella `/`.
5. Apri l'URL GitHub Pages e vai a `/webapp/`.

Se vuoi che la webapp sia direttamente nella root del sito Pages, puoi
spostare questi file in una cartella `docs/` e selezionare `/docs` come
sorgente Pages.

## Note

- I file Excel vengono letti nel browser.
- L'output e' HTML A6 stampabile, come nella versione Python.
- La modalita manuale crea uno o piu cartellini, ciascuno con una o piu varianti.
- Il menu `Negozio` imposta automaticamente il bollino destro.
  La scelta negozio e' mostrata come pulsanti grandi per ridurre errori.
- Il toggle `Cartellino saldi` usa i bollini saldi disponibili.
  Per `Iconico + Saldi` viene usato un bollino saldi disponibile come fallback,
  perche' non c'e' ancora un asset saldi Iconico dedicato.
- `Nuovo lavoro` pulisce file, manuale, anteprima e HTML generato, ma mantiene
  negozio, saldi e logo.
- L'anteprima e' navigabile con precedente/successivo.
- Puoi cercare un prodotto nell'anteprima con il campo `Cerca prodotto`.
- In modalita manuale i campi errati vengono evidenziati in rosso.
- Dopo una modifica, `Stampa` e `Scarica` restano disabilitati finche'
  non premi di nuovo `Genera HTML`.
- Dopo il caricamento Excel viene mostrato un riepilogo con prodotti,
  varianti, righe lette e righe ignorate.
- Il logo sinistro `logo_lisolastore.png` e i bollini destri possono essere scelti dagli asset
  inclusi in `assets/images/`, oppure caricati manualmente dalla pagina.
- La libreria Excel e' inclusa in `webapp/vendor/xlsx.full.min.js`.

## Aggiungere altri preset immagine

Per aggiungere un nuovo logo o bollino fisso:

1. Metti il file immagine in `assets/images/`.
2. Aggiungi una voce in `BUILT_IN_IMAGES` dentro `webapp/app.js`.
3. Imposta `kind: "logo"` per il logo sinistro oppure `kind: "badge"`
   per i bollini.
