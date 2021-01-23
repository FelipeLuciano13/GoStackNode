const express = require("express");
const cors = require("cors");

const {  v4, validate} = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateId)

const repositories = [];

function validateId(req, res, next){
  const {id} = req.params

  if(!validate(id)){
    return res.status(400).json({error:"Id is not valid"})
  }

  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} =request.body

  const repositorie = {
    id: v4(),
    title, 
    url, 
    techs,
    likes: 0
  }

  repositories.push(repositorie)

  return response.json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params
  const {title, url, techs} = request.body

  const rep_index = repositories.findIndex(repositorie => repositorie.id == id)

  if(rep_index < 0){
    return response.status(400).json({error: "Repositorie not found"})
  }

  const repositorie = {
    id: repositories[rep_index].id,
    title, 
    url,
    techs,
    likes: repositories[rep_index].likes
  }

  repositories[rep_index] = repositorie 

  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params

  const rep_index = repositories.findIndex(repositorie => repositorie.id == id)

  if(rep_index < 0){
    return response.status(400).json({error: "Repositorie not found"})
  }

  repositories.splice(rep_index,1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const {id} = request.params

  const rep_index = repositories.findIndex(repositorie => repositorie.id == id)

  if(rep_index < 0){
    return response.status(400).json({error: "Repositorie not found"})
  }

  repositories[rep_index].likes++

  return response.json(repositories[rep_index])
});

module.exports = app;
