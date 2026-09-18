import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import OrderForm from './OrderForm';
import OrdersOverzicht from './OrdersOverzicht';
import './App.css';

function App() {
  const [producten, setProducten] = useState([]);
  const [laden, setLaden] = useState(true);
  const [foutmelding, setFoutmelding] = useState(null);
  const [orderVernieuwTrigger, setOrderVernieuwTrigger] = useState(0);

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

  useEffect(() => {
    haalProductenOp();
  }, []);

  return (
    <div>
      <h1>Voorraadwebshop</h1>

      <ProductForm onProductToegevoegd={haalProductenOp} />

      <OrderForm onOrderGeplaatst={verversAlles} />

      <h2>Producten</h2>
      {laden && <p>Producten laden...</p>}
      {foutmelding && <p>Fout: {foutmelding}</p>}
      {!laden && !foutmelding && (
        <ul>
          {producten.map((product) => (
            <li key={product.id}>
              {product.naam} — €{product.prijs.toFixed(2)}
            </li>
          ))}
        </ul>
      )}

      <OrdersOverzicht vernieuwTrigger={orderVernieuwTrigger} />
    </div>
  );
}

export default App;