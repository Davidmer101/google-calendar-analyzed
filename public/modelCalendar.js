
let statusListeners = [];
let selectionListeners = [];
let upComingEvents = [];
let daysToMonthcounter = 0;
let weeksForIdCounter = 0; 
let calendarList = [];
let eventList = [];
let productiveList = [];
let neutralList = [];
let destructiveList = [];
let weeklyData = {};
let dailyData = {};
const starterURL = 'https://google-calendar-analyzer.herokuapp.com/'
class ModelCalendar {
  upComingEvents = upComingEvents;
  daysToMonthcounter = daysToMonthcounter;
  calendarList = calendarList;
  eventList = eventList;
  productiveList = productiveList;
  neutralList = neutralList;
  destructiveList = destructiveList;
   weeklyData = weeklyData;
  constructor() {
    this.statusListeners = statusListeners;
    this.selectionListeners = selectionListeners;
    this.displayTimeOffset = 0;
    this.needOffSet = true;
    this.counter = 0;
    this.runOnce = 0;
    // Client ID and API key from the Developer Console
    this.API_KEY = 'AIzaSyBYxwNwT53EbvQNvhVCDD3FZW3KvTQWRBs';
    this.CLIENT_ID = '958765352456-n0b4hg33876562lgerugi6qfei2jjaja.apps.googleusercontent.com';
    // Array of API discovery doc URLs for APIs used by the quickstart
    this.DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    this.SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
  }

  addStatusListener(fun) {
    if (!(this.statusListeners.includes(fun))) {
      this.statusListeners.push(fun);
    }
  }

  addSelectionListener(fun) {
    if (!(this.selectionListeners.includes(fun))) {
      this.selectionListeners.push(fun);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  updateListeners(listenersList, event) {
    listenersList.forEach((listener) => listener(event));
  }

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  handleClientLoad() {
    // alert('model handling client load')
    // eslint-disable-next-line no-undef
    gapi.load('client:auth2', this.initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */

  initClient() {
    // eslint-disable-next-line no-undef
    // const auth = new ModelCalendar();
    let auth = new ModelCalendar();
    auth.initClient2();
  }

  initClient2() {

    // eslint-disable-next-line no-undef
    gapi.client.init({
      apiKey: `${this.API_KEY}`,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES,
    }).then(() => {
      // Listen for sign-in state changes.
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line prefer-const
      let auth = new ModelCalendar();
      // eslint-disable-next-line no-undef
      gapi.auth2.getAuthInstance().isSignedIn.listen(auth.updateSigninStatus);
      // Handle the initial sign-in state.
      // eslint-disable-next-line no-undef
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error) => {
      upComingEvents.push(JSON.stringify(error, null, 2));
    });
  }
  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */

  async updateSigninStatus(isSignedIn) {
    // alert('model: updating signin status')
    let author  = new ModelCalendar();
    if (isSignedIn) {
      // alert('weeklydata is: ' + JSON.stringify(weeklyData))
      // alert('model update signin status updating view')
      let y = await author.listOfCalendars();
      author.updateListeners(statusListeners, {type: 'authorized'});
    } else {
      // alert('model: not authorized ')
      author.updateListeners(statusListeners, {type: 'notAuthorized'});
    }
  }

  /**
 *  Sign in the user upon button click.
 */
  // eslint-disable-next-line no-unused-vars
  handleAuthClick(_event) {
    // eslint-disable-next-line no-undef
    gapi.auth2.getAuthInstance().signIn();

  }

  /**
 *  Sign out the user upon button click.
 */
  // eslint-disable-next-line no-unused-vars
  handleSignoutClick(_event) {
    let author  = new ModelCalendar();
    // eslint-disable-next-line no-undef
    let result = axios ({
      method: 'get',
      url: starterURL + 'api/users/logout'
    })
    gapi.auth2.getAuthInstance().signOut();
    setTimeout (()=> {
      // alert('signed out')
      author.updateListeners(statusListeners, {type: 'signedOut'});
    },0)
  }


/**
 * for each calendar recieved from gapi, add the name of calendar 
 * to @calendarList and calls @weeklyEvents 
 * 
 */

  async listOfCalendars() {
    try {
      let response = await gapi.client.calendar.calendarList.list({});
      let calendars = response.result.items;
      for(let i = 0; i< calendars.length; i++) {
          let calendar = calendars[i];
          calendarList.push(calendar.summary)
          this.weeklyEvents(calendar.summary, calendar.id);
          this.dailyEvents(calendar.summary, calendar.id);
        }
      let to5 = 0;
      if (calendarList.length < 5) {
        to5 = 5 - calendarList.length;
      }
      for(let i = 0; i < to5; i++) {
        calendarList.push(`placeHolder${i}`)
      }
      this.runOnce+= to5;
        // alert(calendarList)
    } catch (error) {
      console.log(error);
    }
  }
 
  sortObjectsByKey (object) {
    let returnedObje = {};
    let keys = Object.keys(object);
    keys.sort();
    keys.forEach((key) => {
      returnedObje[key] = object[key]
    })
    return returnedObje;
  }
  /**
   * 
   * @param {*} calName 
   * @param {*} calId 
   */
  async dailyEvents(calName, calId) {
    // alert('model: preparing to get daily events')
    let firstDate = monthDates().week4.weekStartDate;
    firstDate.oneDay();
    this.events('day28', calName, calId, firstDate.dayStart.toISOString(), firstDate.dayEnd.toISOString())
    // console.log(firstDate.dayStart.toLocaleString() + ' ' + firstDate.dayEnd.toLocaleString());

    for(let i = 27; i > 0; i--) {
      // console.log(firstDate.dayStart.toLocaleString() + ' ' + firstDate.dayEnd.toLocaleString());
      updateDate(firstDate, 1).oneDay(); 
      this.events(`day${i}`, calName, calId, firstDate.dayStart.toISOString(), firstDate.dayEnd.toISOString())
    }
    let lastDate = monthDates().week1.weekEndDate;
    
  }
/**
 * given calName and calID, it requests events week by week (total of 4 weeks)
 * by calling @events
 * @param {string} calName 
 * @param {number} calId 
 */
 
  async weeklyEvents (calName, calId) {
    // console.log('starting Time and ending time')
    // console.log(monthDates().week1.weekStartDate.toLocaleString())
    // console.log(monthDates().week1.weekEndDate.toLocaleString())
    await this.events('week1', calName, calId, monthDates().week1.weekStartDate.toISOString(), monthDates().week1.weekEndDate.toISOString())
    await this.events('week2', calName, calId, monthDates().week2.weekStartDate.toISOString(), monthDates().week2.weekEndDate.toISOString())
    await this.events('week3', calName, calId, monthDates().week3.weekStartDate.toISOString(), monthDates().week3.weekEndDate.toISOString())
    await this.events('week4', calName, calId, monthDates().week4.weekStartDate.toISOString(), monthDates().week4.weekEndDate.toISOString())
    // alert(this.runOnce)
    if(this.runOnce == 4) {
      // alert(JSON.stringify(weeklyData))
      // alert(this.runOnce)
      let author  = new ModelCalendar();
      // alert(`now adding to server ${JSON.stringify(weeklyData.week2)}`)
      if(weeklyData.week1) {
        this.sendToServer(this.sortWeeklyData(weeklyData["week1"]));
      }
      if(weeklyData.week2) {
        this.sendToServer(this.sortWeeklyData(weeklyData["week2"]));
      }
      if(weeklyData.week3) {
        this.sendToServer(this.sortWeeklyData(weeklyData["week3"]));
      }
      if(weeklyData.week4) {
        this.sendToServer(this.sortWeeklyData(weeklyData["week4"]));
      }
      // alert(JSON.stringify(dailyData))
      if(dailyData.day1) {
        // alert('model: updating with day1')
        this.dailyModel('day1'); //first page view
      } else {
        // alert('model:updating day1 with null')
        author.updateListeners(selectionListeners, {data: undefined, selected: 'daily', dayId: 'day1'})
      }
    }
    this.runOnce ++;
  }

/**
 * for a given week, it adds up the hours for each calendar 
 * by making sure events that start the previos week or spans to the next week 
 * are correctly updated 
 * 
 * @param {string} timeId 
 * @param {string} calName 
 * @param {*} calId 
 * @param {dateISOString} minDate 
 * @param {dateISOString} maxDate 
 * 
 * Eventually, it will populate @object weeklyData and call @function sendToServer() 
 */
 async events(timeId, calName, calId, minDate, maxDate) {
  //  console.log('event called with ' + timeId)
  try {
    let response = await gapi.client.calendar.events.list({
      calendarId: calId,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: timeZone(new Date().toString()),
      timeMin: minDate,
      timeMax: maxDate
  });
  const events = response.result.items;
  let checkStart = true;
  let checkEnd = false;
  let startDate = new Date(minDate);
  let endDate = new Date(maxDate);
  events.forEach((event) => {
     if (event.summary !== undefined && !event.start.date) { // ignores undefined and all day events
      eventList.includes(event.summary)? 0 : eventList.push(event.summary);
      let eventStartDate = new Date(event.start.dateTime);
      let eventEndDate = new Date(event.end.dateTime);
      let eventDuration =  timeBetween(eventStartDate, eventEndDate).hours

      //filter a day that is part of a different week 
      if (checkStart && eventStartDate.toDateString() <= startDate.toDateString()) {
        if(timeBetween(startDate, eventStartDate).minutes < -1) { // event start date is less than one minute the week start date
              eventDuration = timeBetween(startDate, eventEndDate).hours
        } 
        checkStart = false;
      } else if (checkEnd || eventEndDate.toDateString() == endDate.toDateString()) {
        if(timeBetween(endDate, eventEndDate).minutes > 1) {
            eventDuration =  timeBetween(eventStartDate, endDate).hours  
        } 
        checkEnd = true;
      } 

      if(timeId.startsWith('week')) {
         this.addToWeeklyData(timeId, calName, eventDuration);
      } else if (timeId.startsWith('day')) {
        this.addToDailyData(timeId, calName, eventDuration);
      }

      
     }
  })
  
  } catch (error) {
    console.log(error)
  }
 }
/**
 * 
 * @param {*} weekName 
 * @param {*} calName 
 * @param {*} eventDuration 
 */
 addToDailyData(dayName, calName, eventDuration) {

  if (dailyData[dayName] == undefined) { // cal name is not defined
    dailyData[dayName] = {'id': dayName};
  }
  // eslint-disable-next-line eqeqeq
  if (dailyData[dayName][calName] == undefined) { // if event is not already included, include it
    dailyData[dayName][calName] = eventDuration;
  } else { // if alraedy included sum the new duration to the old one
    dailyData[dayName][calName] += eventDuration;
  }
  // alert('dailyDaata added to : ' + JSON.stringify(dailyData))
 }  
  /**
 * populate @weeklyData @object  {weekName : {cal1: durations added, cal2: duration2added}...}
 * can be used to do calculations and show results
 * @param weekName week name
 * @param calName calendar name
 * @param eventDuration duration of event
 */
 async addToWeeklyData(weekName, calName, eventDuration) {
  // eslint-disable-next-line eqeqeq
  if (weeklyData[weekName] == undefined) { // cal name is not defined
    weeklyData[weekName] = {"id": weekName};
  }
  // eslint-disable-next-line eqeqeq
  if (weeklyData[weekName][calName] == undefined) { // if event is not already included, include it
    weeklyData[weekName][calName] = eventDuration;
  } else { // if alraedy included sum the new duration to the old one
    weeklyData[weekName][calName] += eventDuration;
  }
    // console.log(weekName + ' ' +  calName + ' ' + eventDuration)
  // alert(` added to weeklyData is ${JSON.stringify(weeklyData)}`)
  // return;
 }  
 //WILL FIX IT FOR NOW:
  // manually () {
  //   setTimeout(() => {
  //     console.log('IN MANUALLY weekly Data: ' + JSON.stringify(weeklyData))
  //     console.log('daily data: ' + JSON.stringify(dailyData))
  //     this.sendToServer(this.sortWeeklyData(weeklyData["week1"]));
  //     this.sendToServer(this.sortWeeklyData(weeklyData["week2"]));
  //     this.sendToServer(this.sortWeeklyData(weeklyData["week3"]));
  //     this.sendToServer(this.sortWeeklyData(weeklyData["week4"]));
  //   }, 4000);
  // }

  sortDailyData (dataObject) {
    // alert('model: sort Daily Data ' + JSON.stringify(dataObject));
    if(Object.keys(dataObject).length != 0) {
      let obj  = {}
      // alert(JSON.stringify(dataObject))
      if(dataObject['id']) {
        obj['dayId'] = dataObject['id'];
      }
      let keys = calendarList
      keys.sort();
      keys.forEach((key) => {
        if(key != 'id') {
          if(dataObject[key] == undefined) {
            obj[key] = 0;
           } else {
            obj[key] = dataObject[key];
          }
        }
      })
      if(keys.length < 5) {
        for(let i = keys.length; i < 5; i++) {
          obj[i] = 0; 
        }
      }
      // alert('sorted is: ' + JSON.stringify(obj))
      return obj;
    }
    
  }
/**
 * given an object, it sorts the keys except the id at the top
 * @param {*} dataObject 
 * @example: given {id: 2, name: 'anderson', age: 23}
 * @returns {id: 2, age: 23, name: 'anderson'}
 */
 sortWeeklyData (dataObject) {
//  console.log(` now in sortweeklyData and recieve ${(JSON.stringify(dataObject))}`)
  if(Object.keys(dataObject).length != 0) {
    let obj  = {}
    // alert(JSON.stringify(dataObject))
    obj['id'] = dataObject['id'];
    
    let keys = calendarList
    keys.sort();
    keys.forEach((key) => {
      if(key != 'weekid') {
        if(dataObject[key] == undefined) {
          obj[key] = 0;
         } else {
          obj[key] = dataObject[key];
        }
      }
    })
    if(keys.length < 5) {
      for(let i = keys.length; i < 5; i++) {
        obj[i] = 0; 
      }
    }
    // console.log('sortingWeek... returning '+ JSON.stringify(obj))
    return obj;
  }
  
}

async sendToServerSignUp (form) {
  let author  = new ModelCalendar();
  try {
    let result = await axios ({
      method: 'post',
      url: starterURL + 'api/users/',
      data: {
        'user': {
          'username': form.username,
          'password': form.password,
          'email': form.email
        }
      }
    })
      // alert('model: sendtoserversignedup: ' + result.status)
      author.updateListeners(statusListeners, {type: 'signedUp', username: result.data.username})  
  } catch (error) {
    author.updateListeners(statusListeners, {type: 'notSignedUp'})
    console.log(error);
    // console.log('error in model:sendToServerSignUp ' + JSON.stringify(error));
  }
}

async sendToServerLogIn (form) {
  // alert('model in sendtoServerLogIn')
  let author  = new ModelCalendar();
  try {
    let result = await axios ({
      method: 'post',
      url: starterURL + 'api/users/login',
      data: {
        'user': {
          'username': form.username,
          'password': form.password,
        }
      }
    })
      author.updateListeners(statusListeners, {type: 'loggedIn', username: result.data.user.username})  
  } catch (error) {
    author.updateListeners(statusListeners, {type: 'notLoggedIn'})
    console.log(error);
  }
}

/**
 * given an object, sends it to the server using @axios
 * If the data already exists, it updates it
 * @param {*} object 
 */
 async sendToServer(object) {
  //  console.log('NOW SENDINGT TO SEVER ' + JSON.stringify(object))
  // alert('model: sending post request to server')
   let alreadyInServer = false;
   try {
    // let result = await axios ({
    //   method: 'get',
    //   url: 'http://localhost:5000/api/weeks/',
    // })
    // let weeks = result.data["weeks"].filter((week) => week['id']) // getting the ids
    // weeks.forEach(week => {
    //   if (week['id'] == object['id']) {
    //     alreadyInServer = true;
    //     this.sendPut(object)
    //   }
    // })
    this.sendPost(object);
    // if(!alreadyInServer) {
    //   // alert('posting')
    //   this.sendPost(object)
    // }
   } catch (error) {
   }
      
}

 async sendPost(week){
  //  alert('sending post ' + JSON.stringify(week))
  try {
   let calendar = calendarList.filter((calName) => {return calName != "weekid"}) 
   let result = await axios ({
     method: 'post',
     url: `${starterURL}api/weeks/`,
     data: {
         "week": {
             "id": week['id'],
             "cal1": week[calendar[0]],
             "cal2": week[calendar[1]],
             "cal3": week[calendar[2]],
             "cal4": week[calendar[3]],
             "cal5": week[calendar[4]]
         }
     }
 })
//  alert('recieved ' + JSON.stringify(result.data))
  } catch (error) {

  }
 }

 async sendPut(week) {
  //  alert(`in put sending to server ${JSON.stringify(week)}`)
   try {
    let calendar = calendarList.filter((calName) => {return calName != "weekid"})
    // alert(week['id'] + ' ' + week[calendar[0]] + ' ' + week[calendar[1]] + ' ' + week[calendar[2]] + ' ' + week[calendar[3]] + ' ' + week[calendar[4]]) 
    let result = await axios ({
      method: 'put',
      url: `${starterURL}api/weeks/${weekId}`,
      data: {
          "week": {
              "id": week['id'],
              "cal1": week[calendar[0]],
              "cal2": week[calendar[1]],
              "cal3": week[calendar[2]],
              "cal4": week[calendar[3]],
              "cal5": week[calendar[4]]
          }
      }
  })
   } catch (error) {
     
   }
 }
 async weeklyModel (weekId) {

   if(Object.keys(weeklyData) != 0) {
     //get value from servers
  //  alert('model: weeklyModel: ')
   if(weekId == 'weekly') {
     weekId = 'week1'
   }
   let author  = new ModelCalendar();
   try {
    let result = await axios ({
      method: 'get',
      url: `${starterURL}api/weeks/${weekId}`,
    })
    // alert(JSON.stringify(result.data));
    // alert(JSON.stringify(result.data.week));
    author.updateListeners(selectionListeners, {data: result.data.week, selected: 'weekly', weekId: weekId})
    } catch (error) {
      author.updateListeners(selectionListeners, {data: undefined, selected: 'weekly', weekId: weekId})
      console.log(error)
    }
  } 
 }
 async dailyModel (dayId) {
  // alert('in daily model ' + dayId)
  // alert(JSON.stringify(dailyData))
  let author  = new ModelCalendar();
  //  try {
  //   let result = await axios ({
  //     method: 'get',
  //     url: 'http://localhost:5000/api/weeks/',
  //   })
  // alert(`model dailymodel ${JSON.stringify(dailyData)}`)
  if(dailyData[dayId]) {
    // alert('model: dailyModel dailyData[dayx] is: ' + JSON.stringify(dailyData[dayId]))
    author.updateListeners(selectionListeners, {data: this.sortDailyData(dailyData[dayId]), selected: 'daily', dayId: dayId})
  } else {
    // alert('model: dialyData[dayId] is null')
    author.updateListeners(selectionListeners, {data: undefined, selected: 'daily', dayId: dayId})
  }
  // } catch (error) {
  //   console.log(error)
  // }
 }
//credit to W3
 autocomplete(text, list) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  let currentFocus;
  /*execute a function when someone writes in the text field:*/
  text.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < list.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (list[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + list[i].substr(0, val.length) + "</strong>";
          b.innerHTML += list[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + list[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              text.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  text.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.key == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.key == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.key == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != text) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}


}
