const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fakeSpotify', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
  console.log('connected to DB!');
});

const artistSchema = new mongoose.Schema({
  name: String,
  bio: String,
  relatedArtists: { type: Array, default: [] },
  imageUrl: String,
});
const Artist = mongoose.model('Artist', artistSchema);

const albumSchema = new mongoose.Schema({
  title: String,
  artistId: String,
  songs: { type: Array, default: [] },
  featuredArtists: { type: Array, default: [] },
  type: String,
  imageUrl: String,
});
const Album = mongoose.model('Album', albumSchema);

const songSchema = new mongoose.Schema({
  title: String,
  artistId: String,
  albumId: String,
  featuredArtists: { type: Array, default: [] },
  mp3: String,
  duration: Number, // in seconds
  listens: Number,
  explicit: Boolean,

});
const Song = mongoose.model('Song', songSchema);

//gets the top 5 songs by listens
const getTopFive = function() {
  var songs = Song.find();
  songs.sort({listens: 'desc'});
  songs.limit(5);
  //songs = getImages(songs);
  return songs;
}

// const getImages = function(songs) {
//   console.log('get a request for images', songs)
//   songs.forEach(function(song) {
//     var image = getAlbumImage(song);
//     song.imageUrl = image.imageUrl
//   })
//   return songs;
// }

const getAlbumImage = function(id) {
  var query = Album.findById(id);
  query.select('imageUrl');
  return query;
}

module.exports = {
  Artist: Artist,
  Album: Album,
  Song: Song,
  getTopFive: getTopFive,
  getAlbumImage: getAlbumImage
};
