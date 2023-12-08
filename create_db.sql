CREATE DATABASE myPCForum;
USE myPCForum;
CREATE TABLE Software (id INT AUTO_INCREMENT,title VARCHAR(50),issue VARCHAR(255) ,PRIMARY KEY(id));
INSERT INTO Software (title, issue)VALUES('Driver', 'I have GTX 1650 but can not find the driver on Radeon'),('Fortnite Laggy', 'I only have 10FPS even with RX580'), ('Windows Key Not activated', 'I have bought a Key from someone online but it does not work') ;
DROP USER 'appuser'@'localhost';
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'app2027';
GRANT ALL PRIVILEGES ON myPCForum.* TO 'appuser'@'localhost';
CREATE TABLE userdetails (username VARCHAR(50), first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, hashedPassword VARCHAR(255) NOT NULL, PRIMARY KEY (username));