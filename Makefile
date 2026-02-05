copy-swagger:
	copy ..\backend\docs\swagger.json .\swagger.json

generate-api:
	openapi-ts -i .\swagger.json -o src\api

clear-old:
	if exist .\src\api rmdir /s /q .\src\api

api: copy-swagger clear-old generate-api

.PHONY: api copy-swagger generate-api clear-old