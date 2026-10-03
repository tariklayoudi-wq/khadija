# خديجة — Khadija

Mercato della fattoria di Khouribga. Arabo (predefinito, RTL) e francese. I messaggi aprono WhatsApp `+212 704-221975`.

Sito pubblicato: https://khadija-khouribga.azurewebsites.net

Questo repository è il sorgente. Un'altra AI con Azure CLI sul PC può modificare i file e ripubblicare senza ricostruire il progetto a mano.

## Cosa modificare

| Pezzo | File |
|---|---|
| Annunci, prezzi, foto | `src/lib/catalog.ts` |
| Testi dell'interfaccia | `src/lib/l10n.ts` |
| Numero WhatsApp | `src/lib/whatsapp.ts` |
| Pagine | `src/routes/` |
| Scheda annuncio, menu | `src/components/` |
| Foto | `public/media/` |

Il contratto macchina è `deploy/azure.json`.

## Pubblicare con Azure CLI

Sul PC già connesso ad Azure (`tlayoudi@gmail.com`):

```powershell
git clone https://github.com/tariklayoudi-wq/khadija.git
cd khadija
powershell -ExecutionPolicy Bypass -File scripts/publish-azure.ps1
```

Lo script fa `npm ci`, poi `AZURE_BUILD=1 npx vite build` (sito statico con base `/`, non `/khadija/`), copia `deploy/web.config` e carica la cartella su App Service **F1** `khadija-khouribga` nel gruppo `khadija-francecentral` (Francia centrale). `westeurope` rifiuta i nuovi siti su questo abbonamento.

Non usare uno SKU a pagamento. Non cambiare il numero WhatsApp se non è richiesto.
