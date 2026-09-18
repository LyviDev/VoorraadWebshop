import { useState, useEffect } from 'react';

function OrderForm({ onOrderGeplaatst }) {
    const [klanten, setKlanten] = useState([]);
    const [producten, setProducten] = useState([]);
    const [klantId, setKlantId] = useState('');
    const [orderRegels, setOrderRegels] = useState([{ productId: '', aantal: 1 }]);
    const [versturen, setVersturen] = useState(false);
    const [foutmelding, setFoutmelding] = useState(null);
    const [succesmelding, setSuccesmelding] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5070/api/klants')
            .then((res) => res.json())
            .then(setKlanten);

        fetch('http://localhost:5070/api/products')
            .then((res) => res.json())
            .then(setProducten);
    }, []);

    function updateOrderRegel(index, veld, waarde) {
        const nieuweRegels = [...orderRegels];
        nieuweRegels[index][veld] = waarde;
        setOrderRegels(nieuweRegels);
    }

    function voegRegelToe() {
        setOrderRegels([...orderRegels, { productId: '', aantal: 1 }]);
    }

    function verwijderRegel(index) {
        setOrderRegels(orderRegels.filter((_, i) => i !== index));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setVersturen(true);
        setFoutmelding(null);
        setSuccesmelding(null);

        const orderData = {
            klantId: parseInt(klantId),
            orderRegels: orderRegels.map((regel) => ({
                productId: parseInt(regel.productId),
                aantal: parseInt(regel.aantal),
            })),
        };

        fetch('http://localhost:5070/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const foutTekst = await response.text();
                    throw new Error(foutTekst || 'Order kon niet worden geplaatst.');
                }
                return response.json();
            })
            .then((nieuweOrder) => {
                setSuccesmelding(`Order #${nieuweOrder.id} succesvol geplaatst!`);
                setKlantId('');
                setOrderRegels([{ productId: '', aantal: 1 }]);
                onOrderGeplaatst();
            })
            .catch((error) => setFoutmelding(error.message))
            .finally(() => setVersturen(false));
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Nieuwe order plaatsen</h2>

            <div>
                <label>Klant:</label>
                <select value={klantId} onChange={(e) => setKlantId(e.target.value)} required>
                    <option value="">-- Kies een klant --</option>
                    {klanten.map((klant) => (
                        <option key={klant.id} value={klant.id}>
                            {klant.naam}
                        </option>
                    ))}
                </select>
            </div>

            <h3>Producten</h3>
            {orderRegels.map((regel, index) => (
                <div key={index}>
                    <select
                        value={regel.productId}
                        onChange={(e) => updateOrderRegel(index, 'productId', e.target.value)}
                        required
                    >
                        <option value="">-- Kies een product --</option>
                        {producten.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.naam} (€{product.prijs.toFixed(2)})
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        value={regel.aantal}
                        onChange={(e) => updateOrderRegel(index, 'aantal', e.target.value)}
                        required
                    />

                    {orderRegels.length > 1 && (
                        <button type="button" onClick={() => verwijderRegel(index)}>
                            Verwijder
                        </button>
                    )}
                </div>
            ))}

            <button type="button" onClick={voegRegelToe}>
                + Nog een product toevoegen
            </button>

            {foutmelding && <p style={{ color: 'red' }}>{foutmelding}</p>}
            {succesmelding && <p style={{ color: 'green' }}>{succesmelding}</p>}

            <div>
                <button type="submit" disabled={versturen}>
                    {versturen ? 'Bezig...' : 'Order plaatsen'}
                </button>
            </div>
        </form>
    );
}

export default OrderForm;