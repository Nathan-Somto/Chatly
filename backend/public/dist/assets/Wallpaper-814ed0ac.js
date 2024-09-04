import{c as B,r as s,j as a,R as E,a as Ie,b as Se,d as z,u as Ee,e as je,f as Ae,g as Oe,s as Pe,h as Me,i as De,H as Fe,B as L,C as Ue,k as _e,D as Le,l as ke,m as $e,v as Ge,n as Ve}from"./index-e8a81011.js";import{M as Ke}from"./message-35179525.js";const k=B("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["polyline",{points:"22 4 12 14.01 9 11.01",key:"6xbx8j"}]]),Be=B("ImageOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M10.41 10.41a2 2 0 1 1-2.83-2.83",key:"1bzlo9"}],["line",{x1:"13.5",x2:"6",y1:"13.5",y2:"21",key:"1q0aeu"}],["line",{x1:"18",x2:"21",y1:"12",y2:"15",key:"5mozeu"}],["path",{d:"M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",key:"mmje98"}],["path",{d:"M21 15V5a2 2 0 0 0-2-2H9",key:"43el77"}]]),ze=B("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);function R(e,t,{checkForDefaultPrevented:r=!0}={}){return function(i){if(e==null||e(i),r===!1||!i.defaultPrevented)return t==null?void 0:t(i)}}function q(e,t=[]){let r=[];function n(o,c){const u=s.createContext(c),d=r.length;r=[...r,c];function l(f){const{scope:v,children:h,...p}=f,x=(v==null?void 0:v[e][d])||u,C=s.useMemo(()=>p,Object.values(p));return a.jsx(x.Provider,{value:C,children:h})}function g(f,v){const h=(v==null?void 0:v[e][d])||u,p=s.useContext(h);if(p)return p;if(c!==void 0)return c;throw new Error(`\`${f}\` must be used within \`${o}\``)}return l.displayName=o+"Provider",[l,g]}const i=()=>{const o=r.map(c=>s.createContext(c));return function(u){const d=(u==null?void 0:u[e])||o;return s.useMemo(()=>({[`__scope${e}`]:{...u,[e]:d}}),[u,d])}};return i.scopeName=e,[n,qe(i,...t)]}function qe(...e){const t=e[0];if(e.length===1)return t;const r=()=>{const n=e.map(i=>({useScope:i(),scopeName:i.scopeName}));return function(o){const c=n.reduce((u,{useScope:d,scopeName:l})=>{const f=d(o)[`__scope${l}`];return{...u,...f}},{});return s.useMemo(()=>({[`__scope${t.scopeName}`]:c}),[c])}};return r.scopeName=t.scopeName,r}function He(e,t){typeof e=="function"?e(t):e!=null&&(e.current=t)}function Z(...e){return t=>e.forEach(r=>He(r,t))}function D(...e){return s.useCallback(Z(...e),e)}var F=s.forwardRef((e,t)=>{const{children:r,...n}=e,i=s.Children.toArray(r),o=i.find(Qe);if(o){const c=o.props.children,u=i.map(d=>d===o?s.Children.count(c)>1?s.Children.only(null):s.isValidElement(c)?c.props.children:null:d);return a.jsx(G,{...n,ref:t,children:s.isValidElement(c)?s.cloneElement(c,void 0,u):null})}return a.jsx(G,{...n,ref:t,children:r})});F.displayName="Slot";var G=s.forwardRef((e,t)=>{const{children:r,...n}=e;if(s.isValidElement(r)){const i=Ze(r);return s.cloneElement(r,{...Xe(n,r.props),ref:t?Z(t,i):i})}return s.Children.count(r)>1?s.Children.only(null):null});G.displayName="SlotClone";var Ye=({children:e})=>a.jsx(a.Fragment,{children:e});function Qe(e){return s.isValidElement(e)&&e.type===Ye}function Xe(e,t){const r={...t};for(const n in t){const i=e[n],o=t[n];/^on[A-Z]/.test(n)?i&&o?r[n]=(...u)=>{o(...u),i(...u)}:i&&(r[n]=i):n==="style"?r[n]={...i,...o}:n==="className"&&(r[n]=[i,o].filter(Boolean).join(" "))}return{...e,...r}}function Ze(e){var n,i;let t=(n=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:n.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(t=(i=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:i.get,r=t&&"isReactWarning"in t&&t.isReactWarning,r?e.props.ref:e.props.ref||e.ref)}function Je(e){const t=e+"CollectionProvider",[r,n]=q(t),[i,o]=r(t,{collectionRef:{current:null},itemMap:new Map}),c=h=>{const{scope:p,children:x}=h,C=E.useRef(null),y=E.useRef(new Map).current;return a.jsx(i,{scope:p,itemMap:y,collectionRef:C,children:x})};c.displayName=t;const u=e+"CollectionSlot",d=E.forwardRef((h,p)=>{const{scope:x,children:C}=h,y=o(u,x),b=D(p,y.collectionRef);return a.jsx(F,{ref:b,children:C})});d.displayName=u;const l=e+"CollectionItemSlot",g="data-radix-collection-item",f=E.forwardRef((h,p)=>{const{scope:x,children:C,...y}=h,b=E.useRef(null),I=D(p,b),N=o(l,x);return E.useEffect(()=>(N.itemMap.set(b,{ref:b,...y}),()=>void N.itemMap.delete(b))),a.jsx(F,{[g]:"",ref:I,children:C})});f.displayName=l;function v(h){const p=o(e+"CollectionConsumer",h);return E.useCallback(()=>{const C=p.collectionRef.current;if(!C)return[];const y=Array.from(C.querySelectorAll(`[${g}]`));return Array.from(p.itemMap.values()).sort((N,m)=>y.indexOf(N.ref.current)-y.indexOf(m.ref.current))},[p.collectionRef,p.itemMap])}return[{Provider:c,Slot:d,ItemSlot:f},v,n]}var V=globalThis!=null&&globalThis.document?s.useLayoutEffect:()=>{},We=Ie["useId".toString()]||(()=>{}),et=0;function J(e){const[t,r]=s.useState(We());return V(()=>{e||r(n=>n??String(et++))},[e]),e||(t?`radix-${t}`:"")}var tt=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"],j=tt.reduce((e,t)=>{const r=s.forwardRef((n,i)=>{const{asChild:o,...c}=n,u=o?F:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),a.jsx(u,{...c,ref:i})});return r.displayName=`Primitive.${t}`,{...e,[t]:r}},{});function H(e){const t=s.useRef(e);return s.useEffect(()=>{t.current=e}),s.useMemo(()=>(...r)=>{var n;return(n=t.current)==null?void 0:n.call(t,...r)},[])}function W({prop:e,defaultProp:t,onChange:r=()=>{}}){const[n,i]=nt({defaultProp:t,onChange:r}),o=e!==void 0,c=o?e:n,u=H(r),d=s.useCallback(l=>{if(o){const f=typeof l=="function"?l(e):l;f!==e&&u(f)}else i(l)},[o,e,i,u]);return[c,d]}function nt({defaultProp:e,onChange:t}){const r=s.useState(e),[n]=r,i=s.useRef(n),o=H(t);return s.useEffect(()=>{i.current!==n&&(o(n),i.current=n)},[n,i,o]),r}var ot=s.createContext(void 0);function ee(e){const t=s.useContext(ot);return e||t||"ltr"}var $="rovingFocusGroup.onEntryFocus",rt={bubbles:!1,cancelable:!0},U="RovingFocusGroup",[K,te,st]=Je(U),[at,ne]=q(U,[st]),[it,ct]=at(U),oe=s.forwardRef((e,t)=>a.jsx(K.Provider,{scope:e.__scopeRovingFocusGroup,children:a.jsx(K.Slot,{scope:e.__scopeRovingFocusGroup,children:a.jsx(lt,{...e,ref:t})})}));oe.displayName=U;var lt=s.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:r,orientation:n,loop:i=!1,dir:o,currentTabStopId:c,defaultCurrentTabStopId:u,onCurrentTabStopIdChange:d,onEntryFocus:l,preventScrollOnEntryFocus:g=!1,...f}=e,v=s.useRef(null),h=D(t,v),p=ee(o),[x=null,C]=W({prop:c,defaultProp:u,onChange:d}),[y,b]=s.useState(!1),I=H(l),N=te(r),m=s.useRef(!1),[T,A]=s.useState(0);return s.useEffect(()=>{const w=v.current;if(w)return w.addEventListener($,I),()=>w.removeEventListener($,I)},[I]),a.jsx(it,{scope:r,orientation:n,dir:p,loop:i,currentTabStopId:x,onItemFocus:s.useCallback(w=>C(w),[C]),onItemShiftTab:s.useCallback(()=>b(!0),[]),onFocusableItemAdd:s.useCallback(()=>A(w=>w+1),[]),onFocusableItemRemove:s.useCallback(()=>A(w=>w-1),[]),children:a.jsx(j.div,{tabIndex:y||T===0?-1:0,"data-orientation":n,...f,ref:h,style:{outline:"none",...e.style},onMouseDown:R(e.onMouseDown,()=>{m.current=!0}),onFocus:R(e.onFocus,w=>{const we=!m.current;if(w.target===w.currentTarget&&we&&!y){const X=new CustomEvent($,rt);if(w.currentTarget.dispatchEvent(X),!X.defaultPrevented){const _=N().filter(S=>S.focusable),Te=_.find(S=>S.active),Ne=_.find(S=>S.id===x),Re=[Te,Ne,..._].filter(Boolean).map(S=>S.ref.current);ae(Re,g)}}m.current=!1}),onBlur:R(e.onBlur,()=>b(!1))})})}),re="RovingFocusGroupItem",se=s.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:r,focusable:n=!0,active:i=!1,tabStopId:o,...c}=e,u=J(),d=o||u,l=ct(re,r),g=l.currentTabStopId===d,f=te(r),{onFocusableItemAdd:v,onFocusableItemRemove:h}=l;return s.useEffect(()=>{if(n)return v(),()=>h()},[n,v,h]),a.jsx(K.ItemSlot,{scope:r,id:d,focusable:n,active:i,children:a.jsx(j.span,{tabIndex:g?0:-1,"data-orientation":l.orientation,...c,ref:t,onMouseDown:R(e.onMouseDown,p=>{n?l.onItemFocus(d):p.preventDefault()}),onFocus:R(e.onFocus,()=>l.onItemFocus(d)),onKeyDown:R(e.onKeyDown,p=>{if(p.key==="Tab"&&p.shiftKey){l.onItemShiftTab();return}if(p.target!==p.currentTarget)return;const x=ft(p,l.orientation,l.dir);if(x!==void 0){if(p.metaKey||p.ctrlKey||p.altKey||p.shiftKey)return;p.preventDefault();let y=f().filter(b=>b.focusable).map(b=>b.ref.current);if(x==="last")y.reverse();else if(x==="prev"||x==="next"){x==="prev"&&y.reverse();const b=y.indexOf(p.currentTarget);y=l.loop?pt(y,b+1):y.slice(b+1)}setTimeout(()=>ae(y))}})})})});se.displayName=re;var ut={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function dt(e,t){return t!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function ft(e,t,r){const n=dt(e.key,r);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(n))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(n)))return ut[n]}function ae(e,t=!1){const r=document.activeElement;for(const n of e)if(n===r||(n.focus({preventScroll:t}),document.activeElement!==r))return}function pt(e,t){return e.map((r,n)=>e[(t+n)%e.length])}var mt=oe,gt=se;function vt(e,t){return s.useReducer((r,n)=>t[r][n]??r,e)}var ie=e=>{const{present:t,children:r}=e,n=ht(t),i=typeof r=="function"?r({present:n.isPresent}):s.Children.only(r),o=D(n.ref,xt(i));return typeof r=="function"||n.isPresent?s.cloneElement(i,{ref:o}):null};ie.displayName="Presence";function ht(e){const[t,r]=s.useState(),n=s.useRef({}),i=s.useRef(e),o=s.useRef("none"),c=e?"mounted":"unmounted",[u,d]=vt(c,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return s.useEffect(()=>{const l=O(n.current);o.current=u==="mounted"?l:"none"},[u]),V(()=>{const l=n.current,g=i.current;if(g!==e){const v=o.current,h=O(l);e?d("MOUNT"):h==="none"||(l==null?void 0:l.display)==="none"?d("UNMOUNT"):d(g&&v!==h?"ANIMATION_OUT":"UNMOUNT"),i.current=e}},[e,d]),V(()=>{if(t){const l=f=>{const h=O(n.current).includes(f.animationName);f.target===t&&h&&Se.flushSync(()=>d("ANIMATION_END"))},g=f=>{f.target===t&&(o.current=O(n.current))};return t.addEventListener("animationstart",g),t.addEventListener("animationcancel",l),t.addEventListener("animationend",l),()=>{t.removeEventListener("animationstart",g),t.removeEventListener("animationcancel",l),t.removeEventListener("animationend",l)}}else d("ANIMATION_END")},[t,d]),{isPresent:["mounted","unmountSuspended"].includes(u),ref:s.useCallback(l=>{l&&(n.current=getComputedStyle(l)),r(l)},[])}}function O(e){return(e==null?void 0:e.animationName)||"none"}function xt(e){var n,i;let t=(n=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:n.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(t=(i=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:i.get,r=t&&"isReactWarning"in t&&t.isReactWarning,r?e.props.ref:e.props.ref||e.ref)}var Y="Tabs",[yt,St]=q(Y,[ne]),ce=ne(),[bt,Q]=yt(Y),le=s.forwardRef((e,t)=>{const{__scopeTabs:r,value:n,onValueChange:i,defaultValue:o,orientation:c="horizontal",dir:u,activationMode:d="automatic",...l}=e,g=ee(u),[f,v]=W({prop:n,onChange:i,defaultProp:o});return a.jsx(bt,{scope:r,baseId:J(),value:f,onValueChange:v,orientation:c,dir:g,activationMode:d,children:a.jsx(j.div,{dir:g,"data-orientation":c,...l,ref:t})})});le.displayName=Y;var ue="TabsList",de=s.forwardRef((e,t)=>{const{__scopeTabs:r,loop:n=!0,...i}=e,o=Q(ue,r),c=ce(r);return a.jsx(mt,{asChild:!0,...c,orientation:o.orientation,dir:o.dir,loop:n,children:a.jsx(j.div,{role:"tablist","aria-orientation":o.orientation,...i,ref:t})})});de.displayName=ue;var fe="TabsTrigger",pe=s.forwardRef((e,t)=>{const{__scopeTabs:r,value:n,disabled:i=!1,...o}=e,c=Q(fe,r),u=ce(r),d=ve(c.baseId,n),l=he(c.baseId,n),g=n===c.value;return a.jsx(gt,{asChild:!0,...u,focusable:!i,active:g,children:a.jsx(j.button,{type:"button",role:"tab","aria-selected":g,"aria-controls":l,"data-state":g?"active":"inactive","data-disabled":i?"":void 0,disabled:i,id:d,...o,ref:t,onMouseDown:R(e.onMouseDown,f=>{!i&&f.button===0&&f.ctrlKey===!1?c.onValueChange(n):f.preventDefault()}),onKeyDown:R(e.onKeyDown,f=>{[" ","Enter"].includes(f.key)&&c.onValueChange(n)}),onFocus:R(e.onFocus,()=>{const f=c.activationMode!=="manual";!g&&!i&&f&&c.onValueChange(n)})})})});pe.displayName=fe;var me="TabsContent",ge=s.forwardRef((e,t)=>{const{__scopeTabs:r,value:n,forceMount:i,children:o,...c}=e,u=Q(me,r),d=ve(u.baseId,n),l=he(u.baseId,n),g=n===u.value,f=s.useRef(g);return s.useEffect(()=>{const v=requestAnimationFrame(()=>f.current=!1);return()=>cancelAnimationFrame(v)},[]),a.jsx(ie,{present:i||g,children:({present:v})=>a.jsx(j.div,{"data-state":g?"active":"inactive","data-orientation":u.orientation,role:"tabpanel","aria-labelledby":d,hidden:!v,id:l,tabIndex:0,...c,ref:t,style:{...e.style,animationDuration:f.current?"0s":void 0},children:v&&o})})});ge.displayName=me;function ve(e,t){return`${e}-trigger-${t}`}function he(e,t){return`${e}-content-${t}`}var Ct=le,xe=de,ye=pe,be=ge;const wt=Ct,Ce=s.forwardRef(({className:e,...t},r)=>a.jsx(xe,{ref:r,className:z("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",e),...t}));Ce.displayName=xe.displayName;const P=s.forwardRef(({className:e,...t},r)=>a.jsx(ye,{ref:r,className:z("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",e),...t}));P.displayName=ye.displayName;const M=s.forwardRef(({className:e,...t},r)=>a.jsx(be,{ref:r,className:z("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e),...t}));M.displayName=be.displayName;const Tt=(e,t)=>[{Sender:{username:"MyUsername",avatar:"https://example.com/my-avatar.png"},id:"msg1",body:"Hey, how's it going?",senderId:e,isEditted:!1,readByIds:[],resourceUrl:null,type:"TEXT",createdAt:new Date,chatId:"chat1",parentMessage:null,isReply:!1},{Sender:{username:"OtherUser",avatar:t},id:"msg2",body:"I'm good, thanks! How about you?",senderId:Ge(),isEditted:!1,readByIds:[],resourceUrl:null,type:"TEXT",createdAt:new Date,chatId:"chat1",parentMessage:null,isReply:!1}];function Et(){var N;const e=Ee(),{theme:t}=je(),r=Ae(),{profile:n,updateProfile:i}=Oe(),[o,c]=s.useState(null),[u,d]=s.useState(null),[l,g]=s.useState(null),[f,v]=s.useState(null),h=s.useMemo(()=>t==="dark"?Pe:Me,[t]),p=(m,T)=>{v(m),c({url:T,wallpaperType:"DEFAULT"})};s.useEffect(()=>{if(n){const m=n.wallpaperType&&n.wallpaperUrl?n.wallpaperType==="COLOR"?{color:n.wallpaperUrl,wallpaperType:"COLOR"}:{url:n.wallpaperUrl,wallpaperType:n.wallpaperType}:null;c(m),n.wallpaperType==="UPLOADED"&&d((n==null?void 0:n.wallpaperUrl)??null)}},[n]);const x=s.useMemo(()=>({wallpaperType:o==null?void 0:o.wallpaperType,wallpaperUrl:(o==null?void 0:o.wallpaperType)==="COLOR"?o.color:(o==null?void 0:o.wallpaperType)==="DEFAULT"?f??void 0:o==null?void 0:o.url}),[o==null?void 0:o.color,o==null?void 0:o.url,o==null?void 0:o.wallpaperType,f]),{mutate:C,isPending:y}=De({method:"patch",route:"/users",onSuccess(){console.log(x),e.setQueryData(["profile"],m=>(console.log(m),{data:{user:{...n,...x}}})),i(x),r(`/${n==null?void 0:n.id}/chats`)}}),b=m=>{var A;const T=(A=m.target.files)==null?void 0:A[0];if(T){const w=URL.createObjectURL(T);d(w),g(T),c({url:w,wallpaperType:"UPLOADED"})}},I=async()=>{try{let m=u;if((o==null?void 0:o.wallpaperType)==="UPLOADED"&&l)if(m=await Ve(l),m)c({url:m,wallpaperType:"UPLOADED"});else return;C({...x,wallpaperUrl:m})}catch{}};return a.jsxs(a.Fragment,{children:[a.jsx(Fe,{children:a.jsxs("div",{className:"flex gap-x-2 items-center",children:[a.jsx(L,{variant:"link",size:"icon",onClick:()=>r(`/${n==null?void 0:n.id}/chats`),children:a.jsx(Ue,{})}),a.jsx("h1",{children:"Change Wallpaper"})]})}),a.jsxs("div",{className:"p-4 w-[80%] mx-auto",children:[a.jsxs(wt,{defaultValue:((N=n==null?void 0:n.wallpaperType)==null?void 0:N.toLowerCase())??"default",children:[a.jsxs(Ce,{children:[a.jsx(P,{value:"default",children:"Default Wallpapers"}),a.jsx(P,{value:"colors",children:"Solid Colors"}),a.jsx(P,{value:"uploaded",children:"Uploaded Wallpaper"})]}),a.jsx(M,{value:"colors",children:a.jsx("div",{className:"grid grid-cols-3 gap-4",children:h.map(m=>a.jsx("div",{className:"h-[200px] w-full rounded-lg cursor-pointer relative",style:{backgroundColor:m},onClick:()=>c({color:m,wallpaperType:"COLOR"}),children:(o==null?void 0:o.wallpaperType)==="COLOR"&&o.color===m&&a.jsx(k,{className:"w-8 h-8 text-green-500 absolute right-1 top-1"})},m))})}),a.jsx(M,{value:"default",children:a.jsx("div",{className:"grid grid-cols-3 gap-4",children:Object.entries(_e).map(([m,T])=>m==="light2"&&t==="dark"?null:a.jsx("div",{className:"h-[200px] w-full bg-cover relative bg-center rounded-lg cursor-pointer",style:{backgroundImage:`url(${T})`},onClick:()=>p(m,T),children:(o==null?void 0:o.wallpaperType)==="DEFAULT"&&(o==null?void 0:o.url)===T&&a.jsx(k,{className:"w-8 h-8 text-green-500 absolute right-1 top-1"})},m))})}),a.jsx(M,{value:"uploaded",children:a.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[u&&a.jsx("div",{className:"h-[200px] w-full bg-cover bg-center relative rounded-lg cursor-pointer",style:{backgroundImage:`url(${u})`},onClick:()=>c({url:u,wallpaperType:"UPLOADED"}),children:(o==null?void 0:o.wallpaperType)==="UPLOADED"&&(o==null?void 0:o.url)===u&&a.jsx(k,{className:"w-8 h-8 text-green-500 absolute right-1 top-1"})}),u===null&&a.jsx("div",{className:"h-[200px] w-full bg-cover flex justify-center items-center bg-center rounded-lg  border-2 cursor-pointer",children:a.jsx(Be,{size:80,className:"text-gray-600"})}),a.jsxs("label",{className:"flex flex-col items-center justify-center h-20 w-20 bg-gray-200 rounded-lg cursor-pointer",children:[a.jsx(ze,{className:"w-8 h-8 text-gray-600"}),a.jsx("input",{type:"file",className:"hidden",onChange:b})]})]})})]}),a.jsxs(Le,{children:[a.jsx(ke,{asChild:!0,children:a.jsx(L,{className:"mt-6",disabled:o===null,children:"Preview Wallpaper"})}),a.jsxs($e,{disableClose:y,children:[a.jsxs("div",{className:"h-96 w-full bg-cover bg-center rounded-lg",style:{backgroundImage:(o==null?void 0:o.wallpaperType)==="DEFAULT"||(o==null?void 0:o.wallpaperType)==="UPLOADED"?`url(${o.url})`:"none",backgroundColor:(o==null?void 0:o.wallpaperType)==="COLOR"&&(o==null?void 0:o.color)||"transparent"},children:[a.jsx("div",{className:"bg-white/60 p-4 rounded-lg mt-4 mx-2",children:a.jsx("p",{className:"text-gray-800",children:"This is a preview of the selected wallpaper with some message blocks."})}),a.jsx("div",{className:"w-full px-3",children:Tt((n==null?void 0:n.id)??"",(n==null?void 0:n.avatar)??"").map(m=>a.jsx(Ke,{openModal:function(T){throw new Error("Function not implemented.")},index:0,preview:!0,...m},m.id))})]}),a.jsx(L,{disabled:y,variant:"outline",onClick:I,children:"Set Wallpaper"})]})]})]})]})}export{Et as default};