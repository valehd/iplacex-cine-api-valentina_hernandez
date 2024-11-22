import express from 'express'
import controller from "./controller.js"



const peliculaRoutes = express.Router()

peliculaRoutes.post('/pelicula', controller.HandleInsertPeliculaRequest)

peliculaRoutes.get('/peliculas', controller.HandleGetPeliculasRequest)

peliculaRoutes.get('/pelicula/:id', controller.handleGetPeliculaByIdRequest)
peliculaRoutes.put('/pelicula/:id', controller.handleUpdatePeliculaByIdRequest)

peliculaRoutes.delete('/pelicula/:id', controller.handleDeletePeliculaByIdRequest)


export default peliculaRoutes                                   