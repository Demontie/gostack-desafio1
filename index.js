const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json(
      {
        error: 'Projeto não encontrado'
      }
    );
  }

  return next();
}

function logRequests(req, res, next) {

  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

 
//Cadastra um projeto 
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Atualiza um o titulo de um projeto 
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Exclui um projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const indexProject = projects.map(p => p.id).indexOf(id);

  projects.splice(indexProject, 1);

  return res.send();
});

//Atualiza uma tarefa
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3030);