import React,{ useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import Tracklist from './components/Tracklist.jsx'
import Playlist from './components/Playlist.jsx'
import './App.css'

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const handleSearchTracks = (tracks) => {
    setTracks(tracks);
  };

  const handleAddTrack = (track) => {
    // Check if track already exists in playlist
    const isDuplicate = playlist.some(t => t.id === track.id);
    if (!isDuplicate) {
      setPlaylist([...playlist, track]);
    }
  };

  const handleRemoveTrack = (track) => {
    setPlaylist(playlist.filter(t => t.id !== track.id));
  };

  const handleSavePlaylist = (playlistName) => {
    // Here you would typically save to Spotify API
    console.log(`Saving playlist: ${playlistName}`, playlist);
    // For now, just log the playlist data
    // In a real app, you'd call your Spotify API here
    setPlaylist([]);
  };

  return (
    <div className="App" style={{display: 'flex', flexDirection: 'column'}}>
      <SearchBar onSearch={handleSearchTracks} />
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Tracklist tracks={tracks} onAction={handleAddTrack} />
        <Playlist tracks={playlist} onRemove={handleRemoveTrack} onSave={handleSavePlaylist} />
      </div>
    </div>
  )
}

export default App
