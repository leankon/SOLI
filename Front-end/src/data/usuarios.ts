import type { Usuario } from './tipos'

// usuarios de mentira hasta que este el back
export const usuarios: Usuario[] = [
  { id: 1, nombre: 'Martin', rol: 'encargado', password: 'martin' },
  { id: 2, nombre: 'Camila', rol: 'encargado', password: 'camila' },
  { id: 3, nombre: 'Sofia',  rol: 'mozo',      password: 'sofia' },
  { id: 4, nombre: 'Lucas',  rol: 'mozo',      password: 'lucas' },
  { id: 5, nombre: 'Thiago', rol: 'mozo',      password: 'thiago' },
]