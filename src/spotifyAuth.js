const SPOTIFY_CONFIG = {
    REDIRECT_URI: 'http://127.0.0.1:5173',
    CLIENT_ID: '8e2ecafb93f54b8fb34fb647f756cb47',
    AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
    API_BASE_URL: 'https://api.spotify.com/v1'
}

// What permissions does your app need?
const SCOPES = [
    'playlist-modify-private'  // Create and modify private playlists
  ];

export const loginWithSpotify = () => {
    const url = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?client_id=${SPOTIFY_CONFIG.CLIENT_ID}&scope=${SCOPES[0]}&redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.REDIRECT_URI)}&response_type=code`;
    window.location.href = url;
};


export const exchangeCodeforToken = async (authorizationCode) => {
    try {
        const response = await fetch('http://localhost:3001/exchange-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: authorizationCode })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error details:', errorText);
            return null;
        }
        
        const data = await response.json();
        
        if (data.access_token) {
            localStorage.setItem('spotify_access_token', data.access_token);
            const expirationTime = Date.now() + (data.expires_in * 1000);
            localStorage.setItem('spotify_expiration_date', expirationTime);
            return data.access_token;
        } else {
            console.error('❌ No access token in backend response:', data);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Network error during token exchange:', error);
        return null; // Return null instead of crashing
    }
};

export const handleSpotifyCallback = async () => {
    try {
      // Check if we have a code in the URL
      if (window.location.search.includes('code=')) {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        
        if (code) {
          
          // Check if we've already processed this code
          const processedCode = sessionStorage.getItem('processed_auth_code');
          if (processedCode === code) {
            return null;
          }
          
          const token = await exchangeCodeforToken(code);
          
          if (token) {
            // Mark this code as processed
            sessionStorage.setItem('processed_auth_code', code);
            return token;
          } else {
            console.error('❌ Token exchange failed - no token returned');
            return null;
          }
        } else {
          console.error('❌ No authorization code found in URL params');
          return null;
        }
      } else {
        console.log('❌ No authorization code found in URL');
        return null;
      }
      
    } catch (error) {
      console.error('❌ Error in handleSpotifyCallback:', error);
      return null; // Return null instead of throwing error
    }
  };


export const isLoggedIn = () => {
    try {
      const token = localStorage.getItem('spotify_access_token');
      const expirationDate = parseInt(localStorage.getItem('spotify_expiration_date'));
      
      if (token && expirationDate && Date.now() < expirationDate) {
        return true;
      } else {
        // Clean up expired tokens
        if (token) {
          localStorage.removeItem('spotify_access_token');
        }
        if (expirationDate) {
          localStorage.removeItem('spotify_expiration_date');
        }
        return false;
      }
    } catch (error) {
      console.log("❌ Error checking login status:", error);
      return false;
    }
  };

  export const searchSpotifyTracks = async (query) => {
    try {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token) {
        throw new Error('No access token found');
      }
      
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform Spotify's response to match your Track component structure
      return data.tracks.items.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists[0].name,
        uri: track.uri
      }));
      
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  };

  export const saveSpotifyPlaylist = async (playlistName, trackUris) => {
    try {
      const token = localStorage.getItem('spotify_access_token');
      
      if (!token) {
        throw new Error('No access token found');
      }
      
      // Step 1: Get the current user's ID
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error(`Failed to get user info: ${userResponse.status}`);
      }
      
      const userData = await userResponse.json();
      const userId = userData.id;

      // Step 2: Create the playlist
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'A playlist created by Jammming',
          public: false
        })
      });
      
      if (!createResponse.ok) {
        throw new Error(`Failed to create playlist: ${createResponse.status}`);
      }
      
      const playlistData = await createResponse.json();
      const playlistId = playlistData.id;

      // Step 3: Add tracks to the playlist
      if (trackUris && trackUris.length > 0) {
        const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: trackUris
          })
        });
        
        if (!addTracksResponse.ok) {
          throw new Error(`Failed to add tracks: ${addTracksResponse.status}`);
        }
      }
      
      return playlistId;
      
    } catch (error) {
      console.error('Error saving playlist:', error);
      return null;
    };
  };
