resource "aws_apigatewayv2_api" "ugt_gw" {
  name          = "ugt_gw_api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "ugt_gw_stage" {
  api_id = aws_apigatewayv2_api.ugt_gw.id

  name        = "live"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.ugt_api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    }
    )
  }
}

resource "aws_cloudwatch_log_group" "ugt_api_gw" {
  name = "/aws/ugt_api_gw/${aws_apigatewayv2_api.ugt_gw.name}"

  retention_in_days = 30
}

//Locations API
resource "aws_lambda_permission" "locations" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.locations.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.ugt_gw.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "get_locations" {
  api_id = aws_apigatewayv2_api.ugt_gw.id

  integration_uri    = aws_lambda_function.locations.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_locations" {
  api_id = aws_apigatewayv2_api.ugt_gw.id

  route_key = "GET /api/v1/requests/locations"
  target    = "integrations/${aws_apigatewayv2_integration.get_locations.id}"
}

//Supplies API
resource "aws_lambda_permission" "supplies" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.supplies.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.ugt_gw.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "get_supplies" {
  api_id = aws_apigatewayv2_api.ugt_gw.id

  integration_uri    = aws_lambda_function.supplies.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_supplies" {
  api_id = aws_apigatewayv2_api.ugt_gw.id

  route_key = "GET /api/v1/requests/supplies"
  target    = "integrations/${aws_apigatewayv2_integration.get_supplies.id}"
}