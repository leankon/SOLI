//trae la forma de mesa, que es la que va en import type en tipos.ts
import type { Mesa } from './tipos'
// mesa de mentira hasta que este el back
export const mesas: Mesa[] = [
  { id: 1, numero: 1, x: 40, y: 40, forma: 'cuadrado', estado: 'vacia' },
]