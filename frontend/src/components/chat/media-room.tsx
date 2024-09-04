import React from 'react'
import {ControlBar, LiveKitRoom, VideoConference} from "@livekit/components-react"
import "@livekit/components-styles";
import LogoLoader from '../common/logo-loader';
import P from '../ui/typo/P';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfileStore } from '@/hooks/useProfile';
import { mainApi } from '@/lib/axios';
export default function MediaRoom() {
  const{profile} = useProfileStore();
  const {chatId} = useParams();
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const navigate = useNavigate();
  React.useEffect(() => {
async function getLiveKitToken(){
  setLoading(true);
  try{
    const response = await mainApi.post("/livekit/token", {
      chatId,
      userId: profile?.id,
      username: profile?.username
    });
  setToken(response.data.livekitToken);
  }catch(err){
    console.log(err);
    navigate("/404");
  }
  finally{
    setLoading(false);
  }
}
if(!profile?.id || !chatId || !profile?.username){
  return;
}
getLiveKitToken();
  }, [
    chatId,
    profile?.id,
    profile?.username
  ]);
  /* const sendMessage = async () => {
    let message = `${profile?.username} has joined the video chat`;
    try{
      await mainApi.post("/messages", {
        userId: profile?.id,
        body: message,
        chatId,
        type: "SYSTEM"
      });
      socket.emit("sendMessage", )

    }catch(err){

    }

  } */
  if(loading){
    return (
      <div>
        <LogoLoader>
          <P className="text-lg text-gray-600 dark:text-gray-400">
            Joining Video Chat...
          </P>
        </LogoLoader>
      </div>
    );
  }
  return (
    <LiveKitRoom
    video={true}
    audio={true}
    token={token as string}
    serverUrl={import.meta.env.VITE_LIVE_KIT_SERVER_URL}
    connect={true}
    data-lk-theme="default"
    onConnected={() => {
      console.log("connected");
      // probably implement some logic to broadcast that the user has joined the video chat
    }}
    >
      <VideoConference/>
      <ControlBar/>
    </LiveKitRoom>
  )
}
