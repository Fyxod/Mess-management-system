import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockPage() {
  const [stockItems, setStockItems] = useState([]);
  const [stockOrders, setStockOrders] = useState([]);
  const [usageItemId, setUsageItemId] = useState('');
  const [usageQuantity, setUsageQuantity] = useState('');
  const [orderItemId, setOrderItemId] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [orderQuantity, setOrderQuantity] = useState('');

  const fetchStockData = async () => {
    try {
      const stockRes = await axios.get('http://localhost:3000/api/stock');
      setStockItems(stockRes.data);

      const ordersRes = await axios.get('http://localhost:3000/api/stock/orders');
      setStockOrders(ordersRes.data);

      const suppliersRes = await axios.get('http://localhost:3000/api/suppliers');
      setSuppliers(suppliersRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch stock data.');
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleUseStock = async () => {
    if (!usageItemId || !usageQuantity) return alert('All fields required.');

    try {
      await axios.post('http://localhost:3000/api/stock/usage', {
        stock_id: usageItemId,
        quantity: usageQuantity,
      });
      alert('Stock usage recorded.');
      setUsageItemId('');
      setUsageQuantity('');
      fetchStockData();
    } catch (err) {
      console.error(err);
      alert('Failed to use stock.');
    }
  };

  const handleOrderStock = async () => {
    if (!orderItemId || !supplierId || !orderQuantity) return alert('All fields required.');

    try {
      await axios.post('http://localhost:3000/api/stock/order', {
        stock_id: orderItemId,
        supplier_id: supplierId,
        quantity: orderQuantity,
      });
      alert('Stock order placed.');
      setOrderItemId('');
      setSupplierId('');
      setOrderQuantity('');
      fetchStockData();
    } catch (err) {
      console.error(err);
      alert('Failed to place stock order.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Stock Management</h2>

      {/* STOCK ITEMS */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Available Stock</h3>
        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Item ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Quantity Available</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map(item => (
              <tr key={item.ITEM_ID}>
                <td className="border p-2">{item.ITEM_ID}</td>
                <td className="border p-2">{item.NAME}</td>
                <td className="border p-2">{item.UNIT}</td>
                <td className="border p-2">{item.QUANTITY_AVAILABLE}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* USE STOCK */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Use Stock</h3>
        <div className="flex flex-col gap-3 md:flex-row">
          <select
            value={usageItemId}
            onChange={e => setUsageItemId(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">Select Item</option>
            {stockItems.map(item => (
              <option key={item.ITEM_ID} value={item.ITEM_ID}>
                {item.NAME}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={usageQuantity}
            onChange={e => setUsageQuantity(e.target.value)}
            placeholder="Quantity Used"
            className="p-2 border rounded-md w-full"
          />
          <button
            onClick={handleUseStock}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Use Stock
          </button>
        </div>
      </div>

      {/* PLACE ORDER */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Place Stock Order</h3>
        <div className="flex flex-col gap-3 md:flex-row">
          <select
            value={orderItemId}
            onChange={e => setOrderItemId(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">Select Item</option>
            {stockItems.map(item => (
              <option key={item.ITEM_ID} value={item.ITEM_ID}>
                {item.NAME}
              </option>
            ))}
          </select>
          <select
            value={supplierId}
            onChange={e => setSupplierId(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => (
              <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
                {s.NAME}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={orderQuantity}
            onChange={e => setOrderQuantity(e.target.value)}
            placeholder="Order Quantity"
            className="p-2 border rounded-md w-full"
          />
          <button
            onClick={handleOrderStock}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* STOCK ORDERS */}
      <div>
        <h3 className="text-lg font-medium mb-2">Stock Orders</h3>
        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Item ID</th>
              <th className="border p-2">Supplier ID</th>
              <th className="border p-2">Order Date</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {stockOrders.map(order => (
              <tr key={order.ORDER_ID}>
                <td className="border p-2">{order.ORDER_ID}</td>
                <td className="border p-2">{order.ITEM_ID}</td>
                <td className="border p-2">{order.SUPPLIER_ID}</td>
                <td className="border p-2">
                  {new Date(order.ORDER_DATE).toLocaleDateString()}
                </td>
                <td className="border p-2">{order.QUANTITY_ORDERED}</td>
                <td className="border p-2">{order.STATUS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
