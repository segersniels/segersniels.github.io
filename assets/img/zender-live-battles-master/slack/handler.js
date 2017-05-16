'use strict';

// requires
var async = require('async');
var http = require ('https');
var querystring = require ('querystring');
const AWS = require("aws-sdk");
var uuidV1 = require('uuid/v1');

// dynamo settings
const dynamoOptions = {
  region: process.env.REGION,
  endpoint: process.env.AWS_DYNAMO
};

const dynamoClient = new AWS.DynamoDB(dynamoOptions);
const table = new AWS.DynamoDB.DocumentClient(dynamoOptions);

// variable declaration
var timeStamp = null, accountId = null, clusterName = null, containerName = null, currentState = null, desiredState = null, taskId = null, stateCount = null, taskName = null, taskVersion = null, lastKnownStoppedCount = null, lastKnownPendingCount = null;
var postEachRunning = false;

// functions
function setVariables(time, account, cluster, container, state, desired, task){
  timeStamp = time;
  accountId = account;
  clusterName = cluster.split('/').pop();
  containerName = container;
  currentState = state;
  desiredState = desired;
  taskId = task.split('/').pop();
  taskName = taskId.split(':')[0];
  taskVersion = taskId.split(':')[1];
}

function getScanParams(){
  const params = {
    TableName: process.env.TABLE
  };
  return params;
}

function countAmountOfTimesAdded(data, task, state){
  stateCount = 1;
  for(var i = 0;i<data.Count;i++){
    if(data.Items[i].task === task && data.Items[i].state === state){
      stateCount = data.Items[i].count+1;
      break;
    } 
  }
  return stateCount;
}

function checkMatchingStates(data, desired, state, task){
  for(var i = 0;i<data.Count;i++){
    if((data.Items[i].task != task && i+1 === data.Count && desired === 'RUNNING' && state === 'PENDING')) return false;
  }
  if(desired === 'RUNNING' && state === 'PENDING' && data.Count === 0) return false;
  if((desired === 'RUNNING' && state === 'RUNNING') || (desired === 'RUNNING' && state === 'PENDING') || state === 'STOPPED') return true;
}

function checkIfPostIsNewVersion(data){
  var checkName = null, checkVer = null, checkState = null, checkCount = null;
  var statesWithSameName = data.Items.filter(i => i.task.split(':')[0] === taskName);
  var stoppedState = statesWithSameName.filter(i => i.state === 'STOPPED');
  var stoppedCount = stoppedState.map(i => i.count);
  var statesWithSameVersion = statesWithSameName.filter(i => i.task.split(':')[1] === taskVersion);

  if(stoppedCount[0] === 5 && statesWithSameVersion.length === 0) return true;
  else return false;
}

function setColor(state){
  if(state === 'STOPPED') return '#ff3300';
  if(state === 'PENDING') return '#ff9933';
  if(state === 'RUNNING') return '#33cc33';
}

function isCurrentStoppedAndDesiredRunning(){
  if(currentState === 'STOPPED' && desiredState === 'RUNNING') return true;
  else return false;
}

function isCurrentRunningAndDesiredRunning(){
  if(currentState === 'RUNNING' && desiredState === 'RUNNING') return true;
  else return false;
}

function isCurrentStoppedAndDesiredStopped(){
  if(currentState === 'STOPPED' && desiredState === 'STOPPED') return true;
  else return false;
}

function isCurrentPendingAndDesiredRunning(){
  if(currentState === 'STOPPED' && desiredState === 'STOPPED') return true;
  else return false;
}

function postEveryRunningMessage(context,data){
  var entriesWithSameTaskId = data.Items.filter(i => i.task === taskId);
  var running = entriesWithSameTaskId.filter(i => i.state === 'RUNNING');
  var pending = entriesWithSameTaskId.filter(i => i.state === 'PENDING');
  var stopped = entriesWithSameTaskId.filter(i => i.state === 'STOPPED');
  if(!checkIfPostIsNewVersion(data)){
     if(isCurrentRunningAndDesiredRunning() && running[0].count === 1 && pending.length > 0 && stopped[0].count === 1 || stopped.length === 0){
      var payloadStr = null;
      payloadStr = JSON.stringify({
        "username": "ECS Task State Change",
        "icon_emoji": ":package:",
        "attachments": [
            {
                "author_name": process.env.AUTHOR,
                "author_link": process.env.AUTHOR_URL,
                "author_icon": process.env.AUTHOR_IMG,
                "mrkdwn_in": ["text", "pretext"],
                "text": "_Task *" + containerName + "* has deployed successfully and is running version *" + taskId + "*._",
                "color": '#33cc33',
                "footer": "New task deployed successfully"     
            }
        ]
      });

      var postData = querystring.stringify({
        "payload": payloadStr
      });
      var options = {
        hostname: "hooks.slack.com",
        port: 443,
        path: process.env.SLACK_WEBHOOK_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': postData.length
        }
      };
      var req = http.request(options, function(res) {
        console.log("Got response: " + res.statusCode);
        res.on("data", function(chunk) {
          console.log('BODY: '+chunk);
          context.done(null, 'Success message has been posted to Slack!');
        });
      }).on('error', function(e) {
        context.done('error', e);
      });
      req.write(postData);
      req.end();
    }
  }
}

function postUpdatedMessage(context, data){
  var payloadStr = null;
  if(checkIfPostIsNewVersion(data)){
    payloadStr = JSON.stringify({
      "username": "ECS Task State Change",
      "icon_emoji": ":package:",
      "attachments": [
          {
              "author_name": process.env.AUTHOR,
              "author_link": process.env.AUTHOR_URL,
              "author_icon": process.env.AUTHOR_IMG,
              "mrkdwn_in": ["text", "pretext"],
              "text": "_Task *" + containerName + "* is now able to run on version *" + taskId + "* and has now reached it's desired state *" + desiredState + "*._",
              "color": '#33cc33',
              "footer": "New task version deployed successfully"     
          }
      ]
    });
    var postData = querystring.stringify({
      "payload": payloadStr
    });
    var options = {
      hostname: "hooks.slack.com",
      port: 443,
      path: process.env.SLACK_WEBHOOK_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    var req = http.request(options, function(res) {
      console.log("Got response: " + res.statusCode);
      res.on("data", function(chunk) {
        console.log('BODY: '+chunk);
        context.done(null, 'Success message has been posted to Slack!');
      });
    }).on('error', function(e) {
      context.done('error', e);
    });
    req.write(postData);
    req.end();
  }
}

function postErrorMessage(context){
  var payloadStr = JSON.stringify({
    "username": "ECS Task State Change",
    "icon_emoji": ":package:",
    "attachments": [
        {
            "author_name": process.env.AUTHOR,
            "author_link": process.env.AUTHOR_URL,
            "author_icon": process.env.AUTHOR_IMG,
            "mrkdwn_in": ["text", "pretext"],
            "text": "_Looks like task *" + containerName + "*, tagged as *" + taskId + "*, keeps restarting. This happened in cluster *" + clusterName + "* at timestamp *" + timeStamp + "*._",
            "color": '#ff3300',
            "footer": "Task is flapping"     
        }
    ]
  });
  var postData = querystring.stringify({
    "payload": payloadStr
  });
  var options = {
    hostname: "hooks.slack.com",
    port: 443,
    path: process.env.SLACK_WEBHOOK_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };
  var req = http.request(options, function(res) {
    console.log("Got response: " + res.statusCode);
    res.on("data", function(chunk) {
      console.log('BODY: '+chunk);
      context.done(null, 'Error message has been posted to Slack!');
    });
  }).on('error', function(e) {
    context.done('error', e);
  });
  req.write(postData);
  req.end();
}

function assignCorrectId(data, task, state){
  var id = uuidV1();
  for(var i = 0;i<data.Count;i++){
    if(data.Items[i].task === task && data.Items[i].state === state){
      id = data.Items[i].id;
      break;
    }
  }
  return id;
}
  
function putData(task, state, count, data, context){
  var id = assignCorrectId(data,task,state);
  postUpdatedMessage(context, data); 
  var paramsPut = {
    TableName:process.env.TABLE,
    Item:{
      "id": id,
      "task": task,
      "state": state,
      "count": count
    }
  };
  table.put(paramsPut, (err,data) => {
    if(err) console.log(err);
    else cleanUp(context);
  });
}

function cleanUp(context){
  var statesWithSameName, statesWithSameTaskId, ids;
  const paramsScan = {
    TableName: process.env.TABLE
  };

  // before deleting the older versions check if a new version has been added and post an updated message
  // check when a new running state is getting added
  // if there are any older versions of that task still in the table
  // if there are in fact old versions present, remove those
  table.scan(paramsScan, (err, data) => {
    statesWithSameTaskId = data.Items.filter(i => i.task === taskId);
    lastKnownStoppedCount = statesWithSameTaskId.filter(i => i.state === 'STOPPED').map(i => i.count);
    lastKnownPendingCount = statesWithSameTaskId.filter(i => i.state === 'PENDING').map(i => i.count);
    statesWithSameName = data.Items.filter(i => i.task.split(':')[0] === taskName);
    // check for an updated version and post to slack before deleting
    if(currentState === 'RUNNING') ids = statesWithSameName.filter(i => i.task.split(':')[1] !== taskVersion).map(i => i.id);
    async.each(ids, function(id, callback) {
      const paramsDelete = {
        TableName: process.env.TABLE,
        Key: {
          "id": id
        }
      };
      table.delete(paramsDelete, callback);
    }, function(err) {
      if( err ) {
        console.log('Failed to delete');
      } else {
        console.log('Every old version has been deleted');
      }
    });
    setTimeout(function(){
      delayedActions(context);
    }, 9000);
  });
}

function delayedActions(context){
  var statesWithSameTaskId, ids;
  const paramsScan = {
    TableName: process.env.TABLE
  };
  table.scan(paramsScan, (err, data) => {
    if(countAmountOfTimesAdded(data, taskId, 'STOPPED') === 5)
      if(isCurrentPendingAndDesiredRunning()) 
        postErrorMessage(context); 
    if(postEachRunning) postEveryRunningMessage(context, data);
    // check all the tasks with same name
    // get the stopped & running 
    // check if after delay the stopped count is still the same as the running count
    // if the count is still the same delete everything related to that task
    statesWithSameTaskId = data.Items.filter(i => i.task === taskId);
    var runningCount = statesWithSameTaskId.filter(i => i.state === 'RUNNING').map(i => i.count);
    var pendingCount = statesWithSameTaskId.filter(i => i.state === 'PENDING').map(i => i.count);
    var stoppedCount = statesWithSameTaskId.filter(i => i.state === 'STOPPED').map(i => i.count);
    if(runningCount[0] === 1 && lastKnownPendingCount[0] === pendingCount[0] && lastKnownStoppedCount[0] === stoppedCount[0] || stoppedCount.length === 0) ids = statesWithSameTaskId.map(i => i.id);
    console.log(ids);
    async.each(ids, function(id, callback) {
      const paramsDelete = {
        TableName: process.env.TABLE,
        Key: {
          "id": id
        }
      };
      table.delete(paramsDelete, callback);
    }, function(err) {
      if( err ) {
        console.log('Failed to delete');
      } else {
        console.log('Every normal RUNNING task has been deleted');
      }
    });
    console.log(data);
  });
}

// handler function that gets executed when the lambda function is called
module.exports.run = (event, context, callback) => {
  // match the variables with the corresponding values from event (cloudwatch)
  setVariables(event.time, event.account, event.detail.clusterArn, event.detail.containers[0].name, event.detail.lastStatus, event.detail.desiredStatus, event.detail.taskDefinitionArn);
  // scan the table for current contents
  table.scan(getScanParams(), (err, data) => {  
    if(checkMatchingStates(data, desiredState, currentState, taskId)){
      var statesWithSameTaskId = data.Items.filter(i => i.task === taskId);
      var stoppedCount = statesWithSameTaskId.filter(i => i.state === 'STOPPED').map(i => i.count);
      // write the data to the dynamo table, but only when the stopped is not going over 5, saving us costs if it keeps flapping -> timeout = longer = larger cost
      if(stoppedCount[0] <= 4 || stoppedCount.length === 0) putData(taskId, currentState, countAmountOfTimesAdded(data, taskId, currentState), data, context); 
    } 
  });
};