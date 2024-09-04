import{r as D,R as o,b as A,N as Q,O as m,Q as X,S as q,T as G,U as H,V as J,W as K,X as Y}from"./index-d8866171.js";const L=t=>{const n=Array(t.length).fill(null),[e,r]=D.useState(n);return t.map((s,u)=>({id:s.id,mount:l=>r(g=>g.map((f,I)=>I===u?l:f)),unmount:()=>r(l=>l.map((g,f)=>f===u?null:g)),portal:()=>o.createElement(o.Fragment,null,e[u]?A.createPortal(s.component,e[u]):null)}))};var P=t=>{Q()&&console.error(t)};class c extends o.PureComponent{constructor(){super(...arguments),this.portalRef=o.createRef()}componentDidUpdate(n){var e,r,s,u;(n.props.appearance!==this.props.props.appearance||((r=(e=n.props)==null?void 0:e.customPages)==null?void 0:r.length)!==((u=(s=this.props.props)==null?void 0:s.customPages)==null?void 0:u.length))&&this.props.updateProps({node:this.portalRef.current,props:this.props.props})}componentDidMount(){this.portalRef.current&&this.props.mount(this.portalRef.current,this.props.props)}componentWillUnmount(){this.portalRef.current&&this.props.unmount(this.portalRef.current)}render(){var n,e;return o.createElement(o.Fragment,null,o.createElement("div",{ref:this.portalRef}),(e=(n=this.props)==null?void 0:n.customPagesPortals)==null?void 0:e.map((r,s)=>D.createElement(r,{key:s})))}}const tt=m(({clerk:t,...n})=>o.createElement(c,{mount:t.mountSignIn,unmount:t.unmountSignIn,updateProps:t.__unstable__updateProps,props:n}),"SignIn"),nt=m(({clerk:t,...n})=>o.createElement(c,{mount:t.mountSignUp,unmount:t.unmountSignUp,updateProps:t.__unstable__updateProps,props:n}),"SignUp");function S({children:t}){return P(X),o.createElement(o.Fragment,null,t)}function R({children:t}){return P(q),o.createElement(o.Fragment,null,t)}const Z=m(({clerk:t,...n})=>{const{customPages:e,customPagesPortals:r}=y(n.children);return o.createElement(c,{mount:t.mountUserProfile,unmount:t.unmountUserProfile,updateProps:t.__unstable__updateProps,props:{...n,customPages:e},customPagesPortals:r})},"UserProfile");Object.assign(Z,{Page:S,Link:R});const $=m(({clerk:t,...n})=>{const{customPages:e,customPagesPortals:r}=y(n.children),s=Object.assign(n.userProfileProps||{},{customPages:e});return o.createElement(c,{mount:t.mountUserButton,unmount:t.unmountUserButton,updateProps:t.__unstable__updateProps,props:{...n,userProfileProps:s},customPagesPortals:r})},"UserButton");Object.assign($,{UserProfilePage:S,UserProfileLink:R});function j({children:t}){return P(G),o.createElement(o.Fragment,null,t)}function F({children:t}){return P(H),o.createElement(o.Fragment,null,t)}const v=m(({clerk:t,...n})=>{const{customPages:e,customPagesPortals:r}=B(n.children);return o.createElement(c,{mount:t.mountOrganizationProfile,unmount:t.unmountOrganizationProfile,updateProps:t.__unstable__updateProps,props:{...n,customPages:e},customPagesPortals:r})},"OrganizationProfile");Object.assign(v,{Page:j,Link:F});m(({clerk:t,...n})=>o.createElement(c,{mount:t.mountCreateOrganization,unmount:t.unmountCreateOrganization,updateProps:t.__unstable__updateProps,props:n}),"CreateOrganization");const x=m(({clerk:t,...n})=>{const{customPages:e,customPagesPortals:r}=B(n.children),s=Object.assign(n.organizationProfileProps||{},{customPages:e});return o.createElement(c,{mount:t.mountOrganizationSwitcher,unmount:t.unmountOrganizationSwitcher,updateProps:t.__unstable__updateProps,props:{...n,organizationProfileProps:s},customPagesPortals:r})},"OrganizationSwitcher");Object.assign(x,{OrganizationProfilePage:j,OrganizationProfileLink:F});m(({clerk:t,...n})=>o.createElement(c,{mount:t.mountOrganizationList,unmount:t.unmountOrganizationList,updateProps:t.__unstable__updateProps,props:n}),"OrganizationList");const O=(t,n)=>!!t&&o.isValidElement(t)&&(t==null?void 0:t.type)===n,y=t=>W({children:t,reorderItemsLabels:["account","security"],LinkComponent:R,PageComponent:S,componentName:"UserProfile"}),B=t=>W({children:t,reorderItemsLabels:["members","settings"],LinkComponent:F,PageComponent:j,componentName:"OrganizationProfile"}),W=({children:t,LinkComponent:n,PageComponent:e,reorderItemsLabels:r,componentName:s})=>{const u=[];o.Children.forEach(t,a=>{if(!O(a,e)&&!O(a,n)){a&&P(J(s));return}const{props:i}=a,{children:b,label:p,url:d,labelIcon:h}=i;if(O(a,e))if(w(i,r))u.push({label:p});else if(U(i))u.push({label:p,labelIcon:h,children:b,url:d});else{P(K(s));return}if(O(a,n))if(C(i))u.push({label:p,labelIcon:h,url:d});else{P(Y(s));return}});const l=[],g=[],f=[];u.forEach((a,i)=>{if(U(a)){l.push({component:a.children,id:i}),g.push({component:a.labelIcon,id:i});return}C(a)&&f.push({component:a.labelIcon,id:i})});const I=L(l),M=L(g),N=L(f),_=[],E=[];return u.forEach((a,i)=>{if(w(a,r)){_.push({label:a.label});return}if(U(a)){const{portal:b,mount:p,unmount:d}=I.find(z=>z.id===i),{portal:h,mount:T,unmount:V}=M.find(z=>z.id===i);_.push({label:a.label,url:a.url,mount:p,unmount:d,mountIcon:T,unmountIcon:V}),E.push(b),E.push(h);return}if(C(a)){const{portal:b,mount:p,unmount:d}=N.find(h=>h.id===i);_.push({label:a.label,url:a.url,mountIcon:p,unmountIcon:d}),E.push(b);return}}),{customPages:_,customPagesPortals:E}},w=(t,n)=>{const{children:e,label:r,url:s,labelIcon:u}=t;return!e&&!s&&!u&&n.some(l=>l===r)},U=t=>{const{children:n,label:e,url:r,labelIcon:s}=t;return!!n&&!!r&&!!s&&!!e},C=t=>{const{children:n,label:e,url:r,labelIcon:s}=t;return!n&&!!r&&!!s&&!!e};export{tt as S,nt as a};
