import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../Konfiguration/apiConstants';

// Typy
interface Product {
  id: number;
  itemName: string;
  price: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();
  const customerId = "4FDDEA80-DD82-40E0-8ACB-1811E288DDA7";

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    console.log('Item from local storages:' + savedCart);

    if (savedCart) {
      try {
        const parsedCart: Product[] = JSON.parse(savedCart);

        setCart(parsedCart);
        calculateTotalPrice(parsedCart);
        console.log("Parsed cart" + cart.length);
        
      } catch (error) {
        console.error('Chyba při načítání košíku:', error);
        localStorage.removeItem('cart'); // Pokud jsou data neplatná, vymažte košík
      }
    }
  }, []);
  

  // Vypočítá celkovou cenu
  const calculateTotalPrice = (items: Product[]) => {
    const total = items.reduce((sum, product) => sum + product.price, 0);
    setTotalPrice(total);
  };

  // Odstraní produkt z košíku
  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((product) => product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  // Funkce pro vytvoření XML requestu
  const createOrderXML = () => {
    const orderXml = `<?xml version="1.0" encoding="UTF-8"?>
<CreateOrderRequest>
  <products>
    ${cart
      .map(
        (product) => `
    <product>
      <id>${product.id}</id>
      <itemName>${product.itemName}</itemName>
      <price>${product.price}</price>
      <quantity>${product.quantity}</quantity>
    </product>
    `
      )
      .join('')}
  </products>
  <totalPrice>${totalPrice}</totalPrice>
  <customerId>${customerId}</customerId>
</CreateOrderRequest>`;
    return orderXml;
  };

  // Odešle objednávku na server
  const createOrder = async () => {

    const orderXml = createOrderXML();
    console.log("Body sent:" + orderXml);
    try {
      const response = await fetch(API_URL + "order/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
        },
        body: orderXml,
      });

      if (!response.ok) {
        throw new Error(`Chyba při vytváření objednávky: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Response XML:', responseText);

      // Po úspěšném vytvoření objednávky uživatele přesměrujeme
      navigate('/shop');
      localStorage.clear();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-semibold text-center">Košík</h1>

      <div className="space-y-4">
        {cart.map((product) => (
          <div key={product.id} className="flex justify-between border-b py-2">
            <div>
            <h2 className="font-semibold">{product.quantity}x {product.itemName || 'Unknown Product'}</h2>
            <p className="font-bold">${product.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(product.id)}
              className="text-red-500 hover:text-red-700"
            >
              Odstranit
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <h2 className="font-semibold">Celková cena: ${totalPrice.toFixed(2)}</h2>
        <button
          onClick={createOrder}
          className="px-6 py-2 bg-blue-500 text-white rounded"
        >
          Vytvořit objednávku
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link
          to="/shop"
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Pokračovat v nákupu
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
