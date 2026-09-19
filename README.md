# Voorraadwebshop

Een full-stack voorraadbeheer- en orderadministratiesysteem, gebouwd om end-to-end .NET- en React-vaardigheden te demonstreren: van database-ontwerp tot een werkende frontend.

## Functionaliteit

- **Producten beheren** met twee polymorfe types: fysieke producten (met gewicht en voorraad) en digitale producten (met downloadlink en bestandsgrootte)
- **Klanten beheren** — aanmaken, bekijken, verwijderen
- **Orders plaatsen** met meerdere productregels tegelijk, inclusief automatische voorraadcontrole en -afboeking
- **Orderstatus bijwerken** (In behandeling → Verzonden → Afgeleverd → Geannuleerd)
- Duidelijke foutafhandeling op elke laag (validatie, voorraadconflicten, niet-bestaande relaties)

## Tech stack

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core met SQL Server
- Gelaagde architectuur: `Api` → `Core` (domeinmodellen, interfaces, services) → `Infrastructure` (EF Core, repositories)
- Unit tests met xUnit en Moq

**Frontend**
- React (met Vite)
- Communiceert met de backend via een REST API

## Architectuur

Het project is opgedeeld in vier .NET-projecten binnen één solution:

| Project | Verantwoordelijkheid |
|---|---|
| `VoorraadWebshop.Api` | Controllers, endpoints, dependency injection setup |
| `VoorraadWebshop.Core` | Domeinmodellen, interfaces, services (businesslogica), DTO's |
| `VoorraadWebshop.Infrastructure` | Entity Framework Core, database-context, repositories |
| `VoorraadWebshop.Tests` | Unit tests voor de businesslogica |

Deze scheiding volgt het principe van Dependency Inversion: `Core` kent geen afhankelijkheid van EF Core of de database, en communiceert alleen via interfaces (`IProductRepository`, `IOrderRepository`, etc.), waardoor de businesslogica volledig testbaar is zonder een echte database.

### Object-georiënteerd ontwerp

`Product` is een abstracte basisklasse met twee afgeleide types:
- `FysiekProduct` (gewicht, voorraadaantal)
- `DigitaalProduct` (downloadlink, bestandsgrootte)

Dit wordt in de database opgeslagen via Table-Per-Hierarchy (één tabel met een discriminator-kolom), en in de API correct afgehandeld via polymorfe JSON-serialisatie (`System.Text.Json`'s `JsonPolymorphic`-attributen).

### Businesslogica-highlight: order plaatsen

Bij het plaatsen van een order (`OrderService.PlaatsOrderAsync`):
1. Wordt gecontroleerd of elk product bestaat
2. Wordt voor fysieke producten de voorraad gecontroleerd — bij onvoldoende voorraad wordt de order geweigerd met een `409 Conflict`
3. Wordt de huidige productprijs "bevroren" in de orderregel (zodat latere prijswijzigingen bestaande orders niet beïnvloeden)
4. Wordt de voorraad automatisch afgeboekt

Deze logica is afgedekt met unit tests (`VoorraadWebshop.Tests`).

## Lokaal draaien

**Vereisten:** .NET SDK 10, Node.js, SQL Server (Express is voldoende)

**Backend:**
```bash
cd VoorraadWebshop.Api
dotnet ef database update --project ../VoorraadWebshop.Infrastructure --startup-project .
dotnet run
```
De API draait op `http://localhost:5070`, met Swagger-documentatie op `/swagger`.

**Frontend:**
```bash
cd VoorraadWebshop.Client
npm install
npm run dev
```
De frontend draait op `http://localhost:5173`.

**Tests draaien:**
```bash
cd VoorraadWebshop.Tests
dotnet test
```

## Ontwerpkeuzes

- **Domeinmodellen in het Nederlands** — bewuste keuze omdat de applicatie gericht is op een Nederlandse gebruikersgroep; een veelvoorkomende praktijk bij Nederlandse bedrijven.
- **Cascade delete op Order → Klant** — het verwijderen van een klant verwijdert ook diens orders, wat functioneel gewenst gedrag is voor dit domein.

## Mogelijke uitbreidingen

- Authenticatie en autorisatie (rollen voor beheerders vs. klanten)
- Paginering op de product- en orderlijsten
- Meer geavanceerde rapportages (omzet per periode, voorraadwaarschuwingen)