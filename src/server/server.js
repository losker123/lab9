const express = require('express');
const cors = require('cors');

const sequelize = require("./db");

const { Installations, Reviews, Person } = require("./models");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/reviews', async (req, res) => {
  try {
    const { text, rating } = req.body;
    const newReview = await Reviews.create({ text, rating });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const allReviews = await Reviews.findAll();
    res.status(200).json(allReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/reviews/:id', async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
    } else {
      const { text, rating } = req.body.newReview;
      await review.update({ text, rating });
      res.status(200).json(review);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Reviews.findByPk(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found' });
    } else {
      await review.destroy();
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/persons', async (req, res) => {
  try {
    const persons = await Person.findAll();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/persons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const person = await Person.findByPk(id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/persons', async (req, res) => {
  const { years_of_experience, full_name, contact_information, photo } = req.body;
  try {
    const newPerson = await Person.create({
      years_of_experience,
      full_name,
      contact_information,
      photo,
    });
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/persons/:id', async (req, res) => {
  const { id } = req.params;
  const { years_of_experience, full_name, contact_information, photo } = req.body.PersonId;
  try {
    const person = await Person.findByPk(id);
    if (person) {
      await person.update({
        years_of_experience,
        full_name,
        contact_information,
        photo,
      });
      res.json(person);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/persons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const person = await Person.findByPk(id);
    if (person) {
      await person.destroy();
      res.json({ message: 'Person deleted successfully' });
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/installations', async (req, res) => {
  try {
    const installations = await Installations.findAll({
      include: [{ model: Person }],
    });
    res.json(installations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/installations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const installation = await Installations.findByPk(id);
    if (installation) {
      res.json(installation);
    } else {
      res.status(404).json({ message: 'Installation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/installations', async (req, res) => {
  const { operation_type, system_type, date_time, address } = req.body.newInstallation;
  const { PersonId } = req.body;
  try {
    const newInstallation = await Installations.create({
      operation_type,
      system_type,
      date_time,
      address,
      PersonId
    });
    res.status(201).json(newInstallation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/installations/:id', async (req, res) => {
  const { id } = req.params;
  const { operation_type, system_type, date_time, address } = req.body.editedInstallation;
  console.log(operation_type);
  try {
    const installation = await Installations.findByPk(id);
    if (installation) {
      await installation.update({
        operation_type,
        system_type,
        date_time,
        address,
      });
      res.json(installation);
    } else {
      res.status(404).json({ message: 'Installation not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/installations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const installation = await Installations.findByPk(id);
    if (installation) {
      await installation.destroy();
      res.json({ message: 'Installation deleted successfully' });
    } else {
      res.status(404).json({ message: 'Installation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();


