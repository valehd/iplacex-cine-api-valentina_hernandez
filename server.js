
import express, {urlencoded} from "express"
import cors from "cors"

import client from "./src/common/dbconn.js"
import ActorRoutes from "./src/actor/routes.js"

import peliculaRoutes from "./src/pelicula/routes.js"


const PORTS = 3000 || 4000
const app = express()

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cors())


app.all('/', (req, res) =>{return res.status(200).send('Bienvenido al cine Iplacex')})


app.use('/api', ActorRoutes)
app.use('/api', peliculaRoutes)


await client.connect()
.then(() =>{
    console.log('Conectado al cluster')
    app.listen(PORTS, () => { console.log(`Servidor corrriendo en http://localhost:${PORTS}`)})
    
})
.catch(() =>{
    console.log('Ha ocurrido un error al conectar al cluster de atlas db')
})


