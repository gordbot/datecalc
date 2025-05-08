function getCanadianFederalHolidays(startDate, endDate) {
  const holidays = [];

  // Convert inputs to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Helper function to check if date is in range
  const isInRange = (date) => date >= start && date <= end;

  // Easter calculation using the "Anonymous Gregorian algorithm"
  function calculateEaster(year) {
      const f = Math.floor,
          G = year % 19,
          C = f(year / 100),
          H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
          I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
          J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
          L = I - J,
          month = 3 + f((L + 40) / 44),
          day = L + 28 - 31 * f(month / 4);

      return new Date(year, month - 1, day); // month is 0-based
  }

  // Calculate holidays for each year in range
  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
      const easter = calculateEaster(year);
      const goodFriday = new Date(easter);
      goodFriday.setDate(easter.getDate() - 2);

      const easterMonday = new Date(easter);
      easterMonday.setDate(easter.getDate() + 1);

      const memorialDay = new Date(year, 6, 1); // July 1st
      memorialDay.setDate(1 + (1 - memorialDay.getDay() + 7) % 7); // First Monday in July (Newfoundland & Labrador)

      const canadaDay = new Date(year, 6, 1); // July 1
      const civicHoliday = new Date(year, 7, 1); // August 1
      civicHoliday.setDate(1 + (1 - civicHoliday.getDay() + 7) % 7); // First Monday in August

      const labourDay = new Date(year, 8, 1); // September 1
      labourDay.setDate(1 + (1 - labourDay.getDay() + 7) % 7); // First Monday in September

      const truthAndReconciliation = new Date(year, 8, 30); // September 30

      const thanksgiving = new Date(year, 9, 1); // October 1
      thanksgiving.setDate(1 + ((1 - thanksgiving.getDay() + 7) % 7) + 7); // Second Monday in October

      const remembranceDay = new Date(year, 10, 11); // November 11
      const christmas = new Date(year, 11, 25); // December 25
      const boxingDay = new Date(year, 11, 26); // December 26
      const newYears = new Date(year, 0, 1); // January 1

      const yearHolidays = [
          { name: "New Year's Day", date: newYears },
          { name: "Good Friday", date: goodFriday },
          { name: "Easter Monday", date: easterMonday },
          { name: "Memorial Day", date: memorialDay },
          { name: "Canada Day", date: canadaDay },
          { name: "Civic Holiday", date: civicHoliday },
          { name: "Labour Day", date: labourDay },
          { name: "National Truth and Reconciliation Day", date: truthAndReconciliation },
          { name: "Thanksgiving", date: thanksgiving },
          { name: "Remembrance Day", date: remembranceDay },
          { name: "Christmas Day", date: christmas },
          { name: "Boxing Day", date: boxingDay }
      ];

      yearHolidays.forEach(holiday => {
          if (isInRange(holiday.date)) {
              holidays.push({
                  name: holiday.name,
                  date: holiday.date.toISOString().split('T')[0]
              });
          }
      });
  }

  return holidays;
}

function change_result() {
  const startDate = document.getElementsByTagName("input")[0].value;
  const endDate = document.getElementsByTagName("input")[1].value;

  if (startDate !== "" && endDate !== "") {
    // Calculate working days using global holidays
    const workingDays = workingDaysBetweenDates(startDate, endDate, holidays);

    // Update the result in the DOM
    document.getElementById("result").innerHTML = workingDays + " working days";
  } else {
    document.getElementById("result").innerHTML = "Please enter valid dates.";
  }
}

let holidays = [];

// Initialize holidays on page load
$(document).ready(() => {
  const startDate = "2000-01-01"; // Arbitrary early date
  const endDate = "2100-12-31"; // Arbitrary far future date
  holidays = getCanadianFederalHolidays(startDate, endDate);
});

$(document).ready(() => {
  $("#calc").click(() => {
    var d1 = $("#d1").val();
    var d2 = $("#d2").val();
    $("#dif").text(workingDaysBetweenDates(d1, d2), holidays);
  });

  $(document).ready(function () {
    $(window).keydown(function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        $(this).trigger("change");
        return false;
      }
    });
  });
});

$(document).ready(() => {
  $("#calc").click(() => {
    change_result();
  });
});

let workingDaysBetweenDates = (d0, d1, holidays) => {
  const startDate = parseDate(d0);
  const endDate = parseDate(d1);

  // Validate input
  if (endDate < startDate) {
    return 0;
  }

  // Calculate days between dates
  const millisecondsPerDay = 86400 * 1000; // Day in milliseconds
  startDate.setHours(0, 0, 0, 1); // Start just after midnight
  endDate.setHours(23, 59, 59, 999); // End just before midnight
  let diff = endDate - startDate; // Milliseconds between datetime objects
  let days = Math.ceil(diff / millisecondsPerDay);

  // Subtract two weekend days for every week in between
  const weeks = Math.floor(days / 7);
  days -= weeks * 2;

  // Handle special cases
  const startDay = startDate.getDay();
  const endDay = endDate.getDay();

  // Remove weekend not previously removed
  if (startDay - endDay > 1) {
    days -= 2;
  }
  // Remove start day if span starts on Sunday but ends before Saturday
  if (startDay === 0 && endDay !== 6) {
    days--;
  }
  // Remove end day if span ends on Saturday but starts after Sunday
  if (endDay === 6 && startDay !== 0) {
    days--;
  }

  // Subtract holidays that are not weekends
  holidays.forEach((holiday) => {
    const holidayDate = parseDate(holiday.date);
    if (holidayDate >= startDate && holidayDate <= endDate) {
      if (holidayDate.getDay() % 6 !== 0) {
        days--;
      }
    }
  });

  return days;
};

function parseDate(input) {
  // Transform date from text to date
  if (input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
  }
}

function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return year + "-" + month + "-" + day;
}
var options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

function AddBusinessDays() {
  const StartDate = document.getElementsByTagName("input")[2].value;
  let EndDate = StartDate;
  const DaysToAdd = parseInt(document.getElementsByTagName("input")[3].value, 10);
  let DaysAdded = 0;

  if (StartDate !== "" && DaysToAdd > 0) {
    const EndDateDate = parseDate(EndDate);

    while (DaysAdded < DaysToAdd) {
      EndDateDate.setDate(EndDateDate.getDate() + 1);
      DaysAdded = workingDaysBetweenDates(StartDate, getFormattedDate(EndDateDate), holidays);
    }

    document.getElementById("result2").innerHTML =
      EndDateDate.toLocaleDateString("en-US", options);
  } else {
    document.getElementById("result2").innerHTML = "Please enter valid input.";
  }
}

function SubBusinessDays() {
  const EndDate = document.getElementsByTagName("input")[4].value;
  let StartDate = EndDate;
  const DaysToSub = parseInt(document.getElementsByTagName("input")[5].value, 10);
  let DaysSubbed = 0;

  if (EndDate !== "" && DaysToSub > 0) {
    const StartDateDate = parseDate(StartDate);

    while (DaysSubbed < DaysToSub) {
      StartDateDate.setDate(StartDateDate.getDate() - 1);

      // Skip weekends
      if (StartDateDate.getDay() === 0 || StartDateDate.getDay() === 6) {
        continue;
      }

      DaysSubbed = workingDaysBetweenDates(getFormattedDate(StartDateDate), EndDate, holidays);
    }

    document.getElementById("result3").innerHTML =
      StartDateDate.toLocaleDateString("en-US", options);
  } else {
    document.getElementById("result3").innerHTML = "Please enter valid input.";
  }
}
