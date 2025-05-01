import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MessMenuPage() {
  const [menus, setMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const [newItems, setNewItems] = useState('');
  const [addDate, setAddDate] = useState('');
  const [addType, setAddType] = useState('Breakfast');

  const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

  const fetchMenus = async () => {
    try {
      let url = 'http://localhost:3000/api/menu';
      if (selectedDate && selectedType !== 'All') {
        url = `http://localhost:3000/api/menu/${selectedDate}/${selectedType}`;
      } else if (selectedDate) {
        url = `http://localhost:3000/api/menu/${selectedDate}`;
      }
      const res = await axios.get(url);
      setMenus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMenu = async () => {
    if (!addDate || !addType || !newItems.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    const itemsArray = newItems.split(',').map(item => item.trim()).filter(Boolean);
    if (itemsArray.length === 0) {
      alert('Please enter at least one item.');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/menu/${addDate}/${addType}`, {
        items: itemsArray,
      });
      alert('Menu added successfully!');
      setNewItems('');
      fetchMenus(); // refresh menu list
    } catch (err) {
      console.error(err);
      alert('Failed to add menu.');
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [selectedDate, selectedType]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Mess Menu</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="p-2 border rounded-md"
        />

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="p-2 border rounded-md"
        >
          {MEAL_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Add Menu Form */}
      <div className="mb-8 bg-gray-100 p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Add Menu</h3>
        <div className="flex flex-col gap-3">
          <input
            type="date"
            value={addDate}
            onChange={e => setAddDate(e.target.value)}
            className="p-2 border rounded-md"
            placeholder="Select date"
          />
          <select
            value={addType}
            onChange={e => setAddType(e.target.value)}
            className="p-2 border rounded-md"
          >
            {MEAL_TYPES.filter(t => t !== 'All').map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <input
            type="text"
            value={newItems}
            onChange={e => setNewItems(e.target.value)}
            className="p-2 border rounded-md"
            placeholder="Enter items separated by commas"
          />
          <button
            onClick={handleAddMenu}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Menu
          </button>
        </div>
      </div>

      {/* Menu Display */}
      {menus.length === 0 ? (
        <p className="text-gray-600">No menu available for selected filter.</p>
      ) : (
        <div className="space-y-4">
          {menus.map(menu => (
            <div key={menu.menu_id} className="bg-white shadow-md rounded-lg p-4">
              <div className="text-lg font-medium">
                {menu.meal_date} — {menu.meal_type}
              </div>
              <ul className="list-disc list-inside mt-2">
                {menu.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
