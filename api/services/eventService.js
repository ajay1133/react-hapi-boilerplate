const db = require('../db');
const uuidv3 = require('uuid/v3');
const Sequelize = require('sequelize');
const Event = db.models.Event;
const EventParticipant = db.models.EventParticipant;
const FanPoints = db.models.FanPoints;
const EventFan = db.models.EventFan;
const User = db.models.User;
const Boom = require('boom');
const Config = require('config');
const csvHelper = require('../helpers/csvHelper');

/**
 *Return all events for management
 */

exports.getAllEvents = (userId) => new Promise( ( resolve, reject ) => {
  Event.findAndCountAll(
    { 
      where: { userId: userId },
      distinct: true,
      include: [
        {
          model: EventParticipant,
          as: 'participants',
          required: false
        }
      ]
    }
  )
  .then((events) => {
    resolve(events);
  }).catch ((err) => {
    reject(err);
  });
});

/**
 * Return event details on basis of event id
 * @param eventId
 */

exports.getEventDetail = async (whereCondition) => {
  try {
    let eventDetails = await Event.findOne(
      { 
        where: whereCondition,
        include: [
          {
            model: EventParticipant,
            as: 'participants',
            attributes: ['id', 'name', 'status', 'score'],
            required: false
          }
        ]
      }
    );
    if (eventDetails && eventDetails.dataValues) {
      return eventDetails;
    } else {
      return 'Event Detail not found';
    }
  }
  catch(err) {
    return err;
  }
};
/**
 * Return event participants on basis of publicUrl-uuid
 * @param id 
 */
exports.getEventParticipants = async (id) => {
  try {
    let eventFan = await EventFan.findOne({ 
      attributes: [ 'id', 'eventId', 'phoneNumber', 'score', 'publicUrl', 'createdAt', 'updatedAt' ],
      where: {publicUrl: id}
    });
    if (eventFan && eventFan.dataValues) {
      let event = await Event.findOne({where: { id: eventFan.eventId }});
      if (event && event.dataValues) {
        let eventParticipants = await EventParticipant.findAll({ 
            where: { eventId: event.id, status: 1 }               
        });
      //Calculate fan points and position array
      let positionArray = [];
      let calculatedPoints = await FanPoints.sum('points',{where: {eventId: event.id, fanId: eventFan.dataValues.id}});
      let groupedList = await FanPoints.findAll({
        attributes: ['fanId', [Sequelize.fn('SUM', Sequelize.col('points')), 'points']],
        where: { eventId: event.id},
        group: ['fanId']
      });
      positionArray = csvHelper.getPositions(groupedList, eventFan.dataValues.id);
      return {
        id: eventFan.dataValues.id, 
        updatedAt: eventFan.dataValues.updatedAt,
        score: eventFan.dataValues.score, 
        eventDetails: event, 
        participants: eventParticipants,
        calculatedPoints: calculatedPoints ? calculatedPoints : 0,
        positionArray: positionArray
      };
      } else {
        return {calculatedPoints: 0, positionArray: []};
      }
      
    } else {
      return {calculatedPoints: 0, positionArray: []};
    }
  }
  catch(err) {
    return err;
  }
};
/**
 * Create new event
 * @package eventPayload { name, eventDate, minScore, maxScore, scoreInterval, number }
 */

exports.createEvent = async (eventPayload) => {
  try {
    let existingEvent = await Event.findOne({where: {number: eventPayload.number, userId: eventPayload.userId }, attributes: ['id']});
    if (existingEvent && existingEvent.dataValues) {
      return Boom.badRequest("Event code already used.");
    }
    let eventCreated = await Event.create(eventPayload);
    return eventCreated;
  } catch(err) {
    return Boom.internal(err);
  }
}

/**
 * Update existing event
 * @package eventPayload { name, eventDate, minScore, maxScore, scoreInterval, number }
 */
exports.updateEvent = async (eventPayload) => {
  try {
    let eventId = eventPayload.id;
    let userId = eventPayload.userId;
    delete eventPayload.id;
    delete eventPayload.userId;
    let existingEvent = await Event.findOne({where: {number: eventPayload.number, userId: userId, id: {ne: eventId} }, attributes: ['id']});
    if (existingEvent && existingEvent.dataValues) {
      return Boom.badRequest("Event code already used.");
    }
    let eventUpdated = await Event.update(eventPayload, {where: { id: eventId } });
    return eventUpdated;
  } catch(err) {
    return Boom.internal(err);
  }
}

/**
 * Add participant to event
 * @package participantPayload { email, eventId }
 */

exports.addParticipant = async (participantPayload) => {
  try {
    let addedParticipant = await EventParticipant.create({ 
      name: participantPayload.name, 
      eventId: participantPayload.eventId,
      status: participantPayload.status });
    return addedParticipant;
  } catch(err) {
    return err;
  }
}
/**
 * Update participant's score
 * @package payload { id, score, status }
 */

exports.updateParticipantStatus = async (payload) => {
  try {                                                                                
    const nextParticipantId = payload.nextParticipantId;
    delete payload.nextParticipantId;
    let result = await EventParticipant.update(
      { status:payload.status, updatedAt: new Date(), score: payload.score }, 
      { where: { id: payload.activeParticipantId }} 
    );    
    if(result)
    { 
      if(payload.status === 2){
        // update admin score to db and csv as well
        await updatePoints({
          eventId: payload.eventId, 
          participantId:payload.activeParticipantId,
          score: payload.score,
          scoreInterval: payload.scoreInterval});
      }
      if(nextParticipantId > 0){  
        await EventParticipant.update(
          { status: (payload.status === 2 || payload.status === 0) ? 1 : 0, updatedAt: new Date() }, 
          { where: { id: nextParticipantId } });
      }  
      let participants = await EventParticipant.findAll({ 
        where: { eventId: payload.eventId }         
      });
      return { participants: participants};        
    }
    else { 
      //@@TODO
    }      
  } catch(err) {
    return err;
  }
}
/**
 * Update participant to event (used for both updating score and isDeleted as well)
 * @package participantPayload { id, score, isDeleted }
 */

exports.updateParticipant = async (participantPayload) => {
  try {
    const nextParticipantId = participantPayload.nextParticipantId;
    delete participantPayload.nextParticipantId;

    const res = await EventParticipant.update({
      score: participantPayload.score,
      updatedAt: new Date(),
      isDeleted: participantPayload.isDeleted
    }, {
      where: { id: participantPayload.id }
    });

    if(res){
      if(!participantPayload.isDeleted){ // check if request was to update score or isdelete        
          await updatePoints({
            eventId: participantPayload.eventId, 
            participantId:participantPayload.id,
            score: participantPayload.score,
            scoreInterval: participantPayload.scoreInterval});

        // const path = `./api/Files/Event_${participantPayload.eventId}`;
        // const isExists = csvService.isCsvExists(path);
        // if(isExists)
        // {
        //   const list = await csv().fromFile(path);
        //   if(list && list.length > 0)
        //   {
        //     const participantFansList = list.filter(x => Number(x.ParticipantId) === participantPayload.id);
        //     participantFansList.forEach(async element => {
        //       let participantFan = await EventFan.findOne({ 
        //           attributes: ['score','id'], 
        //           where: { id: Number(element.FanId)}                
        //       });
        //       const data = {
        //         Path: path,
        //         FansList: list,
        //         FanId: participantFan.dataValues.id,
        //         ActiveParticipantId: participantPayload.id,
        //         AdminScore: participantPayload.score,
        //         FanScore: participantFan.dataValues.score,
        //         ScoreInterval: participantPayload.scoreInterval
        //       };
        //       csvService.updateCsv(data);
        //     });
        //   };           
        // }  
      }
      if(nextParticipantId !== undefined){
        await EventParticipant.update({status: 1, updatedAt: new Date()}, {where: { id: nextParticipantId}});
      }
    }
    return res;
  } catch(err) {
    return err;
  }
}
/**
 * Get participant of an event by eventId
 * @package event participants { eventId }
 */
exports.getParticipantsByEventId = async ( eventId ) => {
  try {
    const eventParticipants = await EventParticipant.findAll({where: { eventId: eventId }});
  return eventParticipants;
  } catch(err) {
    return err;
  }
};


/**
 * Create new fan
 * @package eventPayload { To, From }
 */

exports.createEventFan = async (eventPayload) => {
  try {
    let To = eventPayload.To.replace('+1', '');
    let Body = eventPayload.Body;
    let event  = await Event.findOne({
      where: { number: Body }, 
      attributes: ['id'],
      include: [{
        model: User,
        as: 'user',
        where: {phoneNumber: To},
        attributes: ['id']
      }]
    });
    if (event && event.dataValues) {
      let eventFan  = await EventFan.findOne({where: {phoneNumber: eventPayload.From, eventId: event.dataValues.id }, attributes: ['publicUrl']});
      if (eventFan && eventFan.dataValues &&  eventFan.dataValues.publicUrl) {
        return { publicUrl: Config.BasePath.host + "/participate/" + eventFan.dataValues.publicUrl };
      } else {
        let uniqueUrl = uuidv3(eventPayload.From + event.id, '1b671a64-40d5-491e-99b0-da01ff1f3341');
        let eventFan = {
          eventId: event.dataValues.id,
          phoneNumber: eventPayload.From,
          publicUrl: uniqueUrl
        };
        let eventCreated = await EventFan.create(eventFan);
        if (eventCreated) {
          return { publicUrl: Config.BasePath.host + "/participate/" + uniqueUrl };
        } else {
          return {message: "Unable to get link"};
        }
      }
    } else {
      return { message: "Invalid event code please text correct event code" };
    }
  } catch(err) {
    return {message: "Invalid event code please text correct event code" };
  }
}

/**
 * Create fan Score
 * @package eventPayload { id, score }
 */

 exports.updateEventFan = async (payload) => {
  try {
    let points = 0;
    await EventFan.update({ score: payload.score, updatedAt: new Date() }, { where: { id: payload.id } });
    let eventFan = await EventFan.findOne({ attributes: ['id', 'updatedAt'], where: { id: payload.id } });
    let eventParticipants = await EventParticipant.findOne({
      attributes: ['id', 'updatedAt'],
      where: { eventId: payload.eventId, status: 1 }
    });

    if (eventParticipants.dataValues.updatedAt < eventFan.dataValues.updatedAt) {
      let fanPointData = await FanPoints.findOne({ 
        attributes : ['id','eventId','participantId','fanId'],
        where: { participantId: payload.activeParticipantId, fanId: payload.id }
      });
      points = csvHelper.calculatePoints(0,payload.score,payload.scoreInterval);
      if(fanPointData) {     
        await FanPoints.update({ points: points }, { where: { id: fanPointData.dataValues.id } });
      } else {
        await FanPoints.create({
          eventId: payload.eventId, 
          participantId: payload.activeParticipantId,
          fanId: payload.id,
          points: points
        });
      }
    } 
    return {calculatedPoints: points};
  } catch(err) {
    console.log('ERROR',err);    
    return Boom.internal(err);
  }
 }

 exports.getAllEventFans = (eventId) => new Promise( ( resolve, reject ) => {
  EventFan.findAndCountAll({
    where: { 
      eventId 
    },
    limit: 10,
    attributes: [ 'id', 'eventId', 'phoneNumber', 'score', 'publicUrl', 'createdAt', 'updatedAt',
    [Sequelize.literal('(SELECT SUM(`fan_points`.`points`) from `fan_points` where  `fan_points`.`fanId`=  `event_fans`.`id`)'), 'fanPoints']
  ], 
  order: [Sequelize.literal('fanPoints DESC')]
  }).then((events) => {
    resolve({events});
  }).catch ((err) => {
    reject(err);
  }); 
});

 /**
 * Find event user id
 * @package eventId
 */

exports.findUserIdByEventId = async (eventId) => {
  try {
    let existingEvent = await Event.findOne({where: {id: eventId }, attributes: ['userId']});
    if (existingEvent && existingEvent.dataValues) {
      return existingEvent.dataValues.userId;
    }
    return null;
  } catch(err) {
    return null;
  }
}

/**
 * Gets list of all fans of an event(grouping by fanId and aggregating score)
 * @package eventId
 */
exports.getGroupedFanPointList  = (eventId) => {  
  try
  {
    let list = FanPoints.findAll({
      attributes: ['fanId', [Sequelize.fn('SUM', Sequelize.col('points')), 'points']],
      where: { eventId: eventId},
      group: ['fanId']
    });
    return list;
  }
  catch(err){
    console.log(err);
    throw err;
  }
}
const updatePoints = async (data) => {
  let fanPointsList = await FanPoints.findAll({
    include: [{
        model: EventFan,
        as: 'fan',
        attributes: ['score'],
        required: true
      }],
      where: { participantId: data.participantId, eventId: data.eventId }
  });
  await Promise.all(fanPointsList.map(async fan => {
    fan.dataValues.points = csvHelper.calculatePoints(data.score, fan.dataValues.fan.dataValues.score,data.scoreInterval);
    return fan;
  }))
  .then((data) => {
    let array = data.map(x=>{return ({id: x.dataValues.id,
    eventId: x.dataValues.eventId,
    participantId: x.dataValues.participantId,
    fanId: x.dataValues.fanId,
    points: x.dataValues.points})});
    FanPoints.bulkCreate(array, { updateOnDuplicate: ['points'] });
  })
  .catch(error => {
    console.log(error);
  });
}