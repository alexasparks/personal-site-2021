const setCalendarStyles = (calendarData, weeks) => {
  // Set Calendar Data attributes
  const weeklyContributions = calendarData?.data?.user?.contributionsCollection?.contributionCalendar?.weeks
  ?.map((week) => week.contributionDays)

  const numDaysInAWeek = [0, 1, 2, 3, 4, 5, 6];

  weeklyContributions.forEach((weeklyContribution, index) => {
    numDaysInAWeek.forEach((day) => {
      // weeklyContribution is an array of objects
      const svgWeek = weeks[index];
      const svgWeekDays = svgWeek?.getElementsByTagName('rect');

      if (!svgWeekDays) {
        return;
      }

      const contributionDay = weeklyContribution[day];
      if (contributionDay) {
        svgWeekDays[contributionDay.weekday].setAttribute('data-date', contributionDay.date);
        svgWeekDays[contributionDay.weekday].setAttribute('data-contribution-count', contributionDay.contributionCount);

        if (contributionDay.contributionCount >= 1) {
          svgWeekDays[contributionDay.weekday].setAttribute('fill', 'var(--second-least)');
        }

        if (contributionDay.contributionCount >= 5) {
          svgWeekDays[contributionDay.weekday].setAttribute('fill', 'var(--third-most)');
        }

        if (contributionDay.contributionCount >= 10) {
          svgWeekDays[contributionDay.weekday].setAttribute('fill', 'var(--second-most)');
        }

        if (contributionDay.contributionCount >= 15) {
          svgWeekDays[contributionDay.weekday].setAttribute('fill', 'var(--most)');
        }
      }
    })
  })
}

const fetchContributionData = async () => {
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
      Authorization: `Bearer 30481c6f8a3b51c60b6245fd2541ef0ba95d3bf9`,
      'Content-Type': 'application/json',
    },
    body,
  })
    .catch((error) => console.error(error));

  const responseJSON = await response.json();

  return responseJSON;
}

window.onload = function() {
  // change background color when user refreshes page
  const root = document.documentElement;

  const backgroundColors = [
    'rgb(221, 132, 52)',
    'rgb(254, 204, 192)',
    'rgb(226, 181, 147)',
    'rgb(220, 220, 220)',
    'rgb(153, 170, 145)',
    'rgb(86, 124, 160)',
    'rgb(248, 129, 251)',
  ];

  const textColors = [
    'rgb(54, 55, 36)',
    'rgb(180, 11, 17)',
    'rgb(46, 37, 26)',
    'rgb(0, 0, 0)',
    'rgb(50, 51, 25)',
    'rgb(178, 184, 205)',
    'rgb(27, 65, 200)'
  ]

  const hoverColors = [
    'rgba(54, 55, 36, .3)',
    'rgba(180, 11, 17, .3)',
    'rgba(46, 37, 26, .3)',
    'rgba(0, 0, 0, .3)',
    'rgba(50, 51, 25, .3)',
    'rgba(178, 184, 205, .3)',
    'rgba(27, 65, 200, .3)'
  ];
  const randomNumber = Math.floor(Math.random() * backgroundColors.length);
  root.style.setProperty('--background-color', backgroundColors[randomNumber]);
  root.style.setProperty('--text-color', textColors[randomNumber])
  root.style.setProperty('--border-color', textColors[randomNumber])
  root.style.setProperty('--hover-color', hoverColors[randomNumber])

  const calendarObject = document.getElementById('calendar');

  console.log('calendarObject.contentDocument', calendarObject.contentDocument)
  calendarObject.addEventListener('load', function() {
    const calendarDocument = calendarObject.contentDocument;
    console.log('calendarDocument', calendarDocument)
    const calendarSVG = calendarDocument.getElementById('github-calendar');
    const weeks = calendarSVG.getElementsByTagName('g')
    console.log('weeks', weeks)
    const contributionData = Promise.resolve(fetchContributionData());
    console.log('contributionData', contributionData)
    setCalendarStyles(contributionData, weeks);
  })
}