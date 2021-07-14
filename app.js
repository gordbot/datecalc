var holidays = [];
function change_result() {
  var startDate = document.getElementsByTagName('input')[0].value;
  var endDate = document.getElementsByTagName('input')[1].value;
  var xmlhttp;
  if(startDate !== '' && endDate !==''){
    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var text = xmlhttp.responseText;
      // Now convert it into array using regex

      holidays = text.split('\n');
      document.getElementById('result').innerHTML =
      workingDaysBetweenDates(startDate, endDate) + ' working days';
    }
  };
  xmlhttp.open('GET', 'holidayslist.txt', true);
  xmlhttp.send();
}
}
  

$(document).ready(() => {
  $('#calc').click(() => {
    var d1 = $('#d1').val();
    var d2 = $('#d2').val();
    console.log(d1);
    $('#dif').text(workingDaysBetweenDates(d1, d2));
  });
});



let workingDaysBetweenDates = (d0, d1) => {
  /* Two working days and an sunday (not working day) */
  //var holidays = ['2016-05-03', '2016-05-05', '2016-05-07'];
    var startDate = parseDate(d0);
  startDate.setDate(startDate.getDate() + 1);
  var endDate = parseDate(d1);

  // Validate input
  if (endDate < startDate) {
    return 0;
  }

  // Calculate days between dates
  var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
  startDate.setHours(0, 0, 0, 1); // Start just after midnight
  endDate.setHours(23, 59, 59, 999); // End just before midnight
  var diff = endDate - startDate; // Milliseconds between datetime objects
  var days = Math.ceil(diff / millisecondsPerDay);

  // Subtract two weekend days for every week in between
  var weeks = Math.floor(days / 7);
  days -= weeks * 2;

  // Handle special cases
  var startDay = startDate.getDay();
  var endDay = endDate.getDay();

  // Remove weekend not previously remove
  if (startDay - endDay > 1) {
    days -= 2;
  }
  // Remove start day if span starts on Sunday but ends before Saturday
  if (startDay == 0 && endDay != 6) {
    days--;
  }
  // Remove end day if span ends on Saturday but starts after Sunday
  if (endDay == 6 && startDay != 0) {
    days--;
  }
  /* Here is the code */
  holidays.forEach(day => {
    if (day >= d0 && day <= d1) {
      /* If it is not saturday (6) or sunday (0), substract it */
      if (parseDate(day).getDay() % 6 != 0) {
        days--;
      }
    }
  });
  return days;
};

function parseDate(input) {
  // Transform date from text to date
  if(input){
    var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
  }
  
}
function getFormattedDate(date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return year + '-' + month + '-' + day;
}
var options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
function AddBusinessDays() {
  var StartDate = document.getElementsByTagName('input')[2].value;
  var EndDate = StartDate;
  var DaysToAdd = document.getElementsByTagName('input')[3].value;
  var DaysAdded = 0;
  var EndDateDate = parseDate(EndDate);

  if(EndDate !=='' && DaysToAdd !==''){
    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var text = xmlhttp.responseText;
      // Now convert it into array using regex

      holidays = text.split('\n');
      while (DaysAdded != DaysToAdd) {
        EndDateDate.setDate(EndDateDate.getDate() + 1);
        DaysAdded = workingDaysBetweenDates(
          StartDate,
          getFormattedDate(EndDateDate)
        );
      }
      document.getElementById('result2').innerHTML =
        EndDateDate.toLocaleDateString('en-US', options);
    }
  };
  xmlhttp.open('GET', 'holidayslist.txt', true);
  xmlhttp.send();
  }
  
}

function SubBusinessDays() {
  var EndDate = document.getElementsByTagName('input')[4].value;
  var StartDate = EndDate;
  var DaysToSub = document.getElementsByTagName('input')[5].value;
  var DaysSubbed = 0;
  var StartDateDate = parseDate(StartDate);
  var xmlhttp;
  if(StartDate !== '' && DaysToSub !== ''){
    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var text = xmlhttp.responseText;
      // Now convert it into array using regex

      holidays = text.split('\n');
      while (DaysSubbed != DaysToSub) {
        // Handle special cases
        var startDay = StartDateDate.getDay();
        // Remove weekend not previously removed.
        if (startDay == 1) {
          StartDateDate.setDate(StartDateDate.getDate() - 3);
        } else {
          StartDateDate.setDate(StartDateDate.getDate() - 1);
        }
        DaysSubbed = workingDaysBetweenDates(
          getFormattedDate(StartDateDate),
          EndDate
        );
      }

      document.getElementById('result3').innerHTML =
        StartDateDate.toLocaleDateString('en-US', options);
    }
  };
  xmlhttp.open('GET', 'holidayslist.txt', true);
  xmlhttp.send();
  }
  
}
