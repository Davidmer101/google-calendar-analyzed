let statusListeners = [];
let data = {};
let upComingEvents = [];
class ModelCalendar {
  upComingEvents = upComingEvents;
  data = data;
  constructor() {
    this.statusListeners = statusListeners;
    this.displayTimeOffset = 0;
    this.needOffSet = true;
    this.counter = 0;
    // Client ID and API key from the Developer Console
    this.API_KEY = 'AIzaSyBYxwNwT53EbvQNvhVCDD3FZW3KvTQWRBs';
    this.CLIENT_ID = '958765352456-a6jg5lmfamcgq5h6ecvod3v8tes73unb.apps.googleusercontent.com';
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

  // eslint-disable-next-line class-methods-use-this
  updateListeners(listenersList, event) {
    listenersList.forEach((listener) => listener(event));
  }

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  handleClientLoad() {
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
    let author  = new ModelCalendar();
    if (isSignedIn) {
      let x = await author.listUpcomingEvents(); //making sure I have my data before updating
      let y = await author.listCalendars();
      author.updateListeners(statusListeners, {isSignedIn: true});
     
    } else {
      author.updateListeners(statusListeners, {isSignedIn: false});
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
    // eslint-disable-next-line no-undef
    gapi.auth2.getAuthInstance().signOut();
  }


  /**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

  

  //   let updateDashBoard = (output) => {
  //     document.getElementById('add-content').append(output)
  //   }

  async listUpcomingEvents() {
    return gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime',
    }).then((response) => {
      const auth = new ModelCalendar();
      const events = response.result.items;
      upComingEvents.push('Upcoming events:');
      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          let when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          upComingEvents.push(`${event.summary} (${when})`);
        }
      } else {
        upComingEvents.push('No upcoming events found.');
      }
    });
  }

  async listCalendars() {
    return gapi.client.calendar.calendarList.list({})
      .then( async function(response) {
        let auth = new ModelCalendar();
        // Handle the results here (response.result has the parsed body).
        const calendars = await response.result.items;
        for(let i = 0; i< calendars.length; i++) {
          let element = calendars[i];
          await auth.getOffsetAndCallDataMaker(element.summary, element.id, element.timeZone);
        }
        // calendars.forEach((element) => {
        //  await auth.getOffsetAndCallDataMaker(element.summary, element.id, element.timeZone);
        // });

      },
      // eslint-disable-next-line no-console
      (err) => { console.error('Execute error', err); });
  }

  /* Calendar TimeZone can be different from the display time zone in that case,
* I need to get the offset to correctly identify the display time then
* I can use that to determine the range of days I want the results to come out
* @param calName, CalId
* @does calls hoursPerCalendar with right parameters
* @return nothing
* problems display time can be different for each
*/

  /* takes a calendarID and gives you an offset of the primary display time from GMT
*/

   async getOffsetAndCallDataMaker(calName, calId, timeIn) {
    return gapi.client.calendar.events.list({
      calendarId: calId,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
      // 'timeZone': 'Etc/GMT',
    //   'timeMin': '2020-10-03T23:55:00Z',
    //   'timeMax': '2020-10-10T23:55:00Z'
    })
      .then(async (response) => {
        // Handle the results here (response.result has the parsed body).
        const events = await response.result.items;
        events.forEach((event) => {
          this.counter++; // gets the total events
          // eslint-disable-next-line max-len
          if (event.summary !== undefined && !event.start.date && this.needOffSet) { // ignores undefined and all day events
            this.displayTimeOffset = new Date(event.start.dateTime).getTimezoneOffset();

            if (this.displayTimeOffset >= 0) {
              this.needOffSet = false;
              this.displayTimeOffset /= 60;
            }
          }
        });

        await this.createDataForCalendar(calName, calId, timeIn);
      },
      // eslint-disable-next-line no-console
      (err) => { console.error('Execute error', err); });
  }

  // hours per calendar
  // eslint-disable-next-line no-unused-vars
  async createDataForCalendar(calName, calId, timeIn) {
    return gapi.client.calendar.events.list({
      calendarId: calId,
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'Etc/GMT',
      timeMin: `2020-10-4T00:00:00-0${this.displayTimeOffset}:00`,
      timeMax: `2020-10-10T23:59:00-0${this.displayTimeOffset}:00`,
    })
      .then(async (response) => {
        // Handle the results here (response.result has the parsed body).
        const events = await response.result.items;
        events.forEach((event) => {
          // eslint-disable-next-line max-len
          if (event.summary !== undefined && !event.start.date) { // ignores undefined and all day events
            this.nameOfEvent = event.summary;
            const eventDuration = this.durationInHours(event.start.dateTime, event.end.dateTime);
            this.AddToData(calName, this.nameOfEvent, eventDuration);
            // eslint-disable-next-line max-len
          }
          this.counter -= 1;
          if (this.counter === 0) {
            getData();
          }
        });
      },
      // eslint-disable-next-line no-console
      (err) => { console.error('Execute error', err); });
  }
  //

  /**
 * creates a data {cal1 : {event1: duration, event2: duration2}, cal2: {event3: duration}}
 * can be used to do calculations and show results
 * @param claName name of calendar
 * @param nameOfEvent event name
 * @param eventDuration duration of event
 */
  AddToData(calName, nameOfEvent, eventDuration) {
    // eslint-disable-next-line eqeqeq
    if (this.data[calName] == undefined) { // cal name is not defined
      this.data[calName] = {};
    }
    // eslint-disable-next-line eqeqeq
    if (this.data[calName][nameOfEvent] == undefined) { // if event is not already included, include it
      this.data[calName][nameOfEvent] = eventDuration;
    } else { // if alraedy included sum the new duration to the old one
      this.data[calName][nameOfEvent] += eventDuration;
    }
  }

  // gives the data for another function

  /**
 *
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

  // given two dates returns duration
  durationInHours(day1, day2) {
    const time1 = new Date(day1);
    const time2 = new Date(day2);
    if (time1.getTime() > time2.getTime()) { // date out of order
      return NaN;
    }
    const diff = time2.getTime() - time1.getTime();
    return Number((diff / (1000 * 60 * 60.0)).toFixed(2));
  }

  // hanlde button
  

  
}
