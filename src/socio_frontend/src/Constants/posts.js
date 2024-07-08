import faker from "faker";
// Create an array of 20 entries
const posts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  imageUrl: `https://picsum.photos/seed/${i + 1}/500/500`, // Generate a random image URL
  caption: faker.lorem.sentence(), // Generate a random sentence for the caption
}));

export default posts;