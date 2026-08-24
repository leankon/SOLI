//trae la forma de mesa, que es la que va en import type en tipos.ts
import type { Mesa } from './tipos'
// mesa de mentira hasta que este el back
export const mesas: Mesa[] = [
  // estados, vacia llamando y ocupada, formas cuadrado o circular. 
  { id: 1, numero: 1, x: 80, y: 80, tamaño: 120, forma: 'cuadrado', estado: 'vacia' },
  { id: 5, numero: 5, x: 140, y: 140,tamaño: 80, forma: "circular", estado: "llamando" },
  { id: 8, numero: 8, x: 140, y: 440,tamaño: 160, forma: "circular", estado: "llamando" },
  { id: 10, numero: 10, x: 1000, y: 300,tamaño: 120, forma: "cuadrado", estado: "ocupada" },
]