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

// we want to clear localStorage after an hour
const expiration = new Date();
const hour = expiration.setHours(expiration.getHours() + 1);

const fetchContributionData = (weeks) => {
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

  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer f5ed5bc6d4753de446587c263051349c14cf3cbd',
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((response) => response.json())
    .then((data) => {
      const dataJSON = JSON.stringify(data);
      const parsedData = JSON.parse(dataJSON);

      window.localStorage.setItem('calendar-json', dataJSON);

      window.localStorage.setItem('expiration', hour);

      setCalendarStyles(parsedData, weeks);
    })
}

window.onload = function() {
  // clear localStorage after an hour
  if (new Date().getHours() >= expiration.getHours()) {
    window.localStorage.removeItem('calendar-json');
    window.localStorage.removeItem('expiration');
  }

  const calendarObject = document.getElementById('calendar');
  const calendarDocument = calendarObject.contentDocument;
  const calendarSVG = calendarDocument.getElementById('github-calendar');

  const weeks = calendarSVG.getElementsByTagName('g')

  const cachedCalendarData = window.localStorage.getItem('calendar-json');

  if (cachedCalendarData) {
    setCalendarStyles(JSON.parse(cachedCalendarData), weeks);
  } else {
    fetchContributionData(weeks);
  }
}