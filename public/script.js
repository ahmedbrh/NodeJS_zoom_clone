

const socket = io('/'); 
 //  PPER 
 let peer = new Peer (undefined , {
  path : '/peerjs' , 
  host : '/' , 
  port:  '443'
}); 
//view our own Video
let myVideoStream ;

const videoGrid = document.getElementById('video-grid') ; 
// console.log(videoGrid); 
const myVideo = document.createElement('video'); 
myVideo.muted = true ;  
let text  = $('input') ; 
//get video and audio
navigator.mediaDevices.getUserMedia ({ 
    video: true ,   
    audio: true 
}).then ( stream  => { 
myVideoStream  = stream  ; 
addVideoStream(myVideo,stream);
//answering the call 
 
 
peer.on('call', call => {
    call.answer(stream)
    //add the video for the new user 
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  //socket  on 
socket.on ('user-connected' , (userId)=> {
    connectToNewUser(userId , stream );  

});  



// //messages 
//Input messages  
$('html').keydown ((e)=> { 
    if(e.which == 13 && text.val().length !==0){ // check the input  not null 
        console.log(text.val())   ; 
        socket.emit('message', text.val());
    text.val('') }  //clear the input   
});
socket.on('createMessage' , message => {
    //  console.log("this is a msg from the server")});
    $('ul').append(`<li class="message"><b>user</b><br>${message}</br></li>`)
    scrollToBottom() ; 
}); 
}) ; 


 // connect to the new user  
 const connectToNewUser = (userId,stream) => {
    console.log('new user ' , userId) ;  
   const call = peer.call(userId,stream)
   const video = document.createElement('video')
   call.on('stream' , userVideoStream => { 
       addVideoStream(video , userVideoStream )
   })
   
   }



peer.on('open' , id => { 

socket.emit('join-room' ,ROOM_ID , id); 
}) ;



const addVideoStream = (video ,stream) => {
 
    video.srcObject = stream ; 
    video.addEventListener('loadedmetadata', ()=> {
        video.play(); 
    })
    videoGrid.append(video) ; 
}


// let text = $("input");
//  // when press enter send message
//  $('html').keydown(function (e) {
//    if (e.which == 13 && text.val().length !== 0) {
//        console.log(text.val())
//      socket.emit('message', text.val());
//      text.val('') } }) ;

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
   
   
   //mute unmute function 
  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false; //disable it 
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true; //enable it 
    }
  }

  //set mute function 
  const setMuteButton = () => {
    const html = ` <i class="fas fa-microphone"></i>
     <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html; //logo 
  }
  //set unmute function 
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
   // the play and Stop video function  

   const playStop = () => {
    console.log('object')
    enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
   
   //Play the video 
  
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
   //Stop the video 
   const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
   
    
    
   