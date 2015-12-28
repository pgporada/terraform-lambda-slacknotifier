SHELL = /bin/bash

init:
	@terraform remote config \
		-backend=S3 \
		-backend-config="region=us-east-1" \
		-backend-config="bucket=mgmt-useast1-terraform-state" \
		-backend-config="key=lambda/eb_slacknotifications.tfstate"
	@terraform remote pull

update:
	@terraform get -update=true

plan: init update
	@terraform plan -input=true -refresh=true -module-depth=-1 

show: plan
	@terraform show

apply: init update
	@terraform apply -input=true -refresh=true && terraform remote push

destroy: init update
	@terraform destroy && terraform remote push
