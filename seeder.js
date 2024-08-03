// seeder.js
const User = require('./models/User');

const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const admin = new User({
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  });

  try {
    await admin.save();
    console.log('Admin user created');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = seedAdmin;
