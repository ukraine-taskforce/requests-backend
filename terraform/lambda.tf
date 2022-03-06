//Locations API
resource "aws_lambda_function" "locations" {
  function_name = "GetLocations"

  s3_bucket = aws_s3_bucket.ugt_lambda_states.id
  s3_key    = aws_s3_object.lambda_locations.key

  runtime = "nodejs12.x"
  handler = "locations.handler"

  source_code_hash = data.archive_file.lambda_locations_code.output_base64sha256

  role = aws_iam_role.requests_lambda_role.arn
}

resource "aws_cloudwatch_log_group" "locations" {
  name = "/aws/lambda/${aws_lambda_function.locations.function_name}"

  retention_in_days = 30
}

//Supplies API
resource "aws_lambda_function" "supplies" {
  function_name = "GetSupplies"

  s3_bucket = aws_s3_bucket.ugt_lambda_states.id
  s3_key    = aws_s3_object.lambda_supplies.key

  runtime = "nodejs12.x"
  handler = "supplies.handler"

  source_code_hash = data.archive_file.lambda_supplies_code.output_base64sha256

  role = aws_iam_role.requests_lambda_role.arn
}

resource "aws_cloudwatch_log_group" "supplies" {
  name = "/aws/lambda/${aws_lambda_function.supplies.function_name}"

  retention_in_days = 30
}

//Requests API
resource "aws_lambda_function" "requests" {
  function_name = "PostRequest"

  s3_bucket = aws_s3_bucket.ugt_lambda_states.id
  s3_key    = aws_s3_object.lambda_requests.key

  runtime = "nodejs12.x"
  handler = "requests.handler"

  source_code_hash = data.archive_file.lambda_requests_code.output_base64sha256

  role = aws_iam_role.post_request_lambda_role.arn

  timeout = 30

  environment {
    variables = {
      sqs_url = aws_sqs_queue.requests-queue.url
    }
  }
}

resource "aws_cloudwatch_log_group" "requests" {
  name = "/aws/lambda/${aws_lambda_function.requests.function_name}"

  retention_in_days = 30
}

//SQS listener
resource "aws_lambda_function" "processor" {
  function_name = "SaveRequest"

  s3_bucket = aws_s3_bucket.ugt_lambda_states.id
  s3_key    = aws_s3_object.lambda_processor.key

  runtime = "nodejs12.x"
  handler = "processor.handler"

  source_code_hash = data.archive_file.lambda_processor_code.output_base64sha256

  role = aws_iam_role.read_request_lambda_role.arn

  timeout = 30

  environment {
    variables = {
      sqs_url = aws_sqs_queue.requests-queue.url
      table_name = aws_dynamodb_table.requests.name
    }
  }
}

resource "aws_cloudwatch_log_group" "listener" {
  name = "/aws/lambda/${aws_lambda_function.processor.function_name}"

  retention_in_days = 30
}

# Event source from SQS
resource "aws_lambda_event_source_mapping" "event_source_mapping" {
  event_source_arn = aws_sqs_queue.requests-queue.arn
  enabled          = true
  function_name    = aws_lambda_function.processor.arn
  batch_size       = 1
}
