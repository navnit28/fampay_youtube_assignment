
# Fampay Youtube Assignment Backend
- I have made this project in NodeJs using node-cron library which calls the youtube search api for the query "india news" and published after 18th of August.
- Then there are three api's in this project one for getiing the videos from the database and second one is the search api to search the query given by the user in the title and description of the videos.The third api is to add api keys in the database.
- I have used mongodb as the database and redis as the cache.
- I stored the count of api_key being stored in redis as key value pair.
- The cron job runs every minute and fetches videos through the Youtube search api.
- From there the video details are stored in the database and if the api key has crossed the maximum number of times which I have taken as 3 then my code will automatically take the next api_key in the array.


## Run Locally

Clone the project

```bash
  git clone https://github.com/navnit28/fampay_youtube_assignment.git
```

Go to the project directory

```bash
  cd fampay_youtube_assignment
```

Build the docker compose file

```bash
  docker-compose build
```

Run the docker compose file

```bash
  docker-compose up
```
Stop the docker compose file

```bash
  docker-compose down
```


## API Reference

#### Get paginated videos

```http
  GET /api/youtube/videos
```

| Query Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `limit` | `string` |  It is number of videos to be displayed on one page (default 100)|
| `page` | `string` | It is the page number (default 1)|

#### Get search

```http
  GET /api/youtube/search
```

| Query Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `q`      | `string` | **Required**. The string which you want to search |
| `limit` | `string` |  It is number of videos to be displayed on one page (default 100)|
| `page` | `string` | It is the page number (default 1)|


## Screenshots

![App Screenshot](https://i.ibb.co/0mVVR6d/Screenshot-2022-08-20-at-12-34-36-AM.png)
![App Screenshot](https://i.ibb.co/nz7FjDz/Screenshot-2022-08-20-at-12-34-48-AM.png)
