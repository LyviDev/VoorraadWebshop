import { useState } from 'react';

function ProductForm({ onProductToegevoegd }) {
    const [type, setType] = useState('fysiek');
    const [naam, setNaam] = useState('');
    const [beschrijving, setBeschrijving] = useState('');
    const [prijs, setPrijs] = useState('');
    const [categorieId, setCategorieId] = useState('');
    const [gewichtInKg, setGewichtInKg] = useState('');
    const [voorraadAantal, setVoorraadAantal] = useState('');
    const [downloadLink, setDownloadLink] = useState('');
    const [bestandsGrootteInMb, setBestandsGrootteInMb] = useState('');
    const [versturen, setVersturen] = useState(false);
    const [foutmelding, setFoutmelding] = useState(null);

    function resetVelden() {
        setNaam('');
        setBeschrijving('');
        setPrijs('');
        setCategorieId('');
        setGewichtInKg('');
        setVoorraadAantal('');
        setDownloadLink('');
        setBestandsGrootteInMb('');
    }

    function handleSubmit(event) {
        event.preventDefault();
        setVersturen(true);
        setFoutmelding(null);

        const basisProduct = {
            type,
            naam,
            beschrijving,
            prijs: parseFloat(prijs),
            categorieId: parseInt(categorieId),
        };

        const nieuwProduct =
            type === 'fysiek'
                ? {
                    ...basisProduct,
                    gewichtInKg: parseFloat(gewichtInKg),
                    voorraadAantal: parseInt(voorraadAantal),
                }
                : {
                    ...basisProduct,
                    downloadLink,
                    bestandsGrootteInMb: parseInt(bestandsGrootteInMb),
                };

        fetch('http://localhost:5070/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nieuwProduct),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const foutTekst = await response.text();
                    throw new Error(foutTekst || 'Product kon niet worden toegevoegd.');
                }
                return response.json();
            })
            .then(() => {
                resetVelden();
                onProductToegevoegd();
            })
            .catch((error) => setFoutmelding(error.message))
            .finally(() => setVersturen(false));
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Nieuw product toevoegen</h2>

            <div className="veld-groep">
                <label>Type product:</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="fysiek">Fysiek</option>
                    <option value="digitaal">Digitaal</option>
                </select>
            </div>

            <div className="veld-groep">
                <label>Naam:</label>
                <input value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Bijv. Koffiebonen 1kg" required />
            </div>

            <div className="veld-groep">
                <label>Beschrijving:</label>
                <input value={beschrijving} onChange={(e) => setBeschrijving(e.target.value)} placeholder="Bijv. Donkere branding, biologisch" required />
            </div>

            <div className="veld-groep">
                <label>Prijs:</label>
                <input type="number" step="0.01" min="0" value={prijs} onChange={(e) => setPrijs(e.target.value)} placeholder="Bijv. 12.50" required />
            </div>

            <div className="veld-groep">
                <label>Categorie ID:</label>
                <input type="number" min="1" value={categorieId} onChange={(e) => setCategorieId(e.target.value)} placeholder="Bijv. 1" required />
            </div>

            {type === 'fysiek' ? (
                <>
                    <div className="veld-groep">
                        <label>Gewicht (kg):</label>
                        <input type="number" step="0.1" min="0" value={gewichtInKg} onChange={(e) => setGewichtInKg(e.target.value)} placeholder="Bijv. 1.0" required />
                    </div>
                    <div className="veld-groep">
                        <label>Voorraad:</label>
                        <input type="number" min="0" value={voorraadAantal} onChange={(e) => setVoorraadAantal(e.target.value)} placeholder="Bijv. 50" required />
                    </div>
                </>
            ) : (
                <>
                    <div className="veld-groep">
                        <label>Downloadlink:</label>
                        <input type="url" value={downloadLink} onChange={(e) => setDownloadLink(e.target.value)} placeholder="https://voorbeeld.nl/bestand.pdf" required />
                    </div>
                    <div className="veld-groep">
                        <label>Bestandsgrootte (MB):</label>
                        <input type="number" min="0" value={bestandsGrootteInMb} onChange={(e) => setBestandsGrootteInMb(e.target.value)} placeholder="Bijv. 15" required />
                    </div>
                </>
            )}

            {foutmelding && <p className="foutmelding">{foutmelding}</p>}

            <button className="btn btn-primary" type="submit" disabled={versturen}>
                {versturen ? 'Bezig...' : 'Product toevoegen'}
            </button>
        </form>
    );
}

export default ProductForm;