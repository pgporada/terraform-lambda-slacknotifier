provider "aws" {
    access_key = "${var.aws_access_key}"
    secret_key = "${var.aws_secret_key}"
    region = "${var.region}"
}

resource "aws_iam_role" "iam_slacknotifications_for_elasticbeanstalk" {
    name = "mgmt_eb_iamrole_slacknotifications"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_s3_bucket_object" "object" {
    bucket = "${var.bucket}"
    key = "lambda/${var.filename}"
    source = "./${var.filename}"
}

//http://blog.turret.io/post-elastic-beanstalk-notifications-to-a-slack-channel/
//https://gist.github.com/turret-io/65a10f7ea14d3e308dd9
resource "aws_lambda_function" "slacknotificationsforelasticbeanstalk" {
	s3_bucket = "${aws_s3_bucket_object.object.bucket}"
	s3_key = "${aws_s3_bucket_object.object.key}"
    function_name = "elasticbeanstalk_slacknotifications"
    role = "${aws_iam_role.iam_slacknotifications_for_elasticbeanstalk.arn}"
    handler = "elasticbeanstalk_slacknotifications.handler"
}
