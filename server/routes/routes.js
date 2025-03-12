import { Router } from 'express'

import { MovieController } from '../controllers/controlador.js'

export const rutas = Router()

rutas.get('/', MovieController.getAll);
