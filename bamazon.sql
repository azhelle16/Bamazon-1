DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT,
	products_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255) NOT NULL,
	price DECIMAL(6,2) NOT NULL,
	stock_in_quantity INT NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO products (products_name,department_name,price,stock_in_quantity) VALUES
("Barcelona: A Love Untold", "Movies, Music & Games", 19.99, 25),
("Becoming by Michelle Obama", "Books & Audible", 17.24, 120),
("Apple iPhone XR Red \(64GB\)", "Electronics, Computers & Office", 749.99, 80),
("ACME Lloyd Black Faux Leather Sectional Sofa with Sleeper", "Home & Kitchen", 467.87, 10),
("Samsung Galaxy S10 Factory Unlocked Phone with 512GB \(U.S. Warranty\), Prism White", "Electronics, Computers & Office", 1149.99, 15),
("Kingdom Hearts III - PlayStation 4", "Movies, Music & Games", 48.45, 109),
("Reputation by Taylor Swift \(Audio CD\)", "Movies, Music & Games", 30.65, 12),
("Thule Stir Men's Hiking Pack", "Sports and Outdoors", 129.95, 8),
("ThunderShirt Sport Dog Anxiety Jacket", "Pet Supplies", 44.95, 35),
("Kenneth Cole Reaction, 3.4 Fl oz", "Luxury Fragrances", 74.00, 50);