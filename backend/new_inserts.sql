-- Inserting students data
INSERT INTO students (name, roll_no, room_no, hostel_name) VALUES ('Alice Johnson', 'BTECH001', 'A101', 'Aryabhatt');
INSERT INTO students (name, roll_no, room_no, hostel_name) VALUES ('Bob Smith', 'BTECH002', 'B202', 'Raman');
INSERT INTO students (name, roll_no, room_no, hostel_name) VALUES ('Charlie Lee', 'BTECH003', 'C303', 'Bose');
INSERT INTO students (name, roll_no, room_no, hostel_name) VALUES ('Diana Prince', 'BTECH004', 'D404', 'Curie');
INSERT INTO students (name, roll_no, room_no, hostel_name) VALUES ('Ethan Ray', 'BTECH005', 'E505', 'Newton');

-- Inserting meal types
INSERT INTO meal_types (name) VALUES ('Breakfast'); --1
INSERT INTO meal_types (name) VALUES ('Lunch'); --2
INSERT INTO meal_types (name) VALUES ('Dinner'); --3

-- Inserting mess menu
INSERT INTO mess_menu (meal_date, meal_type_id) VALUES (TO_DATE('2025-04-10', 'YYYY-MM-DD'), 1);
INSERT INTO mess_menu (meal_date, meal_type_id) VALUES (TO_DATE('2025-04-10', 'YYYY-MM-DD'), 2);
INSERT INTO mess_menu (meal_date, meal_type_id) VALUES (TO_DATE('2025-04-10', 'YYYY-MM-DD'), 3);

-- Inserting menu items
INSERT INTO menu_items (menu_id, item_name) VALUES (1, 'Idli');
INSERT INTO menu_items (menu_id, item_name) VALUES (1, 'Sambar');
INSERT INTO menu_items (menu_id, item_name) VALUES (2, 'Rice');
INSERT INTO menu_items (menu_id, item_name) VALUES (2, 'Dal');
INSERT INTO menu_items (menu_id, item_name) VALUES (3, 'Chapati');
INSERT INTO menu_items (menu_id, item_name) VALUES (3, 'Paneer Curry');

-- Inserting meals taken
INSERT INTO meals_taken (student_id, meal_date, meal_type_id) VALUES (1, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 1);
INSERT INTO meals_taken (student_id, meal_date, meal_type_id) VALUES (1, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 2);
INSERT INTO meals_taken (student_id, meal_date, meal_type_id) VALUES (2, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 2);

-- Inserting monthly bill
INSERT INTO monthly_bill (student_id, month, total_meals, cost_per_meal, total_amount) VALUES (1, '2025-04', 60, 30.00, 1800.00);
INSERT INTO monthly_bill (student_id, month, total_meals, cost_per_meal, total_amount) VALUES (2, '2025-04', 55, 30.00, 1650.00);

-- Inserting payments
INSERT INTO payments (bill_id, amount_paid, payment_method) VALUES (1, 1800.00, 'online');

-- Inserting food feedback
INSERT INTO food_feedback (student_id, meal_date, meal_type_id, rating, feed_text) VALUES (1, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 2, 4, 'Tasty and fresh.');
INSERT INTO food_feedback (student_id, meal_date, meal_type_id, rating, feed_text) VALUES (2, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 1, 3, 'Could be hotter.');

-- Inserting leave requests
INSERT INTO leave_requests (student_id, from_date, to_date, reason) VALUES (3, TO_DATE('2025-04-12', 'YYYY-MM-DD'), TO_DATE('2025-04-15', 'YYYY-MM-DD'), 'Out of town');

-- Inserting mess staff
INSERT INTO mess_staff (name, role, contact) VALUES ('Ravi Kumar', 'Cook', '9876543210');
INSERT INTO mess_staff (name, role, contact) VALUES ('Sunita Devi', 'Cleaner', '9876543211');

-- Inserting attendance records
INSERT INTO attendance (staff_id, date_day, is_present) VALUES (1, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 'Y');
INSERT INTO attendance (staff_id, date_day, is_present) VALUES (2, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 'N');

-- Inserting stock items
INSERT INTO stock_items (name, unit, quantity_available) VALUES ('Rice', 'kg', 200);
INSERT INTO stock_items (name, unit, quantity_available) VALUES ('Dal', 'kg', 100);
INSERT INTO stock_items (name, unit, quantity_available) VALUES ('Oil', 'litre', 50);

-- Inserting suppliers
INSERT INTO suppliers (name, contact, address) VALUES ('Agro Supplies Co.', '9123456789', '12 Market Street');
INSERT INTO suppliers (name, contact, address) VALUES ('DailyFresh Traders', '9234567890', '23 Bazaar Road');

-- Inserting stock orders
INSERT INTO stock_orders (item_id, supplier_id, order_date, quantity_ordered, status) VALUES (1, 1, TO_DATE('2025-04-11', 'YYYY-MM-DD'), 100, 'Delivered');
INSERT INTO stock_orders (item_id, supplier_id, order_date, quantity_ordered, status) VALUES (2, 2, TO_DATE('2025-04-11', 'YYYY-MM-DD'), 50, 'Pending');
