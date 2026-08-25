import type { Llamado } from './tipos'

// llamados de mentira hasta que este el back.
// la mesa 8 aparece dos veces: pidio dos cosas y todavia no la atendieron
export const llamados: Llamado[] = [
  { id: 1, mesa: 8, motivo: 'pan',    haceMinutos: 6 },
  { id: 2, mesa: 5, motivo: 'cuenta', haceMinutos: 4 },
  { id: 3, mesa: 8, motivo: 'mozo',   haceMinutos: 1 },
]