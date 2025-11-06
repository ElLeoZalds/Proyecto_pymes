CREATE DATABASE pymes;
-- DROP DATABASE pymes;
USE pymes;

CREATE TABLE clientes (
	id					INT PRIMARY KEY AUTO_INCREMENT,
    apellidos			VARCHAR(20) NOT NULL,
    nombres				VARCHAR(20) NOT NULL,
    dni					CHAR(8) NOT NULL,
    direccion			VARCHAR(20) NOT NULL,
	telefono			CHAR(9) NOT NULL,
    CONSTRAINT uk_dni UNIQUE(dni)
)ENGINE = INNODB;

CREATE TABLE prestamos (
	id					INT PRIMARY KEY AUTO_INCREMENT,
    prestamo			DECIMAL(10, 2) NOT NULL,
    caracteristicas		VARCHAR(100) NOT NULL,
    letracambio			VARCHAR(200) NOT NULL,
    fechainicio			DATETIME NOT NULL DEFAULT NOW(),
    fechalimite			DATE NOT NULL,
    transferencia    	VARCHAR(200) COMMENT "Transferencia o efectivo",
    montototal			DECIMAL(10, 2),
    estado				ENUM("vigente", "pagado", "vendido") DEFAULT "vigente",
    interes				DECIMAL(10, 2),
    cliente				INT NOT NULL,
    FOREIGN KEY (cliente) REFERENCES clientes(id) ON DELETE CASCADE
)ENGINE = INNODB;

CREATE TABLE pagos (
	id					INT PRIMARY KEY AUTO_INCREMENT,
    cuota				DECIMAL(10, 2) NOT NULL,
    fechapago			DATETIME NOT NULL DEFAULT NOW(),
    prestamo			INT NOT NULL,
    FOREIGN KEY (prestamo) REFERENCES prestamos(id)
)ENGINE = INNODB;

INSERT INTO clientes (apellidos, nombres, dni, direccion, telefono) 
			VALUES ("Salas Vasquez", "Fabián Alonzo", "Av. Falsa 123", "74064042", "936200224"),
				   ("Palacios Gonzales", "Leonardo Alexander", "Calle. 842", "75266220", "903386996");
 
INSERT INTO prestamos (prestamo, caracteristicas, letracambio, fechalimite, transferencia, interes, cliente)
			VALUES (1000, "caracteristicas", "letracambio.pdf", "2025-11-01", NULL, 30, 1);

INSERT INTO pagos (cuota, prestamo) 
			VALUES (255.00, 1);

SELECT 
    pag.id AS pago_id,
    pag.cuota,
    pre.prestamo AS prestamo,
    cli.nombres
FROM pagos pag
INNER JOIN prestamos pre
    ON pag.prestamo = pre.id
INNER JOIN clientes cli
    ON pre.cliente = cli.id;

SELECT * FROM clientes;
SELECT * FROM prestamos;
SELECT * FROM pagos;
