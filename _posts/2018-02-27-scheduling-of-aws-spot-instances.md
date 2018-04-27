---
layout: post
title: Scheduling of AWS Spot instances
---

Outdated...

At Small Town Heroes we recently started scheduling our Auto Scaling Groups on our staging environment to remove unnecessary costs. To further decrease these costs we decided to start using Spot Instances.

Amazon recently introduced the concept of these spot instances which let's you bid a certain price for an EC2 instance for you to use. These Spot instances are basically unused capacity they are opening up for us to use.

But as Amazon has not yet implemented a scheduling feature for these instances we decided to write a simple Lambda function to do it for us. Combining AWS Cloudwatch rules with the following function gets the job done.

{% highlight js %}
const AWS = require('aws-sdk');
const _ = require('lodash');
const ec2 = new AWS.EC2();

exports.getTimeFromEvent = event => {
    return new Promise((resolve, reject) => {
        if (event.time) {
            const date = new Date(event.time);
            resolve(date.getHours());
        }
        else console.error('No time found in event');
    });
}

exports.getSpotInstanceRequest = time => {
    return new Promise((resolve, reject) => {
        const params = {};
        ec2.describeSpotInstanceRequests(params, (err, data) => {
            if (err) reject(err);
            const requests = _.filter(data.SpotInstanceRequests, i => i.LaunchSpecification.IamInstanceProfile.Name.split('-')[0] === 'foo' || i.LaunchSpecification.IamInstanceProfile.Name.split('-')[0] === 'bar');
            const names = _.map(requests, i => i.LaunchSpecification.IamInstanceProfile.Name);
            const tags = _.flatten(_.map(requests, i => i.Tags));
            const ids = _.map(tags, i => i.Value);
            resolve({ ids, time, names });
        });
    });
}

exports.modifySpotInstances = request => {
    return new Promise((resolve, reject) => {
        let check = [];
        _.forEach(request.ids, (id, index) => {
            if (check.indexOf(id) < 0) {
                const count = ((request.names[index].split('-')[0] === 'foo') ? process.env.FOO_SPOT_INSTANCE_COUNT : process.env.BAR_SPOT_INSTANCE_COUNT);
                const capacity = ((request.time === 6) ? count : 0);
                const params = {
                    SpotFleetRequestId: id,
                    TargetCapacity: capacity
                };
                ec2.modifySpotFleetRequest(params, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
                check.push(id);
            }
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
