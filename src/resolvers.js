const { PubSub } = require('apollo-server');
const books = require('./dummybooks.js');
const pubsub = new PubSub();

const LINK_ADDED = 'LINK_ADDED';

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}];

let idCount = links.length;

function link(parent, args) {
  console.log("debug Query link received with args: ", args);
  return links.find((link=>link.id === args.id));
}

const Query = {
    info: () => `This is the API of a Hackernews Clone`,
    books: () => books,
    feed: () => links,
    link,
};

const Mutation = {
  post: (parent, args) => {
    console.log("\n\n\ndebug Mutation post received with args: ", args);

    const link = {
      id: `link-${idCount++}`,
      description: args.description,
      url: args.url,
    };

    links.push(link);

    pubsub.publish(LINK_ADDED, { newLink: link });

    return link;
  },
  updateLink: (parent, args) => {
    console.log("\n\n\ndebug Mutation updateLink received with args: ", args);
    const updatedLink = {
      id: args.id,
      description: args.description,
      url: args.url,
    };
    const linkIndex = links.findIndex((link => link.id === updatedLink.id));

    if (linkIndex < 0) {
      throw new Error(`id ${updatedLink.id} not found.`);
    }

    const currentLink = links[linkIndex];
    links[linkIndex] = {
      ...updatedLink
    }

    return links[linkIndex];  

  },
  deleteLink: (parent, args) => {
    console.log("\n\n\ndebug Mutation deleteLink received with args: ", args);
    console.log("debug Mutation deleteLink link size before: ", links.length);
    const linkIndex = links.findIndex((link => link.id === args.id));

    if (linkIndex < 0) {
      throw new Error(`id ${args.id} not found.`);
    }

    links.splice(linkIndex, 1);
    console.log("debug Mutation deleteLink link size after : ", links.length);
    
    return 'deleted.';
  }
};

const Subscription = {
    newLink: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([LINK_ADDED]),
    },
};

// resolvers
module.exports = {
  Query,
  Mutation,
  Subscription,
};

