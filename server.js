const express = require('express');
const bodyParser = require('body-parser');
const programmer = require('./database/tables/programmer');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Rota para a raiz ("/") que envia o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/syncDatabase', async (req, res) => {
  const database = require('./database/db');
  try {
    await database.sync();
    res.send('Database successfully synced');
  } catch (error) {
    res.send(error);
  }
});

app.post('/createProgrammer', async (req, res) => {
  try {
    const params = req.body;
    const properties = ['name', 'javascript', 'java', 'python'];
    const check = properties.every((property) => {
      return property in params;
    });
    if (!check) {
      const propStr = properties.join(', ');
      res.send(`All parameters needed to create a programmer must be sent: ${propStr}`);
      return;
    }
    const newProgrammer = await programmer.create({
      name: params.name,
      javascript: params.javascript,
      java: params.java,
      python: params.python  // Corrigido o nome do parâmetro
    });

    res.send(newProgrammer);
  } catch (error) {
    res.send(error);
  }
});

app.get('/retrieveProgrammer', async (req, res) => {
  try {
    const params = req.body;
    let record;
    if ('id' in params) {
      record = await programmer.findByPk(params.id);
    } else {
      record = await programmer.findAll();
    }

    if (record) {
      res.send(record);
    } else {
      res.send('No programmer found using received ID.');
    }
  } catch (error) {
    res.send(error);
  }
});

app.delete('/deleteProgrammer', async (req, res) => {
  try {
    const params = req.body;

    if (!('id' in params)) {
      res.send('Missing id in request body');
      return;
    }

    const record = await programmer.findByPk(params.id);

    if (!record) {
      res.send('Programmer ID not found');
      return;
    }

    await record.destroy();
    res.send(`${record.id} ${record.name} - Deleted successfully.`);
  } catch (error) {
    res.send(error);
  }
});

app.put('/updateProgrammer', async (req, res) => {
  try {
    const params = req.body;
    const properties = ['id', 'name', 'javascript', 'java', 'python'];
    const check = properties.every((property) => {
      return property in params;
    });
    if (!check) {
      const propStr = properties.join(', ');
      res.send(`All parameters needed to update a programmer must be sent: ${propStr}`);
      return;
    }

    const existingProgrammer = await programmer.findByPk(params.id);
    if (!existingProgrammer) {
      res.send('Programmer ID not found');
      return;
    }

    existingProgrammer.name = params.name;
    existingProgrammer.javascript = params.javascript;
    existingProgrammer.java = params.java;
    existingProgrammer.python = params.python;

    await existingProgrammer.save();

    res.send(existingProgrammer);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
