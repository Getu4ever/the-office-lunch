const mongoose = require('mongoose');
const uri = "mongodb+srv://getu4ever_db_user:0JpJfaEpza3z3Imr@admin.mvlx4wp.mongodb.net/office-lunch";

mongoose.connect(uri)
  .then(async () => {
    const emails = ['getu4ever@gmail.com', 'orders@sandwichplatterdelivery.co.uk'];
    const users = await mongoose.connection.db.collection('users').find({ 
      email: { $in: emails } 
    }).toArray();

    console.log('\n--- ADMIN DATABASE STATUS ---');
    if (users.length === 0) {
      console.log('RESULT: No admin users found with those emails.');
    } else {
      users.forEach(u => {
        console.log(`Email: ${u.email}`);
        console.log(`Role: ${u.role}`);
        console.log(`Has Password: ${!!u.password}`);
        console.log('---------------------------');
      });
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
