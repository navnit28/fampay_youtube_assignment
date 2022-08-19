const axios = require('axios');
class YouTubeProvider {
  constructor() {
    this.endpoint ={} 
    this.endpoint.search=axios.create({
        baseURL:'https://www.googleapis.com/youtube/v3/search',
    });
    }

  async getSearchResults(api_key) {
    const api_path=`?part=snippet&q=news&type=video&key=${api_key}&order=date&publishedAfter=2022-08-18T00:00:00Z`
    const resp= await this.endpoint.search
    .get(api_path)
    // console.log(resp.data)
    return resp.data
  }
}
module.exports = YouTubeProvider;