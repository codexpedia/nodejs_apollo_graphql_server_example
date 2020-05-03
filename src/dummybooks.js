const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

for (let i=0; i<1000; i++) {
  books.push({
    title: `Title: ${i}`,
    author: `Author: ${i}`,
  });
}

module.exports = books