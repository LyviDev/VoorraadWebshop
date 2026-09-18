import { useState, useEffect } from 'react';

function OrdersOverzicht({ vernieuwTrigger }) {
    const [orders, setOrders] = useState([]);
    const [laden, setLaden] = useState(true);
    const [foutmelding, setFoutmelding] = useState(null);

    useEffect(() => {
        setLaden(true);
        fetch('http://localhost:5070/api/orders')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Orders konden niet worden opgehaald.');
                }
                return response.json();
            })
            .then((data) => {
                setOrders(data);
                setLaden(false);
            })
            .catch((error) => {
                setFoutmelding(error.message);
                setLaden(false);
            });
    }, [vernieuwTrigger]);

    function berekenTotaal(order) {
        return order.orderRegels.reduce(
            (totaal, regel) => totaal + regel.aantal * regel.prijsPerStuk,
            0
        );
    }

    if (laden) return <p>Orders laden...</p>;
    if (foutmelding) return <p style={{ color: 'red' }}>Fout: {foutmelding}</p>;

    return (
        <div>
            <h2>Orders</h2>
            {orders.length === 0 && <p>Nog geen orders geplaatst.</p>}
            {orders.map((order) => (
                <div key={order.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                    <p>
                        <strong>Order #{order.id}</strong> — Status: {order.status} — Klant: {order.klant?.naam ?? 'Onbekend'}
                    </p>
                    <ul>
                        {order.orderRegels.map((regel) => (
                            <li key={regel.id}>
                                {regel.product?.naam ?? 'Onbekend product'} × {regel.aantal} — €
                                {(regel.aantal * regel.prijsPerStuk).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <p>
                        <strong>Totaal: €{berekenTotaal(order).toFixed(2)}</strong>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default OrdersOverzicht;