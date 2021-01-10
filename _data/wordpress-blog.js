const fetch = require('node-fetch');

module.exports = function() {
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

  fetch('https://alexasparks.wpengine.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
    .then((res) => res.json()) // expecting a json response
    .then((json) => {
      console.log("json",)
      const data = json.data;
      console.log("data", data.posts.edges)

    })
    .catch((error) => console.error(error));
}