var moment = require('moment');

const formatDateTime = (created,updated)=>{
  let now = moment();
  created = moment(created, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
  updated = moment(updated,"YYYY-MM-DD'T'HH:mm:ss:SSSZ");
  let readAboutHistory;
   if (updated > created ) {
     readAboutHistory = "Last edited ";
   } else {
      readAboutHistory = "Created ";
   }
  let days = moment.duration(updated.diff(now)).days();
  let months  = moment.duration(updated.diff(now)).months();
  let weeks = moment.duration(updated.diff(now)).weeks();
  let years = moment.duration(updated.diff(now)).years();
  let hours = moment.duration(updated.diff(now)).hours();
  let minutes = moment.duration(updated.diff(now)).minutes();
  let seconds = moment.duration(updated.diff(now)).seconds();

  now.subtract({days:days,months:months,years:years,hours: hours, minutes: minutes, seconds: seconds});
return readAboutHistory+now.toNow();
}

export {formatDateTime};
