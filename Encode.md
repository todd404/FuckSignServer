## loginUserTime
``` javascript
function initTimeshift() 
{
    var dCurrent = new Date;
    var month = "" + (dCurrent.getMonth() + 1);
    var date = "" + dCurrent.getDate();
    var year = dCurrent.getFullYear();
    return month.length < 2 && (month = "0" + month), date.length < 2 && (date = "0" + date), [year, month, date].join("-");
}
let loginUserTime = md5("qweasd" + initTimeshift());
```
## csrfTimestamp
Just Timestamp

## csrfToken
``` javascript
md5("timestamp=" + timeStamp + ",key=" + "lianyi2019")
```