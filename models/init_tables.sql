-- CREATE TABLE IF NOT EXISTS companies (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(100),
--   created TIMESTAMPTZ
-- );

-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(100),
--   email VARCHAR(100),
--   phone VARCHAR (20),
--   password VARCHAR(20),
--   created TIMESTAMPTZ
-- );

-- CREATE TABLE IF NOT EXISTS roles (
--   id SERIAL PRIMARY KEY,
--   role VARCHAR(20)
-- );

-- CREATE TABLE IF NOT EXISTS users_roles (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER,
--   co_id INTEGER,
--   role_id INTEGER,
--   created TIMESTAMPTZ,
--   UNIQUE (user_id, co_id, role_id)
-- );

-- CREATE TABLE IF NOT EXISTS categories (
--   id SERIAL PRIMARY KEY,
--   category VARCHAR(80)
--   );

-- CREATE TABLE IF NOT EXISTS items (
--   id SERIAL PRIMARY KEY,
--   item VARCHAR(80),
--   price INTEGER,
--   cost INTEGER,
--   cat_id INTEGER
-- );

-- CREATE TABLE IF NOT EXISTS variations (
--   id SERIAL PRIMARY KEY,
--   variation VARCHAR(80)
--   );

-- CREATE TABLE IF NOT EXISTS items_variations (
--   id SERIAL PRIMARY KEY,
--   item_id INTEGER,
--   var_id INTEGER,
--   UNIQUE (item_id, var_id)
-- );

-- CREATE TABLE IF NOT EXISTS options (
--   id SERIAL PRIMARY KEY,
--   option VARCHAR(80),
--   price INTEGER,
--   cost INTEGER
-- );

-- CREATE TABLE IF NOT EXISTS variations_options (
--   id SERIAL PRIMARY KEY,
--   var_id INTEGER,
--   item_id INTEGER,
--   UNIQUE (var_id, item_id)
-- );

-- CREATE TABLE IF NOT EXISTS sales (
--   id SERIAL PRIMARY KEY,
--   item_id INTEGER,
--   created TIMESTAMPTZ
-- );

-- CREATE TABLE IF NOT EXISTS sales_options (
--   id SERIAL PRIMARY KEY,
--   sale_id INTEGER,
--   option_id INTEGER  
-- );
 
-- CREATE TABLE IF NOT EXISTS sales_items (
--   id SERIAL PRIMARY KEY,
--   sales_id INTEGER,  
--   item_id INTEGER
-- );

-- INSERT INTO roles (role) VALUES ('owner');
-- INSERT INTO roles (role) VALUES ('cashier');

-- DROP TABLE users_roles CASCADE;

-- ALTER TABLE users ADD COLUMN co_id INTEGER;
ALTER TABLE users ADD UNIQUE (email);

--  psql -d pos -f /mnt/c/Users/boon_/Desktop/rocketacademy/bootcamp/Module3_BackEndApps/pos_project/models/init_tables.sql