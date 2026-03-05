SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE citas;
TRUNCATE TABLE mascotas;
TRUNCATE TABLE clientes;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO clientes (id_cliente, nombre, telefono, email) VALUES
  (1, 'Ana Ramirez', '3001112233', 'ana@example.com'),
  (2, 'Carlos Mejia', '3014445566', 'carlos@example.com'),
  (3, 'Laura Gomez', '3027778899', 'laura@example.com');

INSERT INTO mascotas (id_mascota, nombre, tipo, edad, id_cliente) VALUES
  (1, 'Luna', 'Perro', 3, 1),
  (2, 'Milo', 'Gato', 2, 2),
  (3, 'Toby', 'Perro', 5, 3);

INSERT INTO citas (id_cita, id_mascota, fecha, hora) VALUES
  (1, 1, '2026-03-10', '09:30:00'),
  (2, 2, '2026-03-11', '11:00:00'),
  (3, 3, '2026-03-12', '16:15:00');
