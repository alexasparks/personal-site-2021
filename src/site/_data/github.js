const fetch = require('node-fetch');

module.exports = async () => {
  // @TODO: Update the date string every new year (or think of automated solution)
  const githubQuery = {
    "query" : `{
      user(login: "alexasparks"){
        contributionsCollection(from: "2021-01-01T06:00:00.000Z") {
            totalCommitContributions
            contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    weekday
                  }
                }
            }
        }
      }
    }`
  }

  const body = JSON.stringify(githubQuery);

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body,
  })
    .catch((error) => console.error(error));

  const responseJSON = await response.json();

  const weeklyContributions = responseJSON?.data?.user?.contributionsCollection?.contributionCalendar?.weeks?.map((week) => week.contributionDays)

  return {
    weeklyContributions,
    githubKey: process.env.GITHUB_TOKEN,
  }
}

