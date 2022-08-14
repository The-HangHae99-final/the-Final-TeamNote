# name: CI-CD2
# on:
#   push:
#     branches:
#       - main
#   pull_request:
#     branches:
#       - main
# jobs:
#   build:
#     runs-on: ubuntu-latest
#     steps:
#       - name: Deploy
#         uses: appleboy/ssh-action@master
#         with:
#           host: ${{ secrets.HOST }}
#           username: ubuntu
#           key: ${{ secrets.PRIVATE_KEY }}
#           port: 22
#           script: |
#             cd /home/ubuntu/the-Final-TeamNote
#             git config --global --add safe.directory /home/ubuntu/the-Final-TeamNote
#             sudo git pull
#             sudo npm update
#             sudo npm install
#             sudo pm2 reload all
#
