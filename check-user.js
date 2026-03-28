const mongoose = require('mongoose');
const uri = "mongodb+srv://getu4ever_db_user:0JpJfaEpza3z3Imr@admin.mvlx4wp.mongodb.net/office-lunch";

mongoose.connect(uri)
  .then(async () => {
    const user = await mongoose.connection.db.collection('users').findOne({ 
      email: /info@karoldigital.co.uk/i 
    });
    console.log('\n--- DATABASE RESULT ---');
    if (user) {
      console.log('Email in DB:', user.email);
      console.log('Role:', user.role);
      console.log('Has Password:', !!user.password);
    } else {
      console.log('USER NOT FOUND IN DB');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
