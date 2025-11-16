Migrations Created:

20251116092338-create-users.js - Creates Users table with:

id (primary key)
email (unique, validated)
firstName, lastName, age, bio, location
profilePhotoUrl
timestamps (createdAt, updatedAt)

20251116092628-create-questionnaires.js - Creates Questionnaires table with:

id (primary key)
userId (foreign key to Users, cascades on delete)
personalityType, interests (JSON), datingGoal
relationshipType, responses (JSON)
timestamps

20251116092629-create-preferences.js - Creates Preferences table with:

id (primary key)
userId (unique foreign key to Users, cascades on delete)
minAge, maxAge, location, locationRadius
interests (JSON), relationshipType
timestamps

20251116092629-create-answers.js - Creates Answers table with:

id (primary key)
questionnaireId (foreign key to Questionnaires, cascades on delete)
questionId, answer (text)
timestamps
