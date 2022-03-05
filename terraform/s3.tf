resource "aws_s3_bucket" "ugt_lambda_states" {
  bucket = "ugt-lambda-states"

  force_destroy = true
}

data "archive_file" "lambda_locations_code" {
  type = "zip"

  source_dir  = "${path.module}/../lambda/locations"
  output_path = "${path.module}/locations.zip"
}

resource "aws_s3_object" "lambda_locations" {
  bucket = aws_s3_bucket.ugt_lambda_states.id

  key    = "hello-world.zip"
  source = data.archive_file.lambda_locations_code.output_path

  etag = filemd5(data.archive_file.lambda_locations_code.output_path)
}
