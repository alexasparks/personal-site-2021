require('dotenv').config();
const Nunjucks = require('nunjucks');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('src/site/public');
    eleventyConfig.addPassthroughCopy('src/site/javascript');

    return {
      dir: {
        input: 'src/site',
        output: 'dist',
        data: '_data',
        layouts: '_includes'
      },
      templateFormats : ['njk', 'md'],
      htmlTemplateEngine : 'njk',
      markdownTemplateEngine : 'njk',
      passthroughFileCopy: true,
      githubKey: process.env.GITHUB_TOKEN,
    }
}