import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../Components/Loaders/Loader';
import { API_URL } from '../../Konfiguration/apiConstants';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface ProductWithQuantity extends Product {
  quantity: number;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartLength, setCartLength] = useState<number>(0);

  // Načtení produktů z API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL + "item/all"); // URL endpointu pro získání produktů
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Funkce pro přidání položky do košíku
  const addToCart = (product: Product) => {
    const existingCart = localStorage.getItem('cart');
    const cart: ProductWithQuantity[] = existingCart ? JSON.parse(existingCart) : [];

    // Zkontrolujeme, zda již produkt v košíku existuje
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Pokud položka již existuje, zvýšíme její množství
      cart[existingProductIndex].quantity += 1;
    } else {
      // Pokud položka ještě neexistuje, přidáme ji s množstvím 1
      cart.push({ ...product, quantity: 1 });
    }

    // Uložení košíku do localStorage a aktualizace počtu položek v košíku
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartLength(cart.reduce((acc, item) => acc + item.quantity, 0)); // Aktualizace délky košíku podle množství
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-screen-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-semibold text-center">Welcome to the Shop</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-bold">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          to="/cart"
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Go to Cart ({cartLength})
        </Link>
      </div>
    </div>
  );
};

export default ShopPage;
