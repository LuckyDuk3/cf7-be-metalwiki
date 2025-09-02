require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
const Band = require('./models/band.model');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users and bands
    await User.deleteMany({});
    await Band.deleteMany({});
    console.log('Cleared users and bands collections');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      password: adminPassword,
      name: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      roles: ['admin'], 
    });
    await adminUser.save();
    console.log('Created admin user:', adminUser.username);

    // Array of bands
    const bandsData = [
      { name: 'Metallica', genre: 'Thrash Metal', country: 'USA', formationYear: 1981, members: ['James Hetfield','Lars Ulrich','Kirk Hammett','Robert Trujillo'] },
      { name: 'Iron Maiden', genre: 'Heavy Metal', country: 'UK', formationYear: 1975, members: ['Bruce Dickinson','Steve Harris','Dave Murray'] },
      { name: 'Black Sabbath', genre: 'Doom Metal', country: 'UK', formationYear: 1968, members: ['Ozzy Osbourne','Tony Iommi','Geezer Butler'] },
      { name: 'Slayer', genre: 'Thrash Metal', country: 'USA', formationYear: 1981, members: ['Tom Araya','Kerry King','Gary Holt'] },
      { name: 'Megadeth', genre: 'Thrash Metal', country: 'USA', formationYear: 1983, members: ['Dave Mustaine','Kiko Loureiro'] },
      { name: 'Anthrax', genre: 'Thrash Metal', country: 'USA', formationYear: 1981, members: ['Scott Ian','Charlie Benante'] },
      { name: 'Pantera', genre: 'Groove Metal', country: 'USA', formationYear: 1981, members: ['Phil Anselmo','Dimebag Darrell'] },
      { name: 'Judas Priest', genre: 'Heavy Metal', country: 'UK', formationYear: 1969, members: ['Rob Halford','Glenn Tipton'] },
      { name: 'AC/DC', genre: 'Hard Rock', country: 'Australia', formationYear: 1973, members: ['Brian Johnson','Angus Young'] },
      { name: 'Slipknot', genre: 'Nu Metal', country: 'USA', formationYear: 1995, members: ['Corey Taylor','Mick Thomson'] },
      { name: 'Tool', genre: 'Progressive Metal', country: 'USA', formationYear: 1990, members: ['Maynard James Keenan','Adam Jones'] },
      { name: 'Nightwish', genre: 'Symphonic Metal', country: 'Finland', formationYear: 1996, members: ['Tuomas Holopainen','Floor Jansen'] },
      { name: 'Korn', genre: 'Nu Metal', country: 'USA', formationYear: 1993, members: ['Jonathan Davis','Munky'] },
      { name: 'Rammstein', genre: 'Industrial Metal', country: 'Germany', formationYear: 1994, members: ['Till Lindemann','Richard Z. Kruspe'] },
      { name: 'Dimmu Borgir', genre: 'Black Metal', country: 'Norway', formationYear: 1993, members: ['Shagrath','Silenoz'] },
      { name: 'Behemoth', genre: 'Blackened Death Metal', country: 'Poland', formationYear: 1991, members: ['Nergal','Inferno'] },
      { name: 'Opeth', genre: 'Progressive Metal', country: 'Sweden', formationYear: 1990, members: ['Mikael Åkerfeldt','Martin Mendez'] },
      { name: 'Children of Bodom', genre: 'Melodic Death Metal', country: 'Finland', formationYear: 1993, members: ['Alexi Laiho','Jaska Raatikainen'] },
      { name: 'System of a Down', genre: 'Alternative Metal', country: 'USA', formationYear: 1994, members: ['Serj Tankian','Daron Malakian'] },
      { name: 'Evanescence', genre: 'Alternative Metal', country: 'USA', formationYear: 1995, members: ['Amy Lee','Ben Moody'] },
    ];

    // Attach admin as creator
    const bandsWithCreator = bandsData.map(band => ({ ...band, createdBy: adminUser._id }));
    await Band.insertMany(bandsWithCreator);
    console.log(`Created ${bandsWithCreator.length} bands`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
