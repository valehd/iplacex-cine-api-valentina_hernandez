

import { Actor } from "./actor.js"


import { ObjectId } from "mongodb";
import client from "../common/dbconn.js";

const actorCollection = client.db("cine").collection("actores");
const peliculaCollection = client.db("cine").collection("peliculas");

async function handleInsertActorRequest(req, res) 
{
    const data = req.body;

   
    if (!data.nombre || !data.nombrePelicula) {
        return res.status(400).send("Faltan datos requeridos");
    }

    try {
        // busqued insensible a mayusculas o minusculas
        const pelicula = await peliculaCollection.findOne({
            nombre: { $regex: `^${data.nombrePelicula}$`, $options: "i" },
        });

        if (!pelicula) {
            return res.status(404).send("Película no existe");
        }

      r
        const actor = {
            idPelicula: pelicula._id.toString(),
            nombre: data.nombre,
            edad: data.edad || null,
            estaRetirado: data.estaRetirado || false,
            premios: data.premios || [],
        };

        
        const result = await actorCollection.insertOne(actor);

        if (!result.acknowledged) {
            return res.status(400).send("Error al guardar el actor");
        }

        return res.status(201).send(result);
    } catch (e) {
        return res.status(500).send({ error:e});
    }
}

async function handleGetActoresRequest(req, res) {
    try {
        const actores = await actorCollection.find({}).toArray();
        return res.status(200).send(actores);
    } catch (e) {
        return res.status(500).send({ error: e});
    }
}

async function handleGetActorByIdRequest(req, res) {
    const id = req.params.id;

    try {
      
        const oid = new ObjectId(id);

        const actor = await actorCollection.findOne({ _id: oid });

        if (!actor) {
            return res.status(404).send("actor no fue encontrado");
        }

        return res.status(200).send(actor);
    } catch (error) {
        if (error instanceof TypeError || error.name === "BSONTypeError") {
            return res.status(400).send({ error: "Id mal formado" });
        }

        return res.status(500).send({ error: "Error al buscar actor: " + error.message });
    }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
    const peliculaId = req.params.id;

    try {
       
        const objectId = new ObjectId(peliculaId);

        const actores = await actorCollection.find({ idPelicula: objectId.toString() }).toArray();

        if (actores.length === 0) {
            return res.status(404).send("No se encontraron actores");
        }

        return res.status(200).send(actores);
    } catch (error) {
        if (error instanceof TypeError || error.name === "BSONTypeError") {
            return res.status(400).send("Id mal formado");
        }

        return res.status(500).send({ error: "Error al obtener actores: " + error.message });
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest,
};
