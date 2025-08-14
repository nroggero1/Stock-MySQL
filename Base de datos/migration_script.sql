-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration - Corregido
-- Created: Mon Aug  4 19:01:57 2025
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

DROP SCHEMA IF EXISTS `Stock-MySQL`;
CREATE SCHEMA IF NOT EXISTS `Stock-MySQL`;
USE `Stock-MySQL`;

-- ----------------------------------------------------------------------------
-- Tabla Provincia
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Provincia (
  Id INT NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Localidad
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Localidad (
  Id INT NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
  IdProvincia INT NOT NULL,
  CodigoPostal SMALLINT NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdProvincia) REFERENCES Provincia(Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Proveedor
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Proveedor (
  Id INT NOT NULL AUTO_INCREMENT,
  CodigoTributario BIGINT NOT NULL,
  Direccion VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
  IdLocalidad INT NOT NULL,
  IdProvincia INT NOT NULL,
  Telefono VARCHAR(20) CHARACTER SET utf8mb4,
  Mail VARCHAR(50) CHARACTER SET utf8mb4,
  Denominacion VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
  FechaAlta DATETIME(6) NOT NULL,
  Activo TINYINT(1) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdLocalidad) REFERENCES Localidad(Id),
  FOREIGN KEY (IdProvincia) REFERENCES Provincia(Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Cliente
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Cliente (
  Id INT NOT NULL AUTO_INCREMENT,
  CodigoTributario BIGINT NOT NULL,
  Direccion VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
  IdLocalidad INT NOT NULL,
  IdProvincia INT NOT NULL,
  Telefono VARCHAR(20) CHARACTER SET utf8mb4,
  Mail VARCHAR(50) CHARACTER SET utf8mb4,
  Denominacion VARCHAR(100) CHARACTER SET utf8mb4,
  FechaAlta DATETIME(6) NOT NULL,
  Activo TINYINT(1) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdLocalidad) REFERENCES Localidad(Id),
  FOREIGN KEY (IdProvincia) REFERENCES Provincia(Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Marca
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Marca (
  Id INT NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
  Activo TINYINT(1) NOT NULL,
  FechaAlta DATETIME(6) NOT NULL,
  PRIMARY KEY (Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Categoria
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Categoria (
  Id INT NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
  FechaAlta DATETIME(6) NOT NULL,
  Activo TINYINT(1) NOT NULL,
  PRIMARY KEY (Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Producto
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Producto (
  Id INT NOT NULL AUTO_INCREMENT,
  Nombre VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
  Descripcion VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL,
  CodigoBarras VARCHAR(30) CHARACTER SET utf8mb4 NOT NULL,
  IdCategoria INT NOT NULL,
  IdMarca INT NOT NULL,
  PrecioCompra DECIMAL(12,2) NOT NULL,
  PorcentajeGanancia INT NOT NULL,
  PrecioVentaSugerido DECIMAL(12,2) NOT NULL,
  PrecioVenta DECIMAL(12,2) NOT NULL,
  Stock INT NOT NULL,
  StockMinimo INT NOT NULL,
  Activo TINYINT(1) NOT NULL,
  FechaAlta DATETIME(6) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdCategoria) REFERENCES Categoria(Id),
  FOREIGN KEY (IdMarca) REFERENCES Marca(Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Usuario
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuario (
  Id INT NOT NULL AUTO_INCREMENT,
  NombreUsuario VARCHAR(50) NOT NULL,
  Nombre VARCHAR(50) NOT NULL,
  Apellido VARCHAR(50) NOT NULL,
  Mail VARCHAR(50) CHARACTER SET utf8mb4,
  FechaNacimiento DATETIME(6) NOT NULL,
  Clave VARCHAR(50) NOT NULL,
  Administrador TINYINT(1) NOT NULL,
  FechaAlta DATETIME(6) NOT NULL,
  Activo TINYINT(1) NOT NULL,
  PRIMARY KEY (Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Compra
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Compra (
  Id INT NOT NULL AUTO_INCREMENT,
  Fecha DATETIME(6),
  IdUsuario INT,
  IdProveedor INT,
  Importe DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(Id),
  FOREIGN KEY (IdProveedor) REFERENCES Proveedor(Id)
);

-- ----------------------------------------------------------------------------
-- Tabla DetalleCompra
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS DetalleCompra (
  Id INT NOT NULL AUTO_INCREMENT,
  IdCompra INT,
  IdProducto INT,
  Cantidad INT NOT NULL,
  PrecioUnitario DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdCompra) REFERENCES Compra(Id),
  FOREIGN KEY (IdProducto) REFERENCES Producto(Id)
);

-- ----------------------------------------------------------------------------
-- Tabla Venta
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Venta (
  Id INT NOT NULL AUTO_INCREMENT,
  Fecha DATETIME(6),
  IdUsuario INT,
  IdCliente INT,
  Importe DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdUsuario) REFERENCES Usuario(Id),
  FOREIGN KEY (IdCliente) REFERENCES Cliente(Id)
);

-- ----------------------------------------------------------------------------
-- Tabla DetalleVenta
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS DetalleVenta (
  Id INT NOT NULL AUTO_INCREMENT,
  IdVenta INT,
  IdProducto INT,
  Cantidad INT NOT NULL,
  PrecioUnitario DECIMAL(10,2) NOT NULL,
  Bonificacion INT NOT NULL,
  PRIMARY KEY (Id),
  FOREIGN KEY (IdVenta) REFERENCES Venta(Id),
  FOREIGN KEY (IdProducto) REFERENCES Producto(Id)
);

SET FOREIGN_KEY_CHECKS = 1;
