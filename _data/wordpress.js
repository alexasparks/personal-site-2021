const fetch = require('node-fetch');

module.exports = async function () {
  const body = JSON.stringify({
    query: `{
      posts(first: 10) {
        edges {
          node {
            id
            title
            content
            date
          }
        }
      }
    }`
  })

  const fetchPosts = async () => {
    const response = await fetch('https://alexasparks.wpengine.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .catch((error) => console.error(error))

    const responseJSON = await response.json();
    const data = responseJSON.data;

    return data.posts.edges;
  }

  let posts = await fetchPosts();

  posts = posts.map((post) => {
    const { node } = post;

    return {
      title: node.title,
      id: node.id,
      date: node.date,
      content: node.content,
    }
  })

  return {
    posts,
  }
}