let accessToken = '';
const client_id = 'a1dd626bec6549fca4be51c06155229e';
const redirect_uri = 'http://ktsjammming.surge.sh/';

const Spotify = {
  getAccessToken(){
    if(accessToken){
      return accessToken;
    }else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      const expirationTime = window.location.href.match(/expires_in=([^&]*)/)[1];

      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      window.history.pushState('Access Token', null, '/');
    }else if(!window.location.href.match(/access_token=([^&]*)/)){
      window.location = 'https://accounts.spotify.com/authorize?client_id=' + client_id + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirect_uri;
    }
  },

  search(term){
    this.getAccessToken();
    return fetch('https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=' + term, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks){
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }else {
        return [];
      }
    });
  },

  savePlaylist(playlistName,URIs){
    if(!playlistName || !URIs.length) {
      return;
    }
    let userId = '';
    let playlistID = '';


    fetch('https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me',{
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userId = jsonResponse.id;

      fetch('https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/' + userId + '/playlists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'},
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if(response.ok){
            return response.json();
          }
          throw new Error ('Request Failed');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          playlistID = jsonResponse.id;

          fetch('https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/playlists/' + playlistID + '/tracks', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'},
              body: JSON.stringify({uris: URIs})
            }).then(response => {
              if(response.ok){
                return response.json();
              }
              throw new Error ('Request Failed');
            }, networkError => console.log(networkError.message)
          );
        });
      });
    }



};

export default Spotify;
