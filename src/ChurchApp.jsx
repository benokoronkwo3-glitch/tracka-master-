import { useState } from "react";

const CHURCHES = {
  grace_of_god: {
    id: "grace_of_god",
    name: "Grace of God Mission International",
    pastor: "Bishop Dr Paul Nwachukwu",
    theme: { primary: "#ea580c", dark: "#7c2d12", light: "#fff7ed" }
  }
};

export default function App() {
  const p = new URLSearchParams(window.location.search);
  const fromUrl = p.get("church");
  if (fromUrl && CHURCHES[fromUrl]) {
    localStorage.setItem("tracka_church_client", fromUrl);
  }
  const key = fromUrl || localStorage.getItem("tracka_church_client");
  const church = CHURCHES[key];

  if (!church) return (
    <div style={{minHeight:"100vh",background:"#1e1b4b",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#fff",textAlign:"center"}}>
        <div style={{fontSize:18,fontWeight:800}}>Tracka Church</div>
        <div style={{fontSize:14,color:"#a5b4fc",marginTop:8}}>Invalid Access Link</div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:church.theme.light,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif"}}>
      <div style={{background:"#fff",borderRadius:16,padding:40,textAlign:"center",maxWidth:400,width:"90%",boxShadow:"0 4px 24px #0002"}}>
        <div style={{fontSize:32,marginBottom:12}}>⛪</div>
        <div style={{fontSize:11,fontWeight:700,color:church.theme.primary,marginBottom:4}}>TRACKA CHURCH</div>
        <div style={{fontSize:20,fontWeight:800,color:church.theme.dark,marginBottom:8}}>{church.name}</div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:24}}>{church.pastor}</div>
        <div style={{background:church.theme.primary,color:"#fff",borderRadius:8,padding:"12px 24px",fontWeight:700,fontSize:15}}>
          Church App Loading Successfully!
        </div>
      </div>
    </div>
  );
}
