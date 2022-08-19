# Run in Docker

# To build
docker-compose build

# use -d flag to run in background
docker-compose up

# Tear down
docker-compose down

# I have choosen the key word - 'news'
# Server is now running on localhost:3000 
- http://localhost:3000/api/youtube/videos?limit=5&page=1 (get paginated result api and api_key automatically gets updated once it used for 5 times)
- http://localhost:3000/api/youtube/search?limit=5&page=1&q=news abp top (search api with paginated result and with partial results as well)
