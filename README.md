# ElasticBeanStalk Slack Notifications via AWS Lambda
When needing to make changes to the zip file or state, make sure you alter the eb_slacknotifications.tfvars file to change the filename variable. Once that has been completed, run the following

```
make plan
make apply
```

# Thanks
Thanks to the following two posts for the elasticbeanstalk_slacknotification.js code
* http://blog.turret.io/post-elastic-beanstalk-notifications-to-a-slack-channel/
* https://gist.github.com/turret-io/65a10f7ea14d3e308dd9
