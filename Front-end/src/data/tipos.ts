// las formas de los datos que uso  en el proyecto(quedamos con tinchi)
export type EstadoMesa = 'vacia' | 'ocupada' | 'llamando'
export type Mesa = {
  id: number
  numero: number
  x: number
  y: number
  tamano: number
  forma: 'circular' | 'cuadrado'
  estado: EstadoMesa
  // cuantas personas entran. va con ? porque la base todavia no tiene
  // esta columna: las mesas que vienen del back llegan sin ella
  lugares?: number
}
//number es basicamente aca va un numero, que seria el id, el numero de pesa, y la posicion. 


// los 5 botones que tiene el aparato de cada mesa
export type Motivo = 'pan' | 'mozo' | 'cuenta' | 'cancelar' | 'menu'

// una solicitud como viene de la base
export type Solicitud = {
  id: number
  // 'pendiente' mientras no la atendieron. no se borra, cambia de estado
  estado: string
  // la base guarda el dia y la hora en dos columnas distintas
  fecha: string
  hora: string
  // le pongo string y no Motivo porque este dato viene de afuera:
  // no puedo prometerle a TypeScript que sea uno de los cinco que conozco
  tipo: string
  id_usuario: number
  // ojo: es el id de la mesa en la base, no el numero que ve el cliente
  id_mesa: number
}

export type Plato = {
  id: number
  nombre: string
  precio: number
}
export type Rol = 'mozo' | 'encargado'

// el email no esta aca: es el mismo para todo el restaurante.
// lo que distingue a una persona de otro es la contraseña
export type Usuario = {
  id: number
  nombre: string
  rol: Rol
  password: string
}
