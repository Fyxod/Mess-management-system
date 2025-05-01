import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    address: '',
  });
  const [message, setMessage] = useState('');

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const handleChange = e => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/suppliers', newSupplier);
      setMessage('Supplier added successfully!');
      setNewSupplier({ name: '', contact: '', address: '' });
      fetchSuppliers();
    } catch (err) {
      console.error('Error adding supplier:', err);
      setMessage('Failed to add supplier.');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Suppliers</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow mb-6 space-y-4">
        <h3 className="text-lg font-medium">Add New Supplier</h3>
        <input
          type="text"
          name="name"
          placeholder="Supplier Name"
          value={newSupplier.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={newSupplier.contact}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={newSupplier.address}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        ></textarea>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Supplier
        </button>
        {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
      </form>

      <div className="space-y-4">
        {suppliers.map((supplier, index) => (
          <div key={index} className="bg-gray-50 border rounded p-4 shadow-sm">
            <h4 className="text-lg font-semibold">{supplier.NAME}</h4>
            <p><strong>Contact:</strong> {supplier.CONTACT}</p>
            <p><strong>Address:</strong> {supplier.ADDRESS}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
