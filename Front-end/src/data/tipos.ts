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