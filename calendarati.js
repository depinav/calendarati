// TODO: Make vars more distinct, better names!

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
    currentDate: {}
  },
  tempDate = new Date();

  theCal.currentDate = new Date();

  var buildCalendar = function(_date) {
    var currentFullYear = _date.getFullYear(),
        currentMonth = MONTHS[_date.getMonth()],
        daysOfMonth = buildDays(_date.getMonth(), currentFullYear),
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

    yearEl.appendChild(document.createTextNode(currentFullYear));
    monthEl.appendChild(document.createTextNode(currentMonth));
    daysEl.appendChild(daysOfMonth);
    leftArrowEl.appendChild(document.createTextNode('<'));
    rightArrowEl.appendChild(document.createTextNode('>'));

    topSectionEl.appendChild(leftArrowEl);
    topSectionEl.appendChild(monthEl);
    topSectionEl.appendChild(yearEl);
    topSectionEl.appendChild(rightArrowEl);
    bottomSectionEl.appendChild(daysOfMonth);

    calEl.appendChild(topSectionEl);
    calEl.appendChild(bottomSectionEl);
    calEl.setAttribute('class', 'calendarati-right-section group');
    return calEl.outerHTML;
  }

  var buildDateSection = function(date) {
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
// TODO: Add active class to currently seclected day
    var dateBasedOnMonthYear = new Date(year, month, 1),
        daysOfMonth = document.createElement('table');

    daysOfMonth.className = 'calendarati-days';

    var dayHeader = document.createElement('tr');

    // create days of the week header
    DAYS.forEach(function(day) {
      var theDay = document.createElement('th'),
      dayRow;
      theDay.appendChild(document.createTextNode(day[0]));
      dayHeader.appendChild(theDay);
    });

    daysOfMonth.appendChild(dayHeader);

    // Loop through each day of a given month
    while (dateBasedOnMonthYear.getMonth() === month) {

      var theDate = new Date(dateBasedOnMonthYear).getDate(),
      currDay = new Date(dateBasedOnMonthYear).getDay();

      // create a new row if it's the first of the month, or first day of the week
      if(theDate === 1 || currDay === 0) {
        dayRow = document.createElement('tr');
      }

      var dateTmp = new Date(year, month, dateBasedOnMonthYear.getDate() + 1) // Use dateTmp to store the next day for a conditional below
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

      // Check if the day is the currently selected day
      if(theDate === theCal.getCurrentDate().getDate() &&
        dateBasedOnMonthYear.getMonth() === theCal.getCurrentDate().getMonth() &&
        dateBasedOnMonthYear.getFullYear() === theCal.getCurrentDate().getFullYear()) {
        // Remove currently active day
        var currentlyActiveDate = document.querySelector('.active');
        if(currentlyActiveDate) {
          removeClass(currentlyActiveDate, 'active');
        }

        addClass(dayData, 'active');
      }

      dayRow.appendChild(dayData);

      if(dateTmp.getMonth() !== month && currDay != 6) { // If it's the last day of the month pad the days after the end
      for(var i = currDay; i < 6; i++) {
        // creates an empty td element for blank days
        dayRow.appendChild(document.createElement('td'));
      }
    }

    // If this is the last day of the week, add the row to the table
    if(currDay === 6 || dateTmp.getMonth() !== month) {
      daysOfMonth.appendChild(dayRow);
    }

    dateBasedOnMonthYear.setDate(dateBasedOnMonthYear.getDate() + 1);
  }

  return daysOfMonth;
}

theCal.cal = function(element) {
  var date = theCal.getCurrentDate();
  element.className = 'calendarati group';
  element.innerHTML = buildDateSection(date);
  element.innerHTML += buildCalendar(date);

  var cal = document.querySelector('.calendarati');
  cal.addEventListener('click', eventDelegate);

  document.onkeydown = function(event) {
    event = event || window.event;

    switch(event.keyCode) {
      case 37: // Left
        leftArrowMovement();
        break;
      case 39: // Right
        rightArrowMovement();
        break;
      default:
        break;
    }
  }
}

theCal.getCurrentDate = function() {
  return theCal.currentDate;
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

  // Using delegate pattern to switch between handlers
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
  theCal.currentDate = _date;
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

function rightArrowMovement() {
  var theDate = tempDate;
  theDate.setMonth(theDate.getMonth() +1);
  var el = document.querySelector('.calendarati-right-section');
  el.outerHTML = buildCalendar(theDate);
}

function leftArrowMovement() {
  var theDate = tempDate;
  theDate.setMonth(theDate.getMonth() -1);
  var el = document.querySelector('.calendarati-right-section');
  el.outerHTML = buildCalendar(theDate);
}

function removeClass(_element, _className) {
  // TODO: Figure out why classReplace doesn't work but adding the regex hardcoded does??
  var classReplace = new RegExp('/(?:^|\s)' + _className + '(?!\S)/g');
  _element.className = _element.className.replace(/(?:^|\s)active(?!\S)/ , '' );
}

function addClass(_element, _className) {
  _element.className += ' ' + _className;
}

// Event functions, delegated from eventDelegate
function daysHandler(_target) {
  var theDate = tempDate;

  var day = parseInt(_target.id.split('-')[2]);
  setCurrentDate(new Date(theDate.getFullYear(), theDate.getMonth(), day));

  // Remove currently active day
  var currentlyActiveDate = document.querySelector('.active');
  if(currentlyActiveDate) {
    removeClass(currentlyActiveDate, 'active');
  }

  addClass(_target, 'active');

  var el = document.querySelector('.calendarati-left-section');
  el.outerHTML = buildDateSection(theCal.getCurrentDate())
}

function arrowHandler(_target) {

  if(/\w+-right-\w+/.test(_target.classList[0])) {
    rightArrowMovement();
  } else {
    leftArrowMovement();
  }
}
// End of event functions
})();
