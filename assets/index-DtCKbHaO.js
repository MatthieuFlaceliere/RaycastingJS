(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const m=8,P=8,M=m*P,b=[1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,1,0,0,0,0,1,1,0,0,0,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1];function X(t,e=2){return(Math.round(t*100)/100).toFixed(e)}function L(t,e,n,l){return Math.sqrt((n-t)**2+(l-e)**2)}function O(t,e,n,l,o,r,s){t.beginPath(),t.lineWidth=r,t.strokeStyle=s,t.moveTo(e,n),t.lineTo(l,o),t.stroke()}function T(t,e){t.fillStyle=e,t.fillRect(0,0,t.canvas.width,t.canvas.height)}function q(t){t.clearRect(0,0,t.canvas.width,t.canvas.height)}let F=0;function C(t,e,n=2){let l=1e3/(e-F);F=e;const o=t.fillStyle;t.fillStyle="white",t.fillText(`FPS: ${X(l,n)}`,10,20),t.fillStyle=o}const A=1024,k=512,g=3.1415926535,Y=g/2,H=3*g/2,I=.0174533;function N(t,e,n,l,o,r){let s,f,d,c,y=1e5,a=t.x,u=t.y,w=0;const h=-1/Math.tan(e);if(e>g)f=Math.floor(t.y/n)*n-1e-4,s=(t.y-f)*h+t.x,c=-n,d=-c*h;else if(e<g)f=Math.floor(t.y/n)*n+n,s=(t.y-f)*h+t.x,c=n,d=-c*h;else return{hx:a,hy:u,distH:y};for(;w<8;){const R=Math.floor(s/n),v=Math.floor(f/n)*l+R;if(v<l*o&&r[v]===1){a=s,u=f,y=L(a,u,t.x,t.y);break}s+=d,f+=c,w+=1}return{hx:a,hy:u,distH:y}}function W(t,e,n,l,o,r){let s,f,d,c,y=1e5,a=t.x,u=t.y,w=0;const h=-Math.tan(e);if(e>Y&&e<H)s=Math.floor(t.x/n)*n-1e-4,f=(t.x-s)*h+t.y,d=-n,c=-d*h;else if(e<Y||e>H)s=Math.floor(t.x/n)*n+n,f=(t.x-s)*h+t.y,d=n,c=-d*h;else return{vx:a,vy:u,distV:y};for(;w<8;){const R=Math.floor(s/n),v=Math.floor(f/n)*l+R;if(v<l*o&&r[v]===1){a=s,u=f,y=L(a,u,t.x,t.y);break}s+=d,f+=c,w+=1}return{vx:a,vy:u,distV:y}}function E(t){return t<0&&(t+=2*g),t>2*g&&(t-=2*g),t}function V(t,e,n){let l=t-e;return l=E(l),n*Math.cos(l)}function _(t,e,n,l,o="red"){let r=l*320/n;r=Math.min(r,320);const s=160-r/2,f=8*l+8;t.fillStyle=o,t.fillRect(f+8*e,s,8,r)}const i={x:0,y:0,angle:0,deltaX:0,deltaY:0};function j(){const t=document.querySelector("#screen");if(!t)throw new Error("Failed to find screen element");i.x=200,i.y=200,i.deltaX=Math.cos(i.angle)*5,i.deltaY=Math.sin(i.angle)*5,B(t)}j();function B(t){t.width=A,t.height=k;const e=t.getContext("2d");if(!e)throw new Error("Failed to get 2d context from canvas");T(e,"grey"),requestAnimationFrame(n=>x(n,e))}function x(t,e){q(e),T(e,"grey"),document.addEventListener("keydown",G),J(e,0,0),K(e,"#7e3464",M*m+8,160,60*8,k-352),Q(e,i),$(e,i),C(e,t,2),requestAnimationFrame(n=>x(n,e))}function G(t){t.key==="q"&&(i.angle-=.1,i.angle<0&&(i.angle+=2*g),i.deltaX=Math.cos(i.angle)*5,i.deltaY=Math.sin(i.angle)*5),t.key==="d"&&(i.angle+=.1,i.angle>2*g&&(i.angle-=2*g),i.deltaX=Math.cos(i.angle)*5,i.deltaY=Math.sin(i.angle)*5),t.key==="z"&&(i.y+=i.deltaY,i.x+=i.deltaX),t.key==="s"&&(i.y-=i.deltaY,i.x-=i.deltaX)}function K(t,e,n,l,o,r){t.fillStyle=e,t.fillRect(n,l,o,r)}function $(t,e,n="red"){t.fillStyle=n,t.fillRect(e.x-4,e.y-4,8,8),O(t,e.x,e.y,e.x+e.deltaX*5,e.y+e.deltaY*5,2,n)}function J(t,e,n){for(let l=0;l<m;l++)for(let o=0;o<P;o++)b[o*m+l]===1?t.fillStyle="black":t.fillStyle="white",t.fillRect(e+l*M+1,n+o*M+1,M-1,M-1)}function Q(t,e){let n=E(e.angle-I*30);for(let l=0;l<60;l++){const{hx:o,hy:r,distH:s}=N(e,n,M,m,P,b),{vx:f,vy:d,distV:c}=W(e,n,M,m,P,b),y=s<c?o:f,a=s<c?r:d,u=s<c?s:c,w=s<c?"#7d34eb":"#7e34d2";O(t,e.x,e.y,y,a,1,"green");const h=V(e.angle,n,u);_(t,l,h,M,w),n=E(n+I)}}
