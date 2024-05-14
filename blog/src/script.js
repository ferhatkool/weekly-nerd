console.log('Script loaded successfully!');

// document.querySelector('#sendNotification').addEventListener("click", () => {
//   console.log('Dit bestaat dus wel, okay.')
//   if (Notification.permission === "granted") {
//     const notification = new Notification("Het werkt hoor!")
//   } else if (Notification.permission !== "denied") {
//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         const notification = new Notification("Notificaties staan aan!");
//       }
//     })
//   }
// })  



function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null; // Return null if the cookie is not found
  }

  let device_id_var = null

  function playThisTrack(albumId, trackPosition) {
    const token = getCookie('access_token')

    // play track 
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id_var, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'context_uri': 'spotify:album:' + albumId,
        "offset": {
          "position": trackPosition
        },
        'position_ms': 0
      })
    })

  }

  function playThisPlaylist(playlistId, trackPosition) {
    const token = getCookie('access_token')
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id_var, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'context_uri': 'spotify:playlist:' + playlistId + '?market=NL',
        "offset": {
          "position": trackPosition
        },
        'position_ms': 0
      })
    })
  }



  let count = 0

  function openCloseQueue() {
    const element = document.getElementById('queue')
    if (count == 0) {
      element.classList.remove('queueClosed')
      element.classList.add('queueOpened')
      count = count + 1
    } else if (count == 1) {
      element.classList.remove('queueOpened')
      element.classList.add('queueClosed')
      count = count - 1
    }
  }
  

  let previousTrack = null
  
  
  window.onSpotifyWebPlaybackSDKReady = () => {
    device_id_test = ""
    const token = getCookie('access_token');
      console.log(token)
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });
      console.log(player)
  
      // Ready
      player.addListener('ready', ({ device_id }) => {
        device_id_test = device_id
        device_id_var = device_id
        console.log('Ready with Device ID', device_id);
      });
  
      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });
  
      player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });
  
    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });
  
    player.setName("Dopify").then(() => {
      console.log('Player name updated!');
    });
  
    player.addListener('player_state_changed', update);

    player.addListener('player_state_changed', updateQueue)
  
    player.connect();

    // player.getVolume().then(volume => {
    //   let volume_percentage = volume * 100;
    //   console.log('The volume of the player is '.concat(volume_percentage + '%'));
    // });

    let intervalTimestamp = setInterval(updateTimeStamp, 1000);
     
    const timestampElement = document.getElementById('timestamp');
    const getSeekElement = document.getElementById('seek');
    let playing = false

    const durationObject = {
      duration: 1,
      timestamp: 0,
      value: 0.00
    }

    function updateTimeShizzle(duration, player) {
      durationObject.duration = duration
      durationObject.timestamp = 0
      durationObject.value = 0.00

      
      document.documentElement.style.setProperty('--seek', durationObject.value);
      document.querySelector('#seek').setAttribute('value', durationObject.value);
      
      getSeekElement.addEventListener('change', function() {
        const getSeekValue = Number(document.documentElement.style.getPropertyValue('--seek'))
        durationObject.value = getSeekValue
        const timestampOfTrack = durationObject.duration * getSeekValue
        durationObject.timestamp = timestampOfTrack
        player.seek(durationObject.timestamp)
        
        clearInterval(intervalTimestamp)
        
        intervalTimestamp = setInterval(updateTimeStamp, 1000);

      })
    }

    

    function updateTimeStamp() {
      if (playing) {
        var newDuration = durationObject.duration / 1000
        if (durationObject.timestamp <= durationObject.duration) {
          durationObject.timestamp += 1000;
          // console.log(millisToMinutesAndSeconds(timestamp));
          timestampElement.textContent = millisToMinutesAndSeconds(durationObject.timestamp);
          var procentDuration = 1 / newDuration
          durationObject.value = durationObject.value + procentDuration
          // console.log(value)
          document.documentElement.style.setProperty('--seek', durationObject.value);
          document.querySelector('#seek').setAttribute('value', durationObject.value)
        } else if (durationObject.timestamp >= durationObject.duration) {
          clearInterval(intervalTimestamp)
        }
      }
    }

    function updateQueue() {
      // queueElement = document.getElementById(queueContent)
      const oldQueueNowPlaying = document.querySelectorAll('.queueTrack')
      const oldQueueTracks = document.querySelectorAll('.queueTracks')
      const oldRecentlyPlayed = document.querySelectorAll('.recentlyPlayed')

      var queueUrl = 'https://api.spotify.com/v1/me/player/queue'
      fetch(queueUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
        },
      })
      .then(response => {
        // Check if the response is successful (status code 200)
        if (response.ok) {
          // Parse the JSON response
          return response.json();
        } else {
          // If the response is not successful, throw an error
          throw new Error('Failed to fetch data');
        }
      })
      .then(data => {

        if (data.queue != null ) {
          var valueQueue = 0
          // var valueRecentlyPlayed = 0

          oldQueueNowPlaying.forEach(function(element) {
            const artist = element.querySelector('b')
            const title = element.querySelector('p')
            const image = element.querySelector('img')
            const svg = element.querySelector('svg')

            if (svg && artist && title && image ) {
              svg.removeAttribute('onclick')
              const trackString = 'playThisTrack("'.concat(data.currently_playing.album.id + '", 0)')
              console.log(trackString)
              svg.setAttribute('onclick', trackString)
              artist.textContent = data.currently_playing.artists[0].name
              title.textContent = data.currently_playing.name
              image.removeAttribute('src')
              image.setAttribute('src', data.currently_playing.album.images[1].url)
            }

          })

          oldQueueTracks.forEach(function(element) {
            const artist = element.querySelector('b')
            const title = element.querySelector('p')
            const image = element.querySelector('img')
            const svg = element.querySelector('svg')
    
            if (svg && artist && title && image ) {
              svg.removeAttribute('onclick')
              const trackString = 'playThisTrack("'.concat(data.queue[valueQueue].album.id + '", 0)')
              svg.setAttribute('onclick', trackString)
              artist.textContent = data.queue[valueQueue].artists[0].name
              title.textContent = data.queue[valueQueue].name
              image.removeAttribute('src')
              image.setAttribute('src', data.queue[valueQueue].album.images[1].url)
              valueQueue++
            }
          })
        }
      })

      var recentlyPlayedUrl = 'https://api.spotify.com/v1/me/player/recently-played?limit=15&before=190000000000000000'
      fetch(recentlyPlayedUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + getCookie('access_token'),
        },
      })
      .then(response => {
        // Check if the response is successful (status code 200)
        if (response.ok) {
          // Parse the JSON response
          return response.json();
        } else {
          // If the response is not successful, throw an error
          throw new Error('Failed to fetch data');
        }
      })
      .then(data => {
        if (data.items != null) {
          var valueRecentlyPlayed = 0

          oldRecentlyPlayed.forEach(function(element) {
            const artist = element.querySelector('b')
            const title = element.querySelector('p')
            const image = element.querySelector('img')
            const svg = element.querySelector('svg')
    
            if (svg && artist && title && image ) {
              svg.removeAttribute('onclick')
              const trackString = 'playThisTrack("'.concat(data.items[valueRecentlyPlayed].track.album.id + '", 0)')
              svg.setAttribute('onclick', trackString)
              artist.textContent = data.items[valueRecentlyPlayed].track.artists[0].name
              title.textContent = data.items[valueRecentlyPlayed].track.name
              image.removeAttribute('src')
              image.setAttribute('src', data.items[valueRecentlyPlayed].track.album.images[1].url)
              valueRecentlyPlayed++
            }
          })
        }
      })
    }
  

    let prevTrack = ''

    function update(changedStateEvent) {
      player.getCurrentState().then(state => {
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          return;
        }
        const currentTrack = state.track_window.current_track;
        if (prevTrack != currentTrack.uri) {
          console.log({changedStateEvent});
          //console.log(state)
          document.getElementById("album").src = state.track_window.current_track.album['images'][2]["url"];
          document.getElementById("trackname").innerHTML = state.track_window.current_track['name'];
          document.getElementById("artistname").innerHTML = state.track_window.current_track['artists'][0]['name'];
          var duration = state.duration
          document.getElementById("duration").innerHTML = millisToMinutesAndSeconds(duration)
          
          console.log(state)
          updateTimeShizzle(duration, player)
          // updateQueue()
          prevTrack = currentTrack.uri
        }
        playing = !state.paused 
        const trackTitleElement = document.getElementById('trackname');

        // Check if the current track is different from the previous track
        if (currentTrack && currentTrack.uri !== previousTrack) {
          trackTitleElement.textContent = currentTrack.name;
          fetch(currentTrack['artists'][0]['url'], {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
            },
          })
          .then(response => {
            // Check if the response is successful (status code 200)
            if (response.ok) {
              // Parse the JSON response
              return response.json();
            } else {
              // If the response is not successful, throw an error
              throw new Error('Failed to fetch data');
            }
          })
          .then(data => {
            if (Notification.permission === "granted") {     
              const trackNotification = new Notification(
                'Now playing: '.concat(currentTrack.name + ' from ' + currentTrack['artists'][0]['name']),{
                  //icon: currentTrack['artists'][0]['url'],
                  //icon: currentTrack.album['images'][2]["url"],
                  icon: data.images[0].url,
                  image: currentTrack.album['images'][2]["url"],
                  
                })
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  const trackNotification = new Notification(
                    'Now playing: '.concat(currentTrack.name + ' from ' + currentTrack['artists'][0]['name']),{
                      //icon: currentTrack['artists'][0]['url'],
                      //icon: currentTrack.album['images'][2]["url"],
                      icon: data.images[0].url,
                      image: currentTrack.album['images'][2]["url"],
                  })
                }
              })
            }
          })
          previousTrack = currentTrack.uri;
        }    
      });
    }
  
    
  
    const test2 = document.getElementById('volumeSlider')
    test2.addEventListener('change', function() {
      const test = document.documentElement.style.getPropertyValue('--volume')
      //console.log(test)
      player.setVolume(test).then(() => {
        console.log('Volume updated to '.concat(test * 100 + '%'));
      });
  });
  
    let togglePlayValue = 0
    document.getElementById('togglePlay').onclick = function() {
      
      if (togglePlayValue == 0) {
        document.getElementById('togglePlayState1').style.display = 'none'
        document.getElementById('togglePlayState2').style.display = 'block'

        togglePlayValue = togglePlayValue + 1
      } else if (togglePlayValue == 1) {
        document.getElementById('togglePlayState2').style.display = 'none'
        document.getElementById('togglePlayState1').style.display = 'block'
        
        togglePlayValue = togglePlayValue - 1
      }
      player.togglePlay();
    };



    document.getElementById('switchDevice').onclick = function() {
        fetch('https://api.spotify.com/v1/me/player', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "device_ids": [
                    device_id_test
                ]
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
          })
          .catch(error => {
            console.error('Request failed:', error);
          });       
    }
  
    // document.getElementById('pause').onclick = function() {
    //   player.pause().then(() => {
    //     console.log('Paused!')
    //   });
    // };
  
    // document.getElementById('resume').onclick = function() {
    //   player.resume().then(() => {
    //     console.log('Resumed!')
    //   });
    // };
  
    document.getElementById('next').onclick = function() {
      player.nextTrack().then(() => {
        console.log('Next!')
      });
    };
  
    document.getElementById('previous').onclick = function() {
      player.previousTrack().then(() => {
        console.log('Previous!')
      });
    };

    let repeatValue = 0
    let repeatState;
    document.getElementById('repeat').onclick = function() {
      if (repeatValue == 0) {
        console.log('Repeat 1')
        repeatState = 'context'

        document.getElementById('repeatState1').style.display = 'none'
        document.getElementById('repeatState2').style.display = 'block'
        
        repeatValue = repeatValue + 1
      } else if (repeatValue == 1) {
        console.log('Repeat 2')
        repeatState = 'track'

        document.getElementById('repeatState2').style.display = 'none'
        document.getElementById('repeatState3').style.display = 'block'

        repeatValue = repeatValue + 1
      } else if (repeatValue == 2) {
        console.log('Repeat 3')
        repeatState = 'off'

        document.getElementById('repeatState3').style.display = 'none'
        document.getElementById('repeatState1').style.display = 'block'

        repeatValue = repeatValue - 2
      }

      fetch('https://api.spotify.com/v1/me/player/repeat?state=' + repeatState + '&device_id=' + device_id_test, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token')
            },
        })   
    }

    let shuffleValue = 0
    let shuffleState;
    document.getElementById('shuffle').onclick = function() {
      if (shuffleValue == 0) {
        console.log('Shuffle 1')
        shuffleState = 'true'

        document.getElementById('shuffleState1').style.display = 'none'
        document.getElementById('shuffleState2').style.display = 'block'

        shuffleValue = shuffleValue + 1
      } else if (shuffleValue == 1) {
        console.log('Shuffle 2')
        shuffleState = 'false'

        document.getElementById('shuffleState2').style.display = 'none'
        document.getElementById('shuffleState1').style.display = 'block'  

        shuffleValue = shuffleValue - 1
      } 

      fetch('https://api.spotify.com/v1/me/player/shuffle?state=' + shuffleState + '&device_id=' + device_id_test, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + getCookie('access_token')
            },
        })   
    }

    // document.querySelector('#sendNotification').addEventListener("click", () => {
    //   if (Notification.permission === "granted") {
    //     const notification = new Notification("Het werkt hoor!")
    //   } else if (Notification.permission !== "denied") {
    //     Notification.requestPermission().then((permission) => {
    //       if (permission === "granted") {
    //         const notification = new Notification("Notificaties staan aan!");
    //       }
    //     })
    //   }
    // })  


}
  
  