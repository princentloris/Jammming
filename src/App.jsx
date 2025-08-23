import React,{ useState, useEffect } from 'react'
import SearchBar from './components/SearchBar.jsx'
import Tracklist from './components/Tracklist.jsx'
import Playlist from './components/Playlist.jsx'
import { 
  isLoggedIn, 
  searchSpotifyTracks, 
  saveSpotifyPlaylist,
  handleSpotifyCallback,
  loginWithSpotify
} from './spotifyAuth.js'
import './App.css'
import Button from './components/Button.jsx'

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [loginStatus, setLoginStatus] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isLoggedIn();
      setLoginStatus(loggedIn);
    };

    // Check initial login status
    checkLoginStatus();

    // Handle Spotify callback if user is returning from auth
    const handleCallback = async () => {
      const token = await handleSpotifyCallback();
      if (token) {
        checkLoginStatus();
      }
    };

    handleCallback();
  }, []);

  const handleSearchTracks = async (query) => {
    if (!loginStatus) {
      console.log('User not logged in');
      return;
    }

    try {
      const searchResults = await searchSpotifyTracks(query);
      setTracks(searchResults);
    } catch (error) {
      console.error('Error searching tracks:', error);
      setTracks([]);
    }
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

  const handleSavePlaylist = async (playlistName) => {
    if (!loginStatus) {
      console.log('User not logged in');
      return;
    }

    if (playlist.length === 0) {
      console.log('No tracks in playlist to save');
      return;
    }

    try {
      const trackUris = playlist.map(track => track.uri);
      const playlistId = await saveSpotifyPlaylist(playlistName, trackUris);
      
      if (playlistId) {
        console.log(`Playlist saved successfully with ID: ${playlistId}`);
        setPlaylist([]); // Clear the playlist after successful save
      } else {
        console.error('Failed to save playlist');
      }
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  return (
    <div className="App">
      {!loginStatus ? (
        // Login screen
        <div className="login-screen">
          <h1 className="login-title">Welcome to Jammming</h1>
          <p className="login-subtitle">
            Create and manage your Spotify playlists with ease. Search for tracks, build your perfect playlist, and save it directly to your Spotify account.
          </p>
          <Button 
            text="Login with Spotify" 
            onClick={loginWithSpotify} 
            variant="primary"
            size="large"
          />
        </div>
      ) : (
        // Main app interface
        <>
          <div className="app-header">
            <h1 className="app-title">Jammming</h1>
            <p className="app-subtitle">Build your perfect playlist</p>
          </div>
          
          <SearchBar onSearch={handleSearchTracks} />
          
          <div className="app-content">
            <Tracklist tracks={tracks} onAction={handleAddTrack} title="Search Results" />
            <Playlist tracks={playlist} onRemove={handleRemoveTrack} onSave={handleSavePlaylist} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
