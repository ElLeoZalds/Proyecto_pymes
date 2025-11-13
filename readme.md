# PROYECTO PYMES

# Procedimientos

## 🚀 1. Clonar el repositorio de GitHub en la terminal:

```bash
git clone https://github.com/ElLeoZalds/Proyecto_pymes.git
```

## 💾 2. Restaurar la Base de Datos:

```sql
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
    letracambio			VARCHAR(200),
    fechainicio			DATETIME DEFAULT NOW(),
    fechalimite			DATE NOT NULL,
    transferencia    	VARCHAR(200) COMMENT "Transferencia o efectivo",
    montototal			DECIMAL(10, 2) NOT NULL,
    estado				ENUM("vigente", "pagado", "vendido") DEFAULT "vigente",
    interes				DECIMAL(10, 2) NOT NULL,
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

-- Ejecutar estas lineas obligatoriamente
ALTER TABLE prestamos ADD COLUMN montorestante DECIMAL(10,2) DEFAULT 0;

SET SQL_SAFE_UPDATES = 0;
UPDATE prestamos SET montorestante = montototal;
SET SQL_SAFE_UPDATES = 1;
```

## 🔧 3. Abrir el proyecto en Visual Studio Code usando por ejemplo el comando:

```
code .
```

## ⬇️ 4. Instalar ejecutar la instalación y recuperar todas las dependencias

### Usar **ctrl + ñ** para abrir la terminal de VSC y escribir

```bash
npm install
```

## ⚙️ 5. Configurar el archivo **.env**

```js
DB_HOST = localhost;
DB_USER = tu_usuario;
DB_PASSWORD = tu_contraseña;
DB_NAME = tu_db;
PORT = 3306;
```

## 💻 6. Instalar e iniciar el servidor con _nodemon_

```
npm install -g nodemon
nodemon server
```

## 📬 7. Probar la API

Puedes utilizar Postman, ThunderClient u otro cliente REST para probar los siguientes endpoints:

| Método | Ruta   | Qué hace                           |
| ------ | ------ | ---------------------------------- |
| GET    | `/`    | Trae todos los registros           |
| GET    | `/:id` | Trae un registro específico por ID |
| POST   | `/`    | Crea un registro nuevo             |
| PUT    | `/:id` | Actualiza un registro existente    |
| DELETE | `/:id` | Borra un registro por su ID        |

## 🧑‍💻 Autores

```
https://github.com/ElLeoZalds
https://github.com/fabianalonzo
```
