import { ObjectId } from "mongodb"
import client from "../common/dbconn.js"
import { Pelicula } from "./pelicula.js"


const peliculaCollection = client.db('cine').collection('peliculas')


async function HandleInsertPeliculaRequest(req, res) 
{
    let data = req.body
    let pelicula = Pelicula
    
    pelicula.nombre = data.nombre
    pelicula.generos = data.generos
    pelicula.anioEstreno = data.anioEstreno
 
    await peliculaCollection.insertOne(pelicula)
    .then((data) => {
        if (data === null) return res.status(400).send('Error al guardar registro de pelicula')
            return res.status(201).send(data)
        }
    
    )
    .catch((e) =>{return res.status(500).send({error: e})})
}

async function HandleGetPeliculasRequest(req, res) {
    await peliculaCollection.find({}).toArray()
    .then ((data) =>{return res.status(200).send(data)})
    .catch((e)=> {return res.status(500).send({error : e})})
}


async function handleGetPeliculaByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)
        
        await peliculaCollection.findOne({_id: oid})
        .then((data) =>{
            if(data === null) return res.status(404).send(data)
                return res.status(200).send(data)
        })
        .catch((e) =>{
            return res.status(500).send({error: e})
        })


    } catch (e) {
        return res.status(400).send({error: 'Id mal formado'})
    }
    
}

async function handleUpdatePeliculaByIdRequest(req, res) {
    let id = req.params.id
    let pelicula = req.body
    
    try {
        let oid = ObjectId.createFromHexString(id)

        let query = {$set: pelicula}

        await peliculaCollection.updateOne({_id: oid}, query)
        .then((data) =>{ return res.status(200).send (data)})
        .catch((e) =>{ return res.status(500).send({code: e.code})})
        
    } catch (e) {
        return res.status(400).send('id mal formado')
        
    }
    
}

async function handleDeletePeliculaByIdRequest(req, res) {
    let id = req.params.id

    try {
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.deleteOne({_id: oid})
        .then((data) => {return res.status(200).send(data)})
        .catch((e) => {return res.status(500).send({ code: e.code})})

    } catch (e) {
        return res.status(400).send('id mal formado')
        
    }
    
}

export default{
    HandleInsertPeliculaRequest,
    HandleGetPeliculasRequest,
    handleUpdatePeliculaByIdRequest,
    handleGetPeliculaByIdRequest,
    handleDeletePeliculaByIdRequest

}