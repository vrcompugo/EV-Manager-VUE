function convertToLocalISOString(date){
  const js_date = new Date(date)
  return (
    js_date.getFullYear() + "-"
    + ("00" + Number(Number(js_date.getMonth()) + 1)).substr(-2) + "-"
    + ("00" + js_date.getDate()).substr(-2) + "T"
    + ("00" + js_date.getHours()).substr(-2) + ":"
    + ("00" + js_date.getMinutes()).substr(-2) + ":"
    + ("00" + js_date.getSeconds()).substr(-2)
  )
}


function convertTimeToGridForDay(date){
  let base = ((date.getHours() - 6) * 4) + 1;
  if (base < 1){
    base = 1;
  }
  let extra = 0;
  if(date.getMinutes() > 0){
    extra = 1;
  }
  if(date.getMinutes() > 15){
    extra = 2;
  }
  if(date.getMinutes() > 30){
    extra = 3;
  }
  if(date.getMinutes() > 45){
    extra = 4;
  }
  if (base + extra > 56){
    base = 56;
  }
  return base + extra;
}

function convertTimeToGridForWeek(date){
  const date_date = new Date(date)
  let base = date_date.getDay();
  if (base < 1){
    base = 7;
  }
  return base;
}

function convertTimeToGridForMonth(date){
  let base = date.getDate();
  return base;
}


function convertEventToColumns(event, gridType, boundary, maxColumn){
  const begin = new Date(event.begin);
  const end = new Date(event.end);
  let endColumn = convertDateToColumn(end, gridType, boundary, maxColumn)
  if(gridType == "month" || gridType == "week"){
    endColumn = endColumn + 1
  }
  const beginColumn = convertDateToColumn(begin, gridType, boundary, maxColumn)
  return [beginColumn, endColumn]
}


function convertDateToColumn(date, gridType, boundary, maxColumn){

  if(boundary){
    if (date < boundary["begin"]){
      return 1;
    }
    if (date > boundary["end"]){
      return maxColumn + 1;
    }
  }

  if(gridType == "week"){
    return convertTimeToGridForWeek(date)
  }
  if(gridType == "month"){
    return convertTimeToGridForMonth(date)
  }
  return convertTimeToGridForDay(date)

}

const convertColumnToDate = function(index, gridType, basedate){
  const basedate_date = new Date(basedate)
  if(gridType == "week"){
    const old_index = convertTimeToGridForWeek(basedate)
    const new_time = basedate_date.getTime() + ((index - old_index) * 86400000)
    return new Date(new_time)
  }
  if(gridType == "month"){
    basedate_date.setDate(index)
    return basedate_date
  }
  basedate_date.setHours((index/4) + 6)
  basedate_date.setMinutes(((index%4)/4)*60)

  return basedate_date
}

export { convertDateToColumn, convertColumnToDate, convertEventToColumns, convertToLocalISOString }
