output "S3 Bucket" { value = "${var.bucket}" }
output "You need to add SNS topics" { value = "https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/elasticbeanstalk_slacknotifications?tab=eventSources" }
output "Uploaded file" { value = "${var.filename}" }
