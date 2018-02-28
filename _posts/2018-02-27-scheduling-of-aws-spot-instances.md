---
layout: post
title: Scheduling of AWS Spot instances
---

At Small Town Heroes we recently started scheduling our Auto Scaling Groups on our staging environment to remove unnecessary costs. To further decrease these costs we decided to start using Spot Instances.

Amazon recently introduced the concept of these spot instances which let's you bid a certain price for an EC2 instance for you to use. These Spot instances are basically unused capacity they are opening up for us to use.

But as Amazon has not yet implemented a scheduling feature for these instances we decided to write a simple Lambda function to do it for us. Combining AWS Cloudwatch rules with the following function gets the job done.

{% highlight js %}
const AWS = require('aws-sdk');
const _ = require('lodash');
const ec2 = new AWS.EC2();

exports.getTimeFromEvent = event => {
    return new Promise((resolve, reject) => {
        if (event.time) {
            const date = new Date(event.time);
            resolve(date.getHours());
        }
        else console.error('No time found');
    });
}

exports.getSpotInstanceRequest = time => {
    return new Promise((resolve, reject) => {
        const params = {};
        ec2.describeSpotInstanceRequests(params, (err, data) => {
            if (err) reject(err);
            const tags = _.uniqBy(_.flatten(_.map(data.SpotInstanceRequests, i => i.Tags)), 'Value');
            const id = tags[0].Value;
            resolve({ id, time });
        });
    });
}

exports.modifySpotInstances = request => {
    return new Promise((resolve, reject) => {
        const capacity = ((request.time === 6) ? process.env.SPOT_INSTANCE_COUNT : 0);
        const params = {
            SpotFleetRequestId: request.id,
            TargetCapacity: capacity
        };
        ec2.modifySpotFleetRequest(params, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}
{% endhighlight %}

{% highlight js %}
exports.handle = (event, context) => {
    instance.getTimeFromEvent(event)
    .then(instance.getSpotInstanceRequest)
    .then(instance.modifySpotInstances)
    .catch(err => {
        console.error(err);
    });
}
{% endhighlight %}
