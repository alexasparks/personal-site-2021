require('dotenv').config();
const Nunjucks = require('nunjucks');

module.exports = function(eleventyConfig) {
    const nunjucksEnvironment = new Nunjucks.Environment( new Nunjucks.FileSystemLoader('_includes'));
    eleventyConfig.setLibrary('njk', nunjucksEnvironment);

    eleventyConfig.addPassthroughCopy('public');
    eleventyConfig.addPassthroughCopy('javascript');
}