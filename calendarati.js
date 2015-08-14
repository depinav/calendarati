var calendarati = (function() {
  var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  theCal = {
    date: {}
  };

  theCal.date = new Date();

  var buildCalendar = function(date) {
    var year = date.getFullYear(),
        month = MONTHS[date.getMonth()],
        days = buildDays(date.getMonth(), year),
        calEl = document.createElement('div'),
        yearEl = document.createElement('div'),
        monthEl = document.createElement('div'),
        daysEl = document.createElement('div'),
        leftArrowEl = document.createElement('div'),
        rightArrowEl = document.createElement('div'),
        topSectionEl = document.createElement('div'),
        bottomSectionEl = document.createElement('div'),
        rightSectionEl = document.createElement('div');

    rightArrowEl.setAttribute('class', 'calendarati-right-arrow inline');
    leftArrowEl.setAttribute('class', 'calendarati-left-arrow inline');
    yearEl.setAttribute('class', 'calendarati-year inline');
    monthEl.setAttribute('class', 'calendarati-month inline');
    topSectionEl.setAttribute('class', 'calendarati-top-section');
    bottomSectionEl.setAttribute('class', 'calendarati-bottom-section');

    yearEl.appendChild(document.createTextNode(year));
    monthEl.appendChild(document.createTextNode(month));
    daysEl.appendChild(days);
    leftArrowEl.appendChild(document.createTextNode('<'));
    rightArrowEl.appendChild(document.createTextNode('>'));

    topSectionEl.appendChild(leftArrowEl);
    topSectionEl.appendChild(monthEl);
    topSectionEl.appendChild(yearEl);
    topSectionEl.appendChild(rightArrowEl);
    bottomSectionEl.appendChild(days);

    calEl.appendChild(topSectionEl);
    calEl.appendChild(bottomSectionEl);
    calEl.setAttribute('class', 'calendarati-right-section group');
    return calEl.outerHTML;
  }

  var buildDateSection = function(date) {
    // TODO: I need the day of the week
    // TODO: I need the day of the month
    var day = DAYS[date.getDay()],
        theDate = date.getDate(),
        dayEl = document.createElement('div'),
        dateEl = document.createElement('div'),
        dateSectionEl = document.createElement('div'),
        topSectionEl = document.createElement('div'),
        bottomSectionEl = document.createElement('div');

    topSectionEl.setAttribute('class', 'date-top-section');
    bottomSectionEl.setAttribute('class', 'date-bottom-section');
    dayEl.setAttribute('class', 'date-section-day');
    dateEl.setAttribute('class', 'date-section-date');

    dayEl.appendChild(document.createTextNode(day));
    dateEl.appendChild(document.createTextNode(theDate));

    topSectionEl.appendChild(dayEl);
    bottomSectionEl.appendChild(dateEl);

    dateSectionEl.appendChild(topSectionEl);
    dateSectionEl.appendChild(bottomSectionEl);
    dateSectionEl.setAttribute('class', 'calendarati-left-section group');
    return dateSectionEl.outerHTML;
  }

  /*
  * 1 - Get date object for current month, year starting at the first day
  * 2 - Create div element and store it in days; this will be our days component for the month component
  * 3 - Loop through the days until the month reaches the next month
  * 3.1 - Get the current day
  * 3.2 - Create a new div element for the day
  * 3.3 - Add an id to this div
  * 3.4 - Append the day as a text node into the new div
  * 3.5 - Append this div into the 'days' div
  * 3.6 - Get the next day
  * @return {object} days this is an object representation of the div element with the days of the month
  */

  var buildDays = function(month, year) {
    var date = new Date(year, month, 1),
        days = document.createElement('table');

    days.addEventListener('click', function(event, target) {
      var target = event.target || event.srcElement
      console.log('hello');
      stopPropagation(event);
    });
    days.className = 'calendarati-days';

    var dayHeader = document.createElement('tr');

    // create days of the week header
    DAYS.forEach(function(day) {
      var theDay = document.createElement('th'),
      dayRow;
      theDay.appendChild(document.createTextNode(day[0]));
      dayHeader.appendChild(theDay);
    });

    days.appendChild(dayHeader);

    while (date.getMonth() === month) {

      var theDate = new Date(date).getDate(),
      currDay = new Date(date).getDay();

      // create a new row if it's the first of the month, or first day of the week
      if(theDate === 1 || currDay === 0) {
        dayRow = document.createElement('tr');
      }

      var dateTmp = new Date(year, month, date.getDate() + 1) // Use dateTmp to store the next day for a conditional below
      // Pad the days before the first if the first of the month falls after the first day of the week
      if(theDate === 1 && currDay != 0) {
        for(var i = 0; i < currDay; i++) {
          // creates an empty td element for blank days
          dayRow.appendChild(document.createElement('td'));
        }
      }

      // creates a new td element and adds the date to it
      var dayData = document.createElement('td');
      dayData.appendChild(document.createTextNode(theDate))
      dayData.id = 'calendarati-day-' + theDate;
      dayData.className = 'calendarati-day';
      dayRow.appendChild(dayData);

      if(dateTmp.getMonth() !== month && currDay != 6) { // If it's the last day of the month pad the days after the end
      for(var i = currDay; i < 6; i++) {
        // creates an empty td element for blank days
        dayRow.appendChild(document.createElement('td'));
      }
    }

    // If this is the last day of the week, add the row to the table
    if(currDay === 6 || dateTmp.getMonth() !== month) {
      days.appendChild(dayRow);
    }

    date.setDate(date.getDate() + 1);
  }

  return days;
}

theCal.cal = function(element) {
  var date = theCal.getCurrentDate();
  setCurrentDate(date);
  element.className = 'calendarati group';
  element.innerHTML = buildDateSection(date);
  element.innerHTML += buildCalendar(date);

  var cal = document.querySelector('.calendarati');
  cal.addEventListener('click', eventDelegate);
}

theCal.getCurrentDate = function() {
  return theCal.date;
};

return theCal;

// Helper Functions
function eventDelegate(event) {

  var target = event.target || event.srcElement,
      daysTest = /calendarati-day-\d+/,
      arrowTest = /calendarati-\w+-arrow/i,
      isDays = daysTest.test(target.id),
      isArrow = arrowTest.test(target.classList[0]),
      component = isDays && 'day' || isArrow && 'arrow';

  switch(component) {
    case 'day':
      daysHandler(target);
      break;
    case 'arrow':
      arrowHandler(target);
      break;
    default:
      break;
  }
  stopPropagation(event)
}

function setCurrentDate(_date) {
  theCal.date = _date;
}

function stopPropagation(event) {
 event = event || window.event // cross-browser event

 if (event.stopPropagation) {
  // W3C standard variant
  event.stopPropagation()
 } else {
  // IE variant
  event.cancelBubble = true
 }
}

// Event functions, delegated from eventDelegate
function daysHandler(_target) {
  var theDate = theCal.getCurrentDate();

  var day = parseInt(_target.id.split('-')[2]);
  setCurrentDate(new Date(theDate.getFullYear(), theDate.getMonth(), day));

  var el = document.querySelector('.calendarati');
  theCal.cal(el);
}

function arrowHandler(_target) {
  var theDate = theCal.getCurrentDate();

  if(/\w+-right-\w+/.test(_target.classList[0])) {
    theDate.setMonth(theDate.getMonth() +1);
    setCurrentDate(theDate);
    var el = document.querySelector('.calendarati');
    theCal.cal(el);
  } else {
    theDate.setMonth(theDate.getMonth() -1);
    setCurrentDate(theDate);
    var el = document.querySelector('.calendarati');
    theCal.cal(el);
  }
}
// End of event functions
})();
