resource "aws_iam_role" "requests_lambda_role" {
  name = "requests_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "requests_lambda_policy" {
  role       = aws_iam_role.requests_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "post_request_lambda_policy" {
  name        = "post_request_lambda_policy"
  description = "post_request_lambda_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sqs:SendMessage",
        "sqs:GetQueueAttributes"
      ],
      "Effect": "Allow",
      "Resource": "${aws_sqs_queue.requests-queue.arn}"
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role" "post_request_lambda_role" {
  name = "post_request_lambda_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "requests_lambda_policy_attachment" {
  role = aws_iam_role.post_request_lambda_role.id
  policy_arn = aws_iam_policy.post_request_lambda_policy.arn
}