// eslint-disable-next-line no-unused-vars
class ViewCalendar {
  constructor(model) {
    this.model = model;
    this.listeners = [];
    this.homePage = this.homePageView();
    this.authorizeButton = document.getElementById('authorize_button');
    this.signoutButton = document.getElementById('signout_button');
    this.selectionButton = document.getElementById('mySelect');
    this.rightArrowButton = document.getElementById("right-arrow");
    this.leftArrowButton = document.getElementById('left-arrow');
    // this.dropDownButton = docoument.querySelector('dropDown');
    // eslint-disable-next-line no-undef
    // add listeners to model
    this.model.handleClientLoad();
    this.model.addStatusListener((status) => {
      switch (status.type) {
        case 'signedUp':
          this.authorizationView(status.username);
          break;
        case 'notSignedUp':
          this.signUpFailed();
          break;
        case 'signedOut':
          location.reload();
          // document.getElementById('home-navbar-username').style.display = 'none'
          break;
        case 'authorized':
          this.authorizeButton.style.display = 'none';
          this.signoutButton.style.display = 'block';
          document.getElementById('homePage').style.display = 'none';
          document.getElementById('dashBoard').style.display = 'block';
          break;
        case 'notAuthorized':
          // alert('view not authorized doing something')
          this.authorizeButton.style.display = 'block';
          this.signoutButton.style.display = 'none';
          document.getElementById('homePage').style.display = 'block';
          document.getElementById('dashBoard').style.display = 'none';
          break;
        case 'loggedIn':
          // alert('view: loggin recieved')
          // alert(gapi.auth2.getAuthInstance().isSignedIn.get())
          this.authorizationView(status.username);
          break;
        case 'notLoggedIn':
          // alert('view not loggin recieved from model')
          this.LogInFailed();
          break;
        default:
          break;
      }
    });

     this.model.addSelectionListener((selection) => {
       if(selection.selected == 'daily') {
         this.dailyDashBoardView(selection.dayId, selection.data);
       } else if (selection.selected == 'weekly') {
         this.weeklyDashBoardView(selection.weekId, selection.data);
       } else if(selection.selected = 'monthly') {
         this.monthlyDashBoardView(selection.data);
       } else if (selection.selected == 'custom') {
         this.customDashBoardView(selection.data);
       }
     });

     this.authorizeButton.onclick =  () => {
      //  alert('authorize button clicked in view')
      this.updateListeners({code: 'authorize'})
    }

    this.signoutButton.onclick =  () => {
      this.updateListeners({code: 'signOut'})
    }
     
    this.selectionButton.onchange = (event) => {
      // alert('view; selec changed: ' + this.selectionButton.value)
      this.updateListeners({code: `${this.selectionButton.value}`})
    }
    
    this.rightArrowButton.onclick = () => {
      // alert('right arrow pressed')
      this.updateListeners({code: "right-arrow"})
    }

    this.leftArrowButton.onclick = () => {
      // alert('left arrow pressed with : ' + this.selectionButton.value)
      this.updateListeners({code: 'left-arrow'})
    }

    document.getElementById('calc-productivity').onclick =() => {
      document.getElementById('pers-prod').style.display='block'
      let list = this.model.calendarList.concat(this.model.eventList);
      /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
      this.model.autocomplete(document.getElementById("myInput"), list);

      var input = document.getElementById("myInput");
      input.addEventListener("keyup", function(event) {
        if (event.key === 13) { //enter
        event.preventDefault();
        document.getElementById("myBtn").click();
        }
      });
      document.getElementById("myBtn").onclick = (e) => {
      e.preventDefault();
      
      let inputValue = document.getElementById("input").myCalendar.value
      let radio = document.getElementById('input');
      if(radio.productive.checked) {
        let add = document.createElement('li');
        add.innerHTML = inputValue
        document.getElementById('productive-list').appendChild(add);
        this.model.productiveList.push(inputValue.toLowerCase());
      } else if (radio.neutral.checked) {
        let add = document.createElement('li');
        add.innerHTML = inputValue
        document.getElementById('neutral-list').appendChild(add);
        this.model.neutralList.push(inputValue.toLowerCase());
      } else if(radio.destructive.checked) {
        this.model.destructiveList.push(inputValue.toLowerCase());
        let add = document.createElement('li');
        add.innerHTML = inputValue
        document.getElementById('destructive-list').appendChild(add);
        
      } else {

      }
      document.getElementById("input").myCalendar.value = ''

}
    }
    //handle clicks
    window.onclick = (event) => {
      // alert(JSON.stringify(event.target.id));
      switch (event.target.id) {
        case'navbar-signup':
          document.getElementById('homePage').style.display='none';
          document.getElementById('user-signup').style.display='block';
          break;
        case'closepp':
          this.updateListeners({code: 'closepp'})
          break;
        case 'cancel-button':
          document.getElementById('user-signup').style.display='none';
          document.getElementById('homePage').style.display='block';
          break;  
        case 'cancel-button1':
          document.getElementById('user-login').style.display='none';
          document.getElementById('homePage').style.display='block';
          break; 
        case 'navbar-login':
          document.getElementById('homePage').style.display='none';
          document.getElementById('user-login').style.display='block';
          break;   
      } 
    }

    //porcessing sinup form
    let signupForm = document.getElementById('signup-form')
    signupForm.addEventListener('submit', event => {
      event.preventDefault()
      let form = {'username': signupForm.username.value, 
                  'password': signupForm.password.value,
                  'passwordRepeat': signupForm.passwordRepeat.value, 
                  'email': signupForm.email.value
                  }
      if(form.password != form.passwordRepeat) {
        let p = document.createElement('p')
        p.innerHTML = "<em> passwords didn't match! </em>"
        p.style.color = 'red';
        p.style.backgroundColor = 'yellow';
        document.getElementById('signup-problem').appendChild(p);
        setTimeout (()=> {
          document.getElementById('signup-problem').innerHTML = '';
        }, 2500)
      } else {
        this.updateListeners({code: 'signupForm', form: form})
        signupForm.reset(); 
      }
           
    })

    //sign up failed
    
    
    //porcessing sinup form
    let loginForm = document.getElementById('login-form')
    loginForm.addEventListener('submit', event => {
      // alert('view: loginform done')
      event.preventDefault()
      let form = {'username': loginForm.username.value, 
                  'password': loginForm.password.value,
                 };
      this.updateListeners({code: 'loginForm', form: form})
      loginForm.reset();
    })
    
  }
  authorizationView(username) {
    document.getElementById('navbar-signup').style.display = 'none';
    document.getElementById('navbar-about').style.display = 'none';
    // document.getElementById('navbar-privacy').style.display = 'none';
    document.getElementById('user-signup').style.display = 'none';
    document.getElementById('homePage').style.display ='block';
    let user = document.createElement('a')
    user.setAttribute('class', 'navbar-item');
    user.setAttribute('id', 'home-navbar-username')
    user.innerHTML = `${username}`
    // document.getElementById('navbar-home').append (user);
    // document.getElementById('navbar-privacy').append(user);
    document.getElementById('user-login').style.display = 'none';
    document.getElementById('authorize-view').style.display = 'block'
    document.getElementById('dashboard-username').append(user);
  }

  signUpFailed() {
    let p = document.createElement('p')
    p.innerHTML = "<em> Username is taken! </em>"
    p.style.color = 'red';
    p.style.backgroundColor = 'yellow';
    document.getElementById('signup-problem').appendChild(p);
    setTimeout (()=> {
      document.getElementById('signup-problem').innerHTML = '';
    }, 3000)
  }

  LogInFailed() {
    let p = document.createElement('p')
    p.innerHTML = "<em> Username and Password mismatch </em>"
    p.style.color = 'red';
    p.style.backgroundColor = 'yellow';
    document.getElementById('login-problem').appendChild(p);
    setTimeout (()=> {
      document.getElementById('login-problem').innerHTML = '';
    }, 3000)
  }
   /**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
  appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }
  // eslint-disable-next-line class-methods-use-this
  homePageView() {
  }

  addListener(listener) {
    let idx = this.listeners.findIndex((l) => l == listener);
    if (idx == -1) {
        this.listeners.push(listener);
    }
  }

  removeListener(listener) {
    let idx = this.listeners.findIndex((l) => l == listener);
    if (idx != -1) {
        this.listeners.splice(idx, 1);
    }
  }

  updateListeners(event) {
    this.listeners.forEach((l) => l(event));
  }
  // dashBoardView() 
  dailyDashBoardView(dayId, dayData) {
    // alert('view: dailyDashBoardView dayData is: ' + JSON.stringify(dayData))
    document.getElementById('daily').value = dayId
    if(!dayData) { //if undefined
      let day = new Date();
      let adjuster = dayId.slice(3);
      day = updateDate(oneWeek(day).weekEndDate, 1-parseInt(adjuster))
      // alert(day.toLocaleString() + ' ' + adjuster)
      document.getElementById('first-column').innerHTML = ''
      document.getElementById('second-column').style.display = 'none'
      document.getElementById('third-column').innerHTML = ''
      document.getElementById('viewing').innerHTML = day.toDateString();
      document.getElementById('no-data-message').innerHTML =  `<h1> It looks like you don't have any event schedued on ${day.toDateString()}! </h1>`
    } else {
      let day = new Date();
      let adjuster = dayId.slice(3);
      day = updateDate(oneWeek(day).weekEndDate, 1-parseInt(adjuster))
      // alert('view: dailyDashBoardView dayData is: ' + JSON.stringify(dayData))
      // alert(day.toLocaleString() + ' ' + adjuster)
      document.getElementById('viewing').innerHTML = day.toDateString();
      document.getElementById('no-data-message').innerHTML = '';
      document.getElementById('first-column').innerHTML = ''
      document.getElementById('third-column').innerHTML = ''
      document.getElementById('second-column').style.display = 'block'
      google.charts.setOnLoadCallback(drawChart(dayData));
    }
  }
  weeklyDashBoardView(weekId, weekData) {
    document.getElementById('weekly').value = weekId
    let weekStartsOn;
    let weekEndsOn;
    if(weekId == 'week1') {
       weekStartsOn = monthDates().week1.weekStartDate
       weekEndsOn = monthDates().week1.weekEndDate
    } else if (weekId == 'week2') {
       weekStartsOn = monthDates().week2.weekStartDate
       weekEndsOn = monthDates().week2.weekEndDate
    } else if (weekId == 'week3') {
      weekStartsOn = monthDates().week3.weekStartDate
      weekEndsOn = monthDates().week3.weekEndDate
    } else if (weekId == 'week4') {
      weekStartsOn = monthDates().week4.weekStartDate
      weekEndsOn = monthDates().week4.weekEndDate
    }
    weekStartsOn.weekDay();
    weekStartsOn.myMonth();
    
    if(weekData) { //defined
      document.getElementById('no-data-message').innerHTML = '';
      document.getElementById('viewing').innerHTML = `${weekStartsOn.monthName}, ${weekStartsOn.weekStart}   - ${weekStartsOn.weekEnd}`
      document.getElementById('second-column').style.display = 'block'
      google.charts.setOnLoadCallback(drawChart(weekData)); // {weekid: week1, cal1: ..., cal2:...}
    } else {
      document.getElementById('viewing').innerHTML = `${weekStartsOn.monthName}, ${weekStartsOn.weekStart}   - ${weekStartsOn.weekEnd}`
      document.getElementById('first-column').innerHTML = ''
      document.getElementById('second-column').style.display = 'none'
      document.getElementById('third-column').innerHTML = ''
      document.getElementById('no-data-message').innerHTML =  `<h1> It looks like you don't have any event
      schedued on ${weekStartsOn.monthName}, ${weekStartsOn.weekStart}   - ${weekStartsOn.weekEnd}! </h1>`
    }
  }
  
  monthlyDashBoardView(spentOn) {
    alert('monthly view coming soon')
  } 

  customDashBoardView() {
    alert('custom view coming soon')
  }
}
