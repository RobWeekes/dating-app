const express = require('express');
const router = express.Router();
const { Preference } = require('../../models');

// GET all preferences
router.get('/', async (req, res) => {
  try {
    const preferences = await Preference.findAll();
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET preference by ID
router.get('/:id', async (req, res) => {
  try {
    const preference = await Preference.findByPk(req.params.id);

    if (!preference) {
      return res.status(404).json({ error: 'Preference not found' });
    }

    res.json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET preference by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const preference = await Preference.findOne({
      where: { userId: req.params.userId }
    });

    if (!preference) {
      return res.status(404).json({ error: 'Preference not found for this user' });
    }

    res.json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new preference
router.post('/', async (req, res) => {
  try {
    const { userId, minAge, maxAge, location, locationRadius, interests, relationshipType } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if preference already exists for this user
    const existingPreference = await Preference.findOne({ where: { userId } });
    if (existingPreference) {
      return res.status(409).json({ error: 'Preference already exists for this user' });
    }

    const preference = await Preference.create({
      userId,
      minAge: minAge || 18,
      maxAge: maxAge || 65,
      location,
      locationRadius,
      interests,
      relationshipType
    });

    res.status(201).json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE preference by ID
router.put('/:id', async (req, res) => {
  try {
    const preference = await Preference.findByPk(req.params.id);

    if (!preference) {
      return res.status(404).json({ error: 'Preference not found' });
    }

    const { minAge, maxAge, location, locationRadius, interests, relationshipType } = req.body;

    await preference.update({
      minAge: minAge !== undefined ? minAge : preference.minAge,
      maxAge: maxAge !== undefined ? maxAge : preference.maxAge,
      location: location || preference.location,
      locationRadius: locationRadius !== undefined ? locationRadius : preference.locationRadius,
      interests: interests || preference.interests,
      relationshipType: relationshipType || preference.relationshipType
    });

    res.json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE preference by user ID
router.put('/user/:userId', async (req, res) => {
  try {
    const preference = await Preference.findOne({
      where: { userId: req.params.userId }
    });

    if (!preference) {
      return res.status(404).json({ error: 'Preference not found for this user' });
    }

    const { minAge, maxAge, location, locationRadius, interests, relationshipType } = req.body;

    await preference.update({
      minAge: minAge !== undefined ? minAge : preference.minAge,
      maxAge: maxAge !== undefined ? maxAge : preference.maxAge,
      location: location || preference.location,
      locationRadius: locationRadius !== undefined ? locationRadius : preference.locationRadius,
      interests: interests || preference.interests,
      relationshipType: relationshipType || preference.relationshipType
    });

    res.json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE preference by ID
router.delete('/:id', async (req, res) => {
  try {
    const preference = await Preference.findByPk(req.params.id);

    if (!preference) {
      return res.status(404).json({ error: 'Preference not found' });
    }

    await preference.destroy();
    res.json({ message: 'Preference deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
