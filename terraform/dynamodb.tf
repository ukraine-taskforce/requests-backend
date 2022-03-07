resource "aws_dynamodb_table" "requests" {
  name           = "Requests"
  billing_mode   = "PAY_PER_REQUEST"
//  read_capacity  = 20
//  write_capacity = 20
  hash_key       = "id"
  range_key      = "timestamp"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  attribute {
    name = "peopleCount"
    type = "N"
  }

  global_secondary_index {
    name               = "PeopleCountIndex"
    hash_key           = "peopleCount"
    range_key          = "timestamp"
    projection_type    = "ALL"
  }

}