# Web app

Questa cartella contiene la parte che gira nel browser.

Apri `index.html`, carica un Excel e scegli il negozio. L'app prepara i
cartellini A6, mostra l'anteprima e permette di stampare o scaricare l'HTML.
Tra le opzioni sono disponibili sia i cartellini saldi sia il bollino Black Friday.

La lettura degli Excel e' fatta con la libreria locale `vendor/xlsx.full.min.js`,
quindi non serve installare nulla e non viene caricato nessun file su server
esterni.

## Excel

Le colonne principali sono:

- `Title`
- `Option1 Value`
- `Option2 Value`
- `Option3 Value`
- `Variant Price`
- `Variant Compare At Price`

Se sono presenti colonne `Inventory Available`, il programma usa quella del
negozio selezionato per decidere quali prodotti stampare.

## Giacenze

Per Volta, Piave e Belfiore il cartellino viene stampato solo se almeno una
variante del prodotto ha giacenza `1` o superiore nel negozio scelto.

I prodotti esclusi vengono mostrati nella pagina e possono essere scaricati in
un file `.txt`.
