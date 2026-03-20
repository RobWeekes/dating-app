'use strict';

const bcrypt = require('bcryptjs');

// Sample name pools for diverse test data
const firstNames = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Raymond', 'Patrick', 'Alexander', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Walter', 'Harold', 'Jeremy', 'Keith', 'Samuel', 'Willie', 'Ralph', 'Roy', 'Russell', 'Louis', 'Philip', 'Johnny', 'Ernest', 'Martin', 'Randall', 'Vincent', 'Ralph', 'Eugene', 'Russell', 'Elmer', 'Wayne', 'Billy', 'Harry', 'Joe', 'Jesse', 'David'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen', 'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen', 'Samantha', 'Katherine', 'Christine', 'Debra', 'Rachel', 'Catherine', 'Carolyn', 'Janet', 'Ruth', 'Maria', 'Heather', 'Diane', 'Virginia', 'Julie', 'Joyce', 'Victoria', 'Olivia', 'Kelly', 'Christina', 'Lauren', 'Joan', 'Evelyn', 'Judith', 'Megan', 'Andrea', 'Cheryl', 'Hannah', 'Jacqueline', 'Martha', 'Gloria', 'Teresa', 'Ann', 'Sara', 'Madison', 'Frances', 'Kathryn', 'Janice', 'Jean', 'Alice', 'Abigail', 'Sophia', 'Judith', 'Rose', 'Denise', 'Marilyn', 'Amber', 'Beverly', 'Diana', 'Danielle', 'Magnolia', 'Brittany', 'Charlotte', 'Marie', 'Kayla', 'Alexis'],
};

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Garcia', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hall', 'Rivera', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Rogers', 'Morgan', 'Peterson', 'Cooper', 'Reed', 'Bell', 'Gomez', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Cox', 'Peterson', 'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harper', 'Mason', 'Hodges', 'Gill', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele', 'Curry', 'Powers', 'Schultz', 'Vazquez', 'Franco', 'Solis', 'Vargas', 'Fuentes'];

const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Austin', 'Memphis', 'Boston', 'Seattle', 'Denver', 'Washington DC', 'Atlanta', 'Miami', 'Portland', 'Las Vegas', 'Minneapolis', 'Nashville', 'Detroit', 'New Orleans', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Long Beach', 'Kansas City', 'Mesa', 'Virginia Beach', 'Atlanta', 'Colorado Springs', 'Raleigh', 'Omaha', 'Miami', 'Long Beach', 'Cleveland', 'Plano', 'Orlando', 'Chula Vista'];

const bios = [
  'Adventure seeker and coffee enthusiast. Love hiking and trying new restaurants.',
  'Yoga instructor who loves outdoor activities and meaningful conversations.',
  'Software engineer by day, foodie by night. Always looking for the best tacos.',
  'Travel junkie! Have been to 20 countries and counting. Let\'s explore together.',
  'Artist and musician. Passionate about creativity and self-expression.',
  'Fitness enthusiast. CrossFit, running, and staying healthy.',
  'Book lover and philosophy nerd. Enjoy deep conversations over wine.',
  'Dog parent of two. Beach lover and sunset chaser.',
  'Entrepreneur with a passion for startups and innovation.',
  'Photography enthusiast capturing life\'s beautiful moments.',
  'Cooking is my love language. Let\'s meal prep together.',
  'Rock climbing and outdoor gear nerd. Always planning the next trip.',
  'Yoga and meditation enthusiast. Into holistic wellness.',
  'Live music fanatic. You\'ll find me at concerts on weekends.',
  'Volunteer at local animal shelter. Animal lover for life.',
  'Marathon runner training for my next big race.',
  'Movie buff with an unhealthy obsession with documentaries.',
  'Gamer and tech enthusiast. Into both retro and latest games.',
  'Gardening enthusiast. Growing my own veggies and herbs.',
  'Jazz music lover. Enjoy live performances and vinyl records.',
  'Parkour and movement enthusiast. Free runner at heart.',
  'Writer and blogger. Love storytelling and creative writing.',
  'Sustainability advocate. Trying to live a zero-waste life.',
  'Salsa dancer. You\'ll find me on the dance floor every weekend.',
  'Meditation and mindfulness practitioner. Mental health matters.',
  'Business owner passionate about helping others succeed.',
  'Science nerd. Fascinated by space and all things cosmos.',
  'Mountain biker. Nothing beats a good trail and fresh air.',
  'Craft beer enthusiast. Always exploring new breweries.',
  'Dance instructor. Life is better when you dance.',
];

const politics = ['Progressive Left', 'Moderate Left', 'Independent', 'Moderate Right', 'Traditional Conservative'];
const religions = ['Not religious', 'Christian', 'Catholic', 'Protestant', 'Baptist', 'Jewish Orthodox', 'Jewish Reform', 'Muslim', 'Hindu', 'Agnostic', 'Atheist'];
const ethnicities = ['White', 'Black/African American', 'Hispanic/Latino', 'Asian', 'Native American', 'Pacific Islander', 'Middle Eastern/North African', 'Mixed Race', 'Other'];
const bodyTypes = ['Thin', 'Average', 'Athletic/Toned', 'Muscular', 'Curvy', 'Plump', 'Big & Beautiful'];
const familyStatuses = ['Single/Never Married', 'Divorced with Children', 'Divorced No Children'];
const familyGoals = ["Don't Want Kids/Any More Kids", 'Want Kids/More Kids'];

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate 1000 test users
    const users = [];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('TestPass123!', salt);

    for (let i = 1; i <= 1000; i++) {
      const isMale = Math.random() > 0.5;
      const firstName = isMale ? firstNames.male[Math.floor(Math.random() * firstNames.male.length)] : firstNames.female[Math.floor(Math.random() * firstNames.female.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomNumber = Math.floor(Math.random() * 100000);

      users.push({
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@datingapp.com`,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        age: Math.floor(Math.random() * (65 - 18 + 1)) + 18,
        bio: bios[Math.floor(Math.random() * bios.length)],
        location: cities[Math.floor(Math.random() * cities.length)],
        profilePhotoUrl: null,
        bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
        bmi: (Math.random() * (30 - 18) + 18).toFixed(2),
        politics: politics[Math.floor(Math.random() * politics.length)],
        religion: religions[Math.floor(Math.random() * religions.length)],
        ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
        family: familyStatuses[Math.floor(Math.random() * familyStatuses.length)],
        familyGoals: familyGoals[Math.floor(Math.random() * familyGoals.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log('📝 Inserting 1000 test users...');
    await queryInterface.bulkInsert('users', users);
    console.log('✅ Successfully created 1000 test users');
  },

  async down(queryInterface, Sequelize) {
    console.log('🗑️  Removing all test users...');
    await queryInterface.bulkDelete('users', null, {});
    console.log('✅ Successfully removed all test users');
  },
};
