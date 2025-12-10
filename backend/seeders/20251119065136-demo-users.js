'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // sample data for generating random users
    const firstNames = [
      'James', 'Michael', 'Robert', 'John', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher',
      'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
      'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
      'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin',
      'Samuel', 'Frank', 'Gregory', 'Alexander', 'Raymond', 'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler',
      'Aaron', 'Jose', 'Adam', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Walter', 'Harold',
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
      'Dorothy', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
      'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen'
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
      'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Peterson', 'Phillips', 'Campbell', 'Parker',
      'Evans', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers',
      'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bell', 'Gomez', 'Munoz', 'Mendoza', 'Bush', 'Medina',
      'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas', 'Fleming', 'Jensen',
      'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May', 'Terry', 'Herrera', 'Wade', 'Soto', 'Walters',
      'Curtis', 'Neal', 'Hamm', 'Dalton', 'Spinoza', 'Salinas', 'Cervantes', 'Corona', 'Bruno', 'Hooper'
    ];

    const bios = [
      'Adventure seeker and coffee enthusiast.',
      'Dog lover who enjoys hiking and outdoor activities.',
      'Foodie exploring LA\'s best restaurants.',
      'Fitness enthusiast and beach lover.',
      'Artist and creative soul looking for inspiration.',
      'Movie buff and couch companion.',
      'Yoga instructor and wellness advocate.',
      'Travel dreamer planning my next adventure.',
      'Music lover who enjoys live performances.',
      'Book reader and literary discussion fanatic.',
      'Tech enthusiast and gadget collector.',
      'Photography hobbyist capturing LA\'s beauty.',
      'Cooking enthusiast experimenting with new recipes.',
      'Gym rat dedicated to health and fitness.',
      'Weekend hiker exploring Southern California trails.',
      'Comedy show attendee and laughter lover.',
      'Volunteer at local animal shelter.',
      'Entrepreneur building my dream business.',
      'Motorcyclist exploring scenic routes.',
      'Wine tasting enthusiast and sommelier wannabe.',
      'Board game night organizer.',
      'Plant parent with a growing collection.',
      'Stand-up comedy fan attending shows weekly.',
      'Athlete training for my next big goal.',
      'Meditation practitioner seeking inner peace.',
      'Night owl enjoying sunset views.',
      'Charity volunteer passionate about giving back.',
      'Car enthusiast and road trip planner.',
      'Fashion-forward and style conscious.',
      'Podcast listener and true crime fanatic.'
    ];

    const neighborhoods = [
      'Downtown LA', 'Santa Monica', 'Venice Beach', 'West Hollywood', 'Silverlake',
      'Los Feliz', 'Echo Park', 'Koreatown', 'Culver City', 'Mar Vista',
      'Manhattan Beach', 'Torrance', 'Long Beach', 'Pasadena', 'Burbank',
      'Glendale', 'Griffith Park', 'Hollywood', 'Sunset Boulevard', 'Beverly Hills',
      'Brentwood', 'Pacific Palisades', 'Malibu', 'Redondo Beach', 'Hermosa Beach'
    ];

    // generate 100 random users
    const users = [];
    for (let i = 0; i < 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
      const bio = bios[Math.floor(Math.random() * bios.length)];
      const age = Math.floor(Math.random() * (100 - 18 + 1)) + 18;  // age between 18 and 100
      
      // create unique email
      const emailBase = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;
      const email = `${emailBase}@datingapp.com`;
      const plainPassword = `Password${i+1}!`;  // simple demo passwords for seeding
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      users.push({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        age: age,
        bio: bio,
        location: `${neighborhood}, Los Angeles, CA`,
        profilePhotoUrl: `https://i.pravatar.cc/150?img=${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
