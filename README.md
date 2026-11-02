# Generatore Cartellini A6

Piccola web app per creare cartellini A6 stampabili partendo da un file Excel.

Funziona direttamente nel browser: carichi l'Excel, scegli il negozio, controlli
l'anteprima e poi generi il file HTML da stampare o scaricare. Non serve un
server e i file Excel restano sul computer: vengono letti solo dal browser.

## Aprire l'app

Versione online:

```text
https://killato122.github.io/Generatore-Cartellini-a6/
```

Versione locale:

```text
webapp/index.html
```

## Cosa fa

- legge file Excel in formato `.xlsx` o `.xls`
- crea cartellini A6 con titolo, varianti e prezzi
- permette di scegliere il negozio: Volta, Piave o Belfiore
- applica automaticamente il bollino del negozio scelto
- supporta i cartellini saldi
- supporta il bollino Black Friday attivabile dalle opzioni
- mostra l'anteprima prima della stampa
- permette anche l'inserimento manuale senza Excel

## Filtro giacenza

Se l'Excel contiene le colonne `Inventory Available`, l'app filtra i cartellini
in base al negozio selezionato.

Esempio: se scegli `Belfiore`, viene usata la colonna di giacenza Belfiore. Un
prodotto viene stampato se almeno una sua variante ha quantita `1` o superiore.
Se tutte le varianti del prodotto sono a `0`, il cartellino viene escluso.

Dopo il caricamento dell'Excel viene mostrata anche la colonna giacenza usata e
la lista dei prodotti esclusi. La lista puo' essere scaricata in formato `.txt`.

## Pubblicazione su GitHub Pages

Se stai caricando i file manualmente da questo PC:

1. apri la cartella `DA_CARICARE_GITHUB_PAGES`
2. carica nella repository tutto quello che trovi dentro, non la cartella intera
3. vai su `Settings > Pages`
4. scegli `Deploy from a branch`
5. seleziona branch `main` e cartella `/(root)`
6. salva e aspetta qualche minuto

Quando GitHub Pages ha finito, l'app sara' disponibile all'indirizzo:

```text
https://killato122.github.io/Generatore-Cartellini-a6/
```

## File principali

- `index.html` apre automaticamente la web app
- `webapp/index.html` contiene l'interfaccia
- `webapp/app.js` contiene la logica
- `webapp/styles.css` contiene lo stile
- `assets/images/` contiene loghi e bollini
- `webapp/vendor/xlsx.full.min.js` permette di leggere gli Excel nel browser
