const fs = require('fs');
const csvHelper = require('../helpers/csvHelper');
const constants = require('../constants');
const csv=require('csvtojson')

/**
 * This function creates or re-writes a csv when fan enters score for a participant
 * @param {AdminScore, FanScore, ScoreInterval, Path, FansList, ParticipantId, FanId} data 
 */
exports.saveCSV = async (data) => {  
  try 
  {
    let calculatedPoints = 0;
    const points = calculatePoints(data.AdminScore, data.FanScore, data.ScoreInterval);    
    if(fs.existsSync(data.Path)) { //Already Exist   
        const arrayData =await getArrayFromCsv(data.Path);   
        if(arrayData && arrayData.length > 0){
          const isExist = arrayData.some(x => Number(x.ParticipantId) === data.ParticipantId && 
              Number(x.FanId) === data.FanId);
              
          if(isExist)
          {
            const index = arrayData.findIndex(x => Number(x.ParticipantId) === data.ParticipantId && 
                        Number(x.FanId) === data.FanId);
            const item  = arrayData[index];
            item.Points = points;
            arrayData[index] = item;
          } else {
            arrayData.push({ EventId : data.EventId, ParticipantId: data.ParticipantId, FanId: data.FanId,
               Points: points });            
          }
          const csvContent = csvHelper.createCSV(constants.COLUMNS,arrayData,',');
            fs.writeFileSync(data.Path, csvContent, (err) => {
              if (err) throw err;
            });
           
          const fanList = arrayData.filter(x =>Number(x.EventId) === data.EventId && 
            Number(x.FanId) === data.FanId);
          if(fanList && fanList.length > 0){
            fanList.map(cur => {calculatedPoints=  calculatedPoints + parseInt(cur.Points, 10) });
          }
          return calculatedPoints;          
        }
    } else {
      const rows = [ {EventId : data.EventId, ParticipantId: data.ParticipantId, FanId: data.FanId, Points: points} ];
      const csvContent =csvHelper.createCSV(constants.COLUMNS,rows,',');
      fs.writeFileSync(data.Path, csvContent, (err) => {
        if (err) throw err;
      });
      return 0;
    }
  }
  catch(err){
    throw err;
  }
}

/**
 * This function updates the csv file when admin enters score for a participant
 * @param {AdminScore, FanScore, ScoreInterval, Path, FansList, ActiveParticipantId, FanId} data 
 */
exports.updateCsv = (data) => {
  try 
  {
    const points = calculatePoints(data.AdminScore, data.FanScore, data.ScoreInterval);
    const index = data.FansList.findIndex(x => Number(x.ParticipantId) === data.ActiveParticipantId && 
              Number(x.FanId) === data.FanId);
    const fan  = data.FansList[index];
    fan.Points = points;
    data.FansList[index] = fan;
    const csvContent = csvHelper.createCSV(constants.COLUMNS,data.FansList,',');
    fs.writeFile(data.Path, csvContent, (err) => {
      if (err) throw err;
    });
  }
  catch(err){
    return err;
  }
}
exports.isCsvExists = (path) => {
  return fs.existsSync(path);
}
const getArrayFromCsv = async (path) => {
  try{
    const array = await csv().fromFile(path);
    return array;
  }
  catch(err){
    throw err;
  }
}
const calculatePoints = (adminScore, fanScore, scoreInterval) => {
  if(adminScore === 0 || fanScore === 0){
    return 0;
  } else if(adminScore === fanScore){
    return 1200;
  }else {
    const points = 1000 - ((adminScore - fanScore)/scoreInterval) * ((adminScore - fanScore)/scoreInterval);
    return points <= 0 ? 0 : points;
  }
}