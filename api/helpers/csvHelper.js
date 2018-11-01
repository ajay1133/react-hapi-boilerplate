const orderBy = require('lodash/orderBy');

exports.createCSV = (columns, exportData, separator)=> {
  const content = [];
  let columnOrder;
  const column = [];

  if (columns) {
    columnOrder = columns.map(v => {
      if (typeof v === 'string') {
        return v;
      }

      column.push((typeof v.displayName !== 'undefined') ? v.displayName : v.id);

      return v.id;
    });

    if (column.length > 0) {
      content.push(column.join(separator));
    }
  } else {
    columnOrder = [];
    exportData.forEach(v => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v));
      }
    });

    if (columnOrder.length > 0) {
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
      content.push(columnOrder.join(separator));
    }
  }

  if (Array.isArray(exportData)) {
    exportData.map(v => {
      if (Array.isArray(v)) {
        return v;
      }
      return columnOrder.map(k => {
        if (typeof v[k] !== 'undefined') {
          // We remove blanks and check if the column contains
          // other whitespace,`,` or `"`.
          // In that case, we need to quote the column.

          if (typeof v[k] === 'string' && v[k].replace(/ /g, '').match(/[\s,"]/)) {
            return '"' + v[k].replace(/"/g, '""') + '"';
          }

          return v[k];
        }
        return '';
      });
    }).forEach(v => {
      content.push(v.join(separator));
    });
  }
  return content.join('\r\n');
}

exports.getPositions = (sortedArray, fanId) => {
  let list = [];
  if(sortedArray && sortedArray.length > 0){
    sortedArray = orderBy(sortedArray,['points'], ['desc']);
    let currentItemIndex = sortedArray.findIndex(x =>Number(x.fanId) ===Number(fanId));
    if(currentItemIndex === -1){ // fan itself is not in the list, show the top fan only
      list.push({ Position: 1,Points: sortedArray[0].points,FanId: sortedArray[0].fanId }) //first item
    }else {
    if(currentItemIndex === 0){ // fan itself is at the top position, so there will be only one item in list
      list.push({ Position: 1, Points: sortedArray[currentItemIndex].points, FanId: sortedArray[currentItemIndex].fanId })
    } else if(currentItemIndex === 1){ // fan is at second position (1 index), so there will be 3 items in list    
      list.push({ Position: 1,Points: sortedArray[0].points,FanId: sortedArray[0].fanId }) //first item
      list.push({ Position: 2,Points: sortedArray[1].points,FanId: sortedArray[1].fanId}) // second Item
      list.push({ Position: 3,Points: sortedArray[2].points,FanId: sortedArray[2].fanId}) // third Item
  
    } else { // fan is at some other position, so find its position accordingly, so there will be four items in list
      let prevIndex = currentItemIndex - 1;
      let nextIndex = currentItemIndex + 1;
  
      list.push({ Position: 1, Points: sortedArray[0].points, FanId: sortedArray[0].fanId }); //first item
      list.push({ Position: prevIndex+1,Points: sortedArray[prevIndex].points,FanId: sortedArray[prevIndex].fanId }) //first item
      list.push({ Position: currentItemIndex+1,Points: sortedArray[currentItemIndex].points,FanId: sortedArray[currentItemIndex].fanId}) // second Item
      if(sortedArray[nextIndex]) {
        list.push({ Position: nextIndex+1,Points: sortedArray[nextIndex].points,FanId: sortedArray[nextIndex].fanId}) // fourth Item if exists
      }        
    }
  }
  }  
  return list;
}

exports.getTotalFanPoints = (data)=> {
  return data.reduce(function(result, item) {
      let arr = result.filter((data) => data.FanId === item.FanId);
      if (arr.length === 0) {
        result.push({ FanId: item.FanId, Points: item.Points })
      } else {
        var index = result.findIndex((item) => item.FanId === arr[0].FanId);
        let obj = result[index];
        obj.Points = Number(obj.Points) + Number(item.Points);
        result.splice(index, 1, obj);
      }
      return result;
    }, []);
}

exports.calculatePoints = (adminScore, fanScore, scoreInterval) => {
  if(adminScore === 0 || fanScore === 0){
    return 0;
  } else if(adminScore === fanScore){
    return 1200;
  }else {
    const points = 1000 - ((adminScore - fanScore)/scoreInterval) * ((adminScore - fanScore)/scoreInterval);
    return points <= 0 ? 0 : points;
  }
}