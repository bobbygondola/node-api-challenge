const express = require('express');
const server = express();
const morgan = require("morgan");
//databases
const projDB = require("./data/helpers/projectModel")
const actDB = require("./data/helpers/actionModel")

//middleware
server.use(express.json());//built in middleware
server.use(morgan("combined"));
server.use(logger);

//customMiddleWare
function logger(req, res, next) {
    console.log(`DATE---[${new Date().toISOString()}]|| REQUEST METHOD--- ${req.method}|| REQUEST URL--- ${req.url}|| FROM--- ${req.get('Origin')}||`)
    next()
  }

//functions
  server.get('/', (req, res) => {
    res.status(200).json({ api: "is up, bobby good luck and hard work" });
  });

  //all projects
  server.get("/api/projects", (req, res) => {
      projDB.get()
      .then(projects => {
          res.status(200).json({projects})
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({error})
      })
  })

  //projects by id
  server.get("/api/projects/:id", (req, res) => {
      const id = req.params.id;
      if (!id) {
          res.status(400).json({ message: "This ID doesnt exist"})
      } else {
      projDB.get(id)
      .then(projects => {
          res.status(200).json({projects})
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({error})
      })
    }
  })


  //actions from specific project
  server.get('/api/projects/:id/actions', (req, res) => {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "Please provide an id to get actions" })
      } else {
      actDB.get()
      .then(actions => {
          res.status(200).json(actions)
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({error})
    })
    }
  })

  //new project
  server.post("/api/projects", (req, res) => {
    const body = req.body;
    if (!body) {
        res.status(400).json({ error: "Please provide the correct text" })
    } else {
    projDB.insert(body)
    .then(newProject => {
        res.status(201).json({newProject})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error})
    })
    }
});

//new action to specific project
server.post("/api/projects/:id/actions", (req, res) => {
    const body = req.body;
    body.project_id = req.params.id;
    if (!body) {
        res.status(400).json({ error: "Please provide info to post!" })
    } else {
    actDB.insert(body)
    .then(newAction => {
        res.status(201).json({newAction})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error})
    })
}
})

//updated an action in a project
server.put("/api/projects/:projectid/actions/:actionid", (req, res) => {
    const changes = req.body;
    changes.project_id = req.params.projectid;
    const actionid = req.params.actionid;
    if (!actionid) {
        res.status(400).json({ error: "Please provide an id!" })
    } else {
    actDB.update(actionid, changes)
    .then(updatedAction => {
        res.status(200).json(updatedAction)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error})
    })
}
})

// updating a project
server.put("/api/projects/:id", (req, res) => {
    const changes = req.body;
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "Please provide an id!" })
    } else {
    projDB.update(id, changes)
    .then(updatedProject => {
        res.status(200).json({updatedProject})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error})
    })
}
})

//delete project
server.delete("/api/projects/:id", (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ error: "Please provide an id!" })
    } else {
    projDB.remove(id)
    .then(removedProject => {
        res.status(204).json({removedProject})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error})
    })
}
})

//delete action
server.delete("/api/projects/:id/actions/:id", (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400).json({ error: "Please provide an id!" })
    } else {
    actDB.remove(id)
    .then(removedAction => {
        res.status(204).json({removedAction})
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error})
    })
}
})



const port = 8003;

server.listen(port, () => {
  console.log(`server is listening on ${port} bobby, today is 6/5/2020, goodluck and hardwork`);
});