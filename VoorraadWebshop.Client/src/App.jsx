import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import OrderForm from './OrderForm';
import OrdersOverzicht from './OrdersOverzicht';
import KlantenOverzicht from './KlantenOverzicht';
import './App.css';

function App() {
  const [producten, setProducten] = useState([]);
  const [laden, setLaden] = useState(true);
  const [foutmelding, setFoutmelding] = useState(null);
  const [orderVernieuwTrigger, setOrderVernieuwTrigger] = useState(0);
  const [klantVernieuwTrigger, setKlantVernieuwTrigger] = useState(0);

  function haalProductenOp() {
    setLaden(true);
    fetch('http://localhost:5070/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Er ging iets mis bij het ophalen van de producten.');
        }
        return response.json();
      })
      .then((data) => {
        setProducten(data);
        setLaden(false);
      })
      .catch((error) => {
        setFoutmelding(error.message);
        setLaden(false);
      });
  }

  function verversAlles() {
    haalProductenOp();
    setOrderVernieuwTrigger((prev) => prev + 1);
  }

  function verwijderProduct(id) {
    if (!window.confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      return;
    }
    fetch(`http://localhost:5070/api/products/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error('Product kon niet worden verwijderd.');
        haalProductenOp();
      })
      .catch((error) => setFoutmelding(error.message));
  }

  useEffect(() => {
    haalProductenOp();
  }, []);

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-titel">Voorraadwebshop</div>
        <a href="#sectie-product-toevoegen">Product toevoegen</a>
        <a href="#sectie-order-plaatsen">Order plaatsen</a>
        <a href="#sectie-producten">Producten</a>
        <a href="#sectie-klanten">Klanten</a>
        <a href="#sectie-orders">Orders</a>
      </nav>

      <div className="app">
        <header className="app-header">
          <h1>Voorraadwebshop</h1>
          <p className="app-subtitle">Voorraadbeheer &amp; orderadministratie</p>
        </header>

        <section id="sectie-product-toevoegen" className="panel">
          <ProductForm onProductToegevoegd={haalProductenOp} />
        </section>

        <section id="sectie-order-plaatsen" className="panel">
          <OrderForm onOrderGeplaatst={verversAlles} />
        </section>

        <section id="sectie-producten" className="panel">
          <h2>Producten</h2>
          {laden && <p>Producten laden...</p>}
          {foutmelding && <p className="foutmelding">{foutmelding}</p>}
          {!laden && !foutmelding && (
            <ul className="item-lijst">
              {producten.map((product) => (
                <li key={product.id} className="item-rij">
                  <span>{product.naam}</span>
                  <span className="mono">€{product.prijs.toFixed(2)}</span>
                  <button className="btn btn-danger" onClick={() => verwijderProduct(product.id)}>
                    Verwijder
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="sectie-klanten" className="panel">
          <KlantenOverzicht
            vernieuwTrigger={klantVernieuwTrigger}
            onKlantVerwijderd={() => setKlantVernieuwTrigger((prev) => prev + 1)}
          />
        </section>

        <section id="sectie-orders" className="panel">
          <OrdersOverzicht vernieuwTrigger={orderVernieuwTrigger} />
        </section>
      </div>
    </div>
  );
}

export default App;