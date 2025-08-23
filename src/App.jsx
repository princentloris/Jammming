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
      console.log('🔍 Checking login status:', loggedIn);
      console.log('🔍 Local storage token:', localStorage.getItem('spotify_access_token'));
      console.log('🔍 Local storage expiration:', localStorage.getItem('spotify_expiration_date'));
      setLoginStatus(loggedIn);
    };

    // Check initial login status
    checkLoginStatus();

    // Handle Spotify callback if user is returning from auth
    const handleCallback = async () => {
      const token = await handleSpotifyCallback();
      if (token) {
        console.log('✅ Got token from callback, updating login status');
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
    <div className="App" style={{display: 'flex', flexDirection: 'column'}}>

      
      {!loginStatus ? (
        // Login screen
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <h1 style={{marginBottom: '2rem', fontSize: '3rem', color: '#1DB954'}}>Welcome to Jammming</h1>

          <Button text="Login with Spotify" onClick={loginWithSpotify} type="button" />
        </div>
      ) : (
        // Main app interface
        <>
          <SearchBar onSearch={handleSearchTracks} />
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            <Tracklist tracks={tracks} onAction={handleAddTrack} title="Results" />
            <Playlist tracks={playlist} onRemove={handleRemoveTrack} onSave={handleSavePlaylist} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
