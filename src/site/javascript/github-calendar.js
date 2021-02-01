const setCalendarStyles = (weeklyContributions, weeks) => {
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

window.onload = async function() {
  console.log('githubKey ', "{{ github.githubKey}}");
  // change background color when user refreshes page
  const root = document.documentElement;

  const backgroundColors = [
    'rgb(226, 181, 147)',
    'rgb(220, 220, 220)',
    'rgb(153, 170, 145)',
    'rgb(86, 124, 160)',
    'rgb(248, 129, 251)',
  ];

  const textColors = [
    'rgb(46, 37, 26)',
    'rgb(0, 0, 0)',
    'rgb(50, 51, 25)',
    'rgb(178, 184, 205)',
    'rgb(27, 65, 200)'
  ]

  const hoverColors = [
    'rgba(46, 37, 26, .3)',
    'rgba(0, 0, 0, .3)',
    'rgba(50, 51, 25, .3)',
    'rgba(178, 184, 205, .3)',
    'rgba(27, 65, 200, .3)'
  ];

  const startColorRotation = () => {
    console.log('new color')
    const randomNumber = Math.floor(Math.random() * backgroundColors.length);
    root.style.setProperty('--background-color', backgroundColors[randomNumber]);
    root.style.setProperty('--text-color', textColors[randomNumber])
    root.style.setProperty('--border-color', textColors[randomNumber])
    root.style.setProperty('--hover-color', hoverColors[randomNumber])
  }

  setInterval(startColorRotation, 10000)

  const calendarObject = document.getElementById('calendar');

  const calendarDocument = calendarObject.contentDocument;
  const calendarSVG = calendarDocument.getElementById('github-calendar');
  const weeks = calendarSVG.getElementsByTagName('g')

  // setCalendarStyles(weeklyContributions, weeks);
}