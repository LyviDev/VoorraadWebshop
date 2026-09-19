import { useState, useEffect } from 'react';

const STATUS_OPTIES = ['InBehandeling', 'Verzonden', 'Afgeleverd', 'Geannuleerd'];

function OrdersOverzicht({ vernieuwTrigger }) {
    const [orders, setOrders] = useState([]);
    const [laden, setLaden] = useState(true);
    const [foutmelding, setFoutmelding] = useState(null);

    useEffect(() => {
        haalOrdersOp();
    }, [vernieuwTrigger]);

    function haalOrdersOp() {
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
    }

    function wijzigStatus(orderId, nieuweStatusIndex) {
        fetch(`http://localhost:5070/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parseInt(nieuweStatusIndex)),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Status kon niet worden bijgewerkt.');
                }
                haalOrdersOp();
            })
            .catch((error) => setFoutmelding(error.message));
    }

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
                <div key={order.id} className="order-kaart">
                    <div className="order-kop">
                        <strong>Order #{order.id}</strong>
                        <span>Klant: {order.klant?.naam ?? 'Onbekend'}</span>
                    </div>

                    <div className="veld-groep">
                        <label>Status:</label>
                        <select
                            value={order.status}
                            onChange={(e) => wijzigStatus(order.id, e.target.value)}
                        >
                            {STATUS_OPTIES.map((optie, index) => (
                                <option key={index} value={index}>
                                    {optie}
                                </option>
                            ))}
                        </select>
                    </div>

                    <ul className="item-lijst">
                        {order.orderRegels.map((regel) => (
                            <li key={regel.id} className="item-rij">
                                <span>{regel.product?.naam ?? 'Onbekend product'} × {regel.aantal}</span>
                                <span className="mono">€{(regel.aantal * regel.prijsPerStuk).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="order-totaal mono">
                        <strong>Totaal: €{berekenTotaal(order).toFixed(2)}</strong>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default OrdersOverzicht;