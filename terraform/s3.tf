resource "aws_s3_bucket" "ugt_lambda_states" {
  bucket = "ugt-lambda-states"

  force_destroy = true
}

//Locations API
data "archive_file" "lambda_locations_code" {
  type = "zip"

  source_dir  = "${path.module}/../lambda/locations"
  output_path = "${path.module}/locations.zip"
}

resource "aws_s3_object" "lambda_locations" {
  bucket = aws_s3_bucket.ugt_lambda_states.id

  key    = "locations.zip"
  source = data.archive_file.lambda_locations_code.output_path

  etag = filemd5(data.archive_file.lambda_locations_code.output_path)
}

//Supplies API
data "archive_file" "lambda_supplies_code" {
  type = "zip"

  source_dir  = "${path.module}/../lambda/supplies"
  output_path = "${path.module}/supplies.zip"
}

resource "aws_s3_object" "lambda_supplies" {
  bucket = aws_s3_bucket.ugt_lambda_states.id

  key    = "supplies.zip"
  source = data.archive_file.lambda_supplies_code.output_path

  etag = filemd5(data.archive_file.lambda_supplies_code.output_path)
}
