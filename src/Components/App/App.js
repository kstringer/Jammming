import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {searchResults: [], playlistName: 'New Playlist', playlistTracks: []};

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(this.state.playlistTracks.find(trackCheck => trackCheck.id === track.id)){
      return;
    }else {
      let newPlaylist = this.state.playlistTracks;
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track){
    let remove = this.state.playlistTracks.findIndex(trackCheck => trackCheck.id === track.id);
    let removedPlaylist = this.state.playlistTracks;
    removedPlaylist.splice(remove,1);
    this.setState({playlistTracks: removedPlaylist});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const uris = this.state.playlistTracks.map(uri => {
      return uri.uri;
    });
    Spotify.savePlaylist(this.state.playlistName,uris);
    this.setState({
      playlistTracks: [],
      playlistName: "New Playlist"
    });
  }

  search(term){
    Spotify.getAccessToken();
    Spotify.search(term).then(track => {
      this.setState({
        searchResults: track
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
