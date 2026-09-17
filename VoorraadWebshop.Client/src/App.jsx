import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [producten, setProducten] = useState([]);
  const [laden, setLaden] = useState(true);
  const [foutmelding, setFoutmelding] = useState(null);

  useEffect(() => {
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
  }, []);

  if (laden) return <p>Producten laden...</p>;
  if (foutmelding) return <p>Fout: {foutmelding}</p>;

  return (
    <div>
      <h1>Voorraadwebshop</h1>
      <h2>Producten</h2>
      <ul>
        {producten.map((product) => (
          <li key={product.id}>
            {product.naam} — €{product.prijs.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;