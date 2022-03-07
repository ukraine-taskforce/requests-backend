resource "aws_dynamodb_table" "requests" {
  name           = "Requests"
  billing_mode   = "PAY_PER_REQUEST"
//  read_capacity  = 20
//  write_capacity = 20
  hash_key       = "id"
//  range_key      = "id"

  attribute {
    name = "id"
    type = "S"
  }

}