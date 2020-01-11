export default {
  escapeHtml: (unsafe) => {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, '<br>');
  },
  setTitle: function(title) {
    if (title) document.title = title + ' | Texas Gold Card';
    else document.title = "Texas Gold Card";
  },
  json2csv: function(array, headings, quotes) {
    array = typeof array != 'object' ? JSON.parse(array) : array;
    var str = '';
    var line = '';
    if (headings) {
      var head = array[0];
      if (quotes) {
        for (var index in array[0]) {
          var value = index + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      } else {
        for (var index in array[0]) {
          line += index + ',';
        }
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    for (var i = 0; i < array.length; i++) {
      var line = '';
      if (quotes) {
        for (var index in array[i]) {
          var value = array[i][index] + "";
          line += '"' + value.replace(/"/g, '""') + '",';
        }
      } else {
        for (var index in array[i]) {
          line += array[i][index] + ',';
        }
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  },
  isValidCard: function(cardNumber) {
    var pat = new RegExp(/^[0-9]{2,2}-[0-9]{4,4}$/);
    return pat.test(cardNumber);
  },
  isValidPassword: function(password, email) {
    var pattern = new RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{7,32}$");
    if (pattern.test(password)) {
      //valid pattern
      //check if match with email
      var userid = email.substr(0, email.lastIndexOf('@'));
      if (userid.length > 4) {
        var t1 = password.match(userid);
        var t2 = userid.match(password);
        if (t1 || t2) {
          return false;
        }
      }
      return true;
    }
  },
  isValidEmailAddress: function(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
  },
  currencyFormat: function(x) {//add commas to number thousands,millions...
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
