let io = {};
const eventService = require('../services/eventService');
const csvHelper = require('../helpers/csvHelper');

exports.plugin = {
  name: 'hapi-real-notification',
  register: (server, options) => {
    io = require('socket.io')(server.listener);
    const redis = require('socket.io-redis');
    io.adapter(redis({ host: options.host, port: options.port }));

      io.on('connection', function (socket) {
        server.expose('socket', socket);
        socket.on('countMods', function (data) {
            socket.broadcast.emit(data.userId + '-countMods', { userId: data.userId, count: data.countMods, userDetails: data.userDetails });
      });

      socket.on('activeParticipant',async (data) => {       
        io.emit(data.id, data);     
      });

      socket.on('fanPoints',async (eventId) => { 
        let fanPointsList = await eventService.getGroupedFanPointList(eventId);
        fanPointsList.forEach(fan => {           
          let array = csvHelper.getPositions(fanPointsList, fan.dataValues.fanId);
          const obj = {PositionArray : array, FanPoints: fan.dataValues.points};
          io.emit(fan.dataValues.fanId + '-fanPoints', obj);
        });   
      });

      socket.on('updateLeaderboard', function(eventData) {
        eventService.getAllEventFans(eventData.id).then((event) => {
          let data = {
            count: event.events.count,
            rows: JSON.parse(JSON.stringify(event.events.rows))
          }
          io.emit(eventData.id + '-leaderBoard', data);
        })
      }); 
      
      socket.on('updateEvent', function(eventData) {
        const obj = {
          minScore: eventData.minScore,
          maxScore: eventData.maxScore,
          scoreInterval: eventData.scoreInterval
        }
        io.emit(eventData.id+'-updateEvent',obj);
      });
    });
  }
};