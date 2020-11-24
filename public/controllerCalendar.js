// eslint-disable-next-line no-unused-vars
class ControllerCalendar {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.view.addListener((event) => {
      if(event.code == 'signupForm') {
        // alert('on the right track')
        this.model.sendToServerSignUp(event.form)
      } else if(event.code === "loginForm") {
        this.model.sendToServerLogIn(event.form)
      } else if (event.code  === 'authorize') {
        // alert('conroller: authorize button click recieved')
        this.model.handleAuthClick();
      }else if (event.code  === 'closepp') {
        if(document.getElementById('mySelect').value.startsWith('da')) {
          this.model.dailyModel(document.getElementById('daily').value);
        } else if (document.getElementById('mySelect').value.startsWith('week')) {
          this.model.weeklyModel(document.getElementById('weekly').value);
        }
      } else if (event.code === 'signOut') {
          this.model.handleSignoutClick();
      } else if (event.code.startsWith('week')) {
          this.model.weeklyModel('week1');
      } else if (event.code.startsWith('da')) {
          this.model.dailyModel('day1');
      } else if(event.code.startsWith('month')) {
        
     } else if(event.code.startsWith('custom')) {

     } else if (event.code === 'right-arrow') {
      //  alert('NOPE')
        let current = document.getElementById('mySelect').value
        if(current.startsWith('week')) {
          this.moveWeekRight(current)
        } else if (current.startsWith('da')) {
          this.moveDayRight(current);
        }
     } else if (event.code === 'left-arrow') {
      //  alert('heyy')
      let current = document.getElementById('mySelect').value
      if(current.startsWith('week')) {
        this.moveWeekLeft(current)
      } else if (current.startsWith('da')) {
        this.moveDayLeft(current);
        // alert('progress')
      }
      // or(mySelect.options[mySelect.selectedIndex].value)
     }
  })
  }  
  moveWeekRight(current) {
    switch (current) {
      case 'week4':
        this.model.weeklyModel('week3')
        break;
      case 'week3':
        this.model.weeklyModel('week2')
        break;
      case 'week2':
        this.model.weeklyModel('week1')
        break;
      default:
        break;
    }
  }
  moveWeekLeft(current) {
    switch (current) {
      case 'week1':
        this.model.weeklyModel('week2')
        break;
      case 'week2':
        this.model.weeklyModel('week3')
        break;
      case 'week3':
        this.model.weeklyModel('week4')
        break;
      default:
        break;
    }
  }

  moveDayLeft(current) {
    // alert(current);
    switch (current) {
      case 'day1':
        // alert('in there')
        this.model.dailyModel('day2')
        break;
      case 'day2':
        this.model.dailyModel('day3')
        break;
      case 'day3':
        this.model.dailyModel('day4')
        break;
      case 'day4':
        // alert('in there')
        this.model.dailyModel('day5')
        break;
      case 'day5':
        this.model.dailyModel('day6')
        break;
      case 'day6':
        this.model.dailyModel('day7')
        break;
      case 'day7':
        this.model.dailyModel('day8')
        break;
      case 'day8':
        this.model.dailyModel('day9')
        break;
      case 'day9':
        this.model.dailyModel('day10')
        break;
      case 'day10':
        this.model.dailyModel('day11')
        break;
      case 'day11':
        this.model.dailyModel('day12')
        break; 
      case 'day12':
        this.model.dailyModel('day13')
        break; 
      case 'day13':
        this.model.dailyModel('day14')
        break;  
      default:
        break;
    }
  }
  moveDayRight(current) {
    // alert('1I feel you ' + current)
    switch (current) {
    case 'day14':
      this.model.dailyModel('day13')
      break; 
    case 'day13':
      this.model.dailyModel('day12')
      break; 
    case 'day12':
      this.model.dailyModel('day11')
      break; 
    case 'day11':
      this.model.dailyModel('day10')
      break; 
      case 'day10':
        this.model.dailyModel('day9')
        break; 
      case 'day9':
        this.model.dailyModel('day8')
        break;      
      case 'day8':
        this.model.dailyModel('day7')
        break;
      case 'day7':
        this.model.dailyModel('day6')
        break;
      case 'day6':
        this.model.dailyModel('day5')
        break;
      case 'day5':
        this.model.dailyModel('day4')
        break;
      case 'day4':
        this.model.dailyModel('day3')
        break;
      case 'day3':
        // alert('2there')
        this.model.dailyModel('day2')
        break;
      case 'day2':
        this.model.dailyModel('day1')
        break;
      default:
        break;
    }
  }
}
