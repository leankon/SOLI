// las formas de los datos que uso  en el proyecto(quedamos con tinchi)
export type EstadoMesa = 'vacia' | 'ocupada' | 'llamando'
export type Mesa = {
  id: number
  numero: number
  x: number
  y: number
  tamaño: number
  forma: 'circular' | 'cuadrado'
  estado: EstadoMesa
}
//number es basicamente aca va un numero, que seria el id, el numero de pesa, y la posicion. 


// los 5 botones que tiene el aparato de cada mesa
export type Motivo = 'pan' | 'mozo' | 'cuenta' | 'cancelar' | 'menu'

export type Llamado = {
  id: number
  mesa: number
  motivo: Motivo
  // guardo el numero, no el texto "hace 8 min".
  // el texto lo arma el componente cuando aparece
  haceMinutos: number
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