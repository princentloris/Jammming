const SPOTIFY_CONFIG = {
    REDIRECT_URI: 'http://127.0.0.1:5173',
    CLIENT_ID: '8e2ecafb93f54b8fb34fb647f756cb47',
    AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
    API_BASE_URL: 'https://api.spotify.com/v1'
}

// What permissions does your app need?
const SCOPES = [
    'playlist-modify-private',  // Create and modify private playlists
    'user-read-playback-state', // Read playback state
    'user-modify-playback-state' // Modify playback state
  ];

export const loginWithSpotify = () => {
  const scopesString = SCOPES.join(' ');
  const url = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?client_id=${SPOTIFY_CONFIG.CLIENT_ID}&scope=${encodeURIComponent(scopesString)}&redirect_uri=${encodeURIComponent(SPOTIFY_CONFIG.REDIRECT_URI)}&response_type=code`;
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

// Add this at the top of your file, outside any function
let isProcessingAuth = false;

export const handleSpotifyCallback = async () => {
  try {
    // Prevent multiple simultaneous auth processing
    if (isProcessingAuth) {
      console.log('⚠️ Auth already in progress, skipping...');
      return null;
    }
    
    // Check if we have a code in the URL
    if (window.location.search.includes('code=')) {
      console.log('�� Authorization code found in URL, processing...');
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      
      if (code) {
        console.log('✅ Authorization code extracted:', code.substring(0, 10) + '...');
        
        // Check if we've already processed this code
        const processedCode = sessionStorage.getItem('processed_auth_code');
        console.log('🔍 Previously processed code:', processedCode);
        console.log('🔍 Current code:', code);
        console.log('🔍 Are they equal?', processedCode === code);
        
        if (processedCode === code) {
          console.log('⚠️ Code already processed, clearing URL...');
          // Clear the URL since we've already processed this code
          window.history.replaceState({}, document.title, window.location.pathname);
          return null;
        }
        
        // Set the flag to prevent multiple simultaneous processing
        isProcessingAuth = true;
        
        try {
          console.log('🔄 Exchanging code for token...');
          const token = await exchangeCodeforToken(code);
          
          if (token) {
            console.log('✅ Token exchange successful!');
            // Mark this code as processed
            sessionStorage.setItem('processed_auth_code', code);
            
            // Clear the authorization code from URL after successful exchange
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('🧹 URL cleared successfully');
            
            return token;
          } else {
            console.error('❌ Token exchange failed - no token returned');
            // Clear the URL even on failure to prevent retry attempts
            window.history.replaceState({}, document.title, window.location.pathname);
            return null;
          }
        } finally {
          // Always reset the flag, whether success or failure
          isProcessingAuth = false;
        }
      } else {
        console.error('❌ No authorization code found in URL params');
        return null;
      }
    } else {
      console.log('ℹ️ No authorization code found in URL');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error in handleSpotifyCallback:', error);
    // Clear the URL on error to prevent retry attempts
    if (window.location.search.includes('code=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Reset the flag on error
    isProcessingAuth = false;
    return null;
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


export const getWebPlayerDevice = async () => {
  try {
    const token = localStorage.getItem('spotify_access_token');
    console.log('🔍 Getting devices with token:', token ? 'Present' : 'Missing');
    
    // First, let's check what user info we can get
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('👤 User data:', userData);
    }
    
    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📱 Devices response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to get devices:', response.status, errorText);
      throw new Error(`Failed to get devices: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📱 All devices:', data.devices);
    
    const webPlayer = data.devices.find(device => device.type === 'Web Player');
    console.log('🌐 Web Player device found:', webPlayer);
    
    return webPlayer?.id || null;
  } catch (error) {
    console.error('❌ Error getting devices:', error);
    return null;
  }
};


  export const playTrack = async (trackUri) => {
    try {
      const token = localStorage.getItem('spotify_access_token');

      if (!token) {
        throw new Error('No access token found');
      }

      const deviceId = await getWebPlayerDevice();

      const body = {
        uris: [trackUri]
      }

      if (deviceId) {
        body.device_id = deviceId;
      }

      const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Failed to play track: ${response.status}`);
      }

      return true;
    } catch (error) {
    console.log ("❌ Error playing track:", error);
    return false;
  }
};

export const pauseTrack = async () => {
  try {
    const token = localStorage.getItem('spotify_access_token');

    if (!token) {
      throw new Error('No access token found');
    }

    const deviceId = await getWebPlayerDevice();

    const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: deviceId ? JSON.stringify({ device_id: deviceId }) : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to pause track: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.log("❌ Error pausing track:", error);
    return false;
  }
};
