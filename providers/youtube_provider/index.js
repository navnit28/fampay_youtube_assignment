const axios = require('axios');
class YouTubeProvider {
  constructor() {
    this.endpoint ={} 
    this.endpoint.search=axios.create({
        baseURL:'https://www.googleapis.com/youtube/v3/search',
    });
    }

  async getSearchResults() {
    const api_path=`?part=snippet&q=top india news&type=video&key=AIzaSyANpIHL293RawlG2a7FvCoob1hoLz_Ao4I&order=date&publishedAfter=2022-08-18T00:00:00Z`
    const resp= await this.endpoint.search
    .get(api_path)
    // console.log(resp.data)
    return resp.data
  }
}
module.exports = YouTubeProvider;