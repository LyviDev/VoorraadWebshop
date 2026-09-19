import { useState, useEffect } from 'react';

function KlantenOverzicht({ vernieuwTrigger, onKlantVerwijderd }) {
    const [klanten, setKlanten] = useState([]);
    const [laden, setLaden] = useState(true);
    const [foutmelding, setFoutmelding] = useState(null);

    useEffect(() => {
        setLaden(true);
        fetch('http://localhost:5070/api/klants')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Klanten konden niet worden opgehaald.');
                }
                return response.json();
            })
            .then((data) => {
                setKlanten(data);
                setLaden(false);
            })
            .catch((error) => {
                setFoutmelding(error.message);
                setLaden(false);
            });
    }, [vernieuwTrigger]);

    function verwijderKlant(id) {
        if (!window.confirm('Weet je zeker dat je deze klant wilt verwijderen?')) {
            return;
        }

        fetch(`http://localhost:5070/api/klants/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Klant kon niet worden verwijderd.');
                }
                onKlantVerwijderd();
            })
            .catch((error) => setFoutmelding(error.message));
    }

    if (laden) return <p>Klanten laden...</p>;
    if (foutmelding) return <p style={{ color: 'red' }}>Fout: {foutmelding}</p>;

    return (
        <div>
            <h2>Klanten</h2>
            <ul>
                {klanten.map((klant) => (
                    <li key={klant.id}>
                        {klant.naam} ({klant.email}){' '}
                        <button onClick={() => verwijderKlant(klant.id)}>Verwijder</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default KlantenOverzicht;