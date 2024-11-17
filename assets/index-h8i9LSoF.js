(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const v=8,E=8,w=v*E,b=[1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,1,0,0,0,0,1,1,0,0,0,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1];function q(t,e=2){return(Math.round(t*100)/100).toFixed(e)}function O(t,e,n,i){return Math.sqrt((n-t)**2+(i-e)**2)}function T(t,e,n,i,o,r,s){t.beginPath(),t.lineWidth=r,t.strokeStyle=s,t.moveTo(e,n),t.lineTo(i,o),t.stroke()}function k(t,e){t.fillStyle=e,t.fillRect(0,0,t.canvas.width,t.canvas.height)}function C(t){t.clearRect(0,0,t.canvas.width,t.canvas.height)}let L=0;function A(t,e,n=2){let i=1e3/(e-L);L=e;const o=t.fillStyle;t.fillStyle="white",t.fillText(`FPS: ${q(i,n)}`,10,20),t.fillStyle=o}const N=1024,x=512,g=3.1415926535,Y=g/2,H=3*g/2,I=.0174533;function W(t,e,n,i,o,r){let s,f,d,c,y=1e5,a=t.x,u=t.y,M=0;const h=-1/Math.tan(e);if(e>g)f=Math.floor(t.y/n)*n-1e-4,s=(t.y-f)*h+t.x,c=-n,d=-c*h;else if(e<g)f=Math.floor(t.y/n)*n+n,s=(t.y-f)*h+t.x,c=n,d=-c*h;else return{hx:a,hy:u,distH:y};for(;M<8;){const R=Math.floor(s/n),P=Math.floor(f/n)*i+R;if(P<i*o&&r[P]===1){a=s,u=f,y=O(a,u,t.x,t.y);break}s+=d,f+=c,M+=1}return{hx:a,hy:u,distH:y}}function V(t,e,n,i,o,r){let s,f,d,c,y=1e5,a=t.x,u=t.y,M=0;const h=-Math.tan(e);if(e>Y&&e<H)s=Math.floor(t.x/n)*n-1e-4,f=(t.x-s)*h+t.y,d=-n,c=-d*h;else if(e<Y||e>H)s=Math.floor(t.x/n)*n+n,f=(t.x-s)*h+t.y,d=n,c=-d*h;else return{vx:a,vy:u,distV:y};for(;M<8;){const R=Math.floor(s/n),P=Math.floor(f/n)*i+R;if(P<i*o&&r[P]===1){a=s,u=f,y=O(a,u,t.x,t.y);break}s+=d,f+=c,M+=1}return{vx:a,vy:u,distV:y}}function F(t){return t<0&&(t+=2*g),t>2*g&&(t-=2*g),t}function _(t,e,n){let i=t-e;return i=F(i),n*Math.cos(i)}function j(t,e,n,i,o="red"){let r=i*320/n;r=Math.min(r,320);const s=160-r/2,f=8*i+8;t.fillStyle=o,t.fillRect(f+8*e,s,8,r)}const l={x:0,y:0,angle:0,deltaX:0,deltaY:0},m={};function B(){const t=document.querySelector("#screen");if(!t)throw new Error("Failed to find screen element");l.x=200,l.y=200,l.deltaX=Math.cos(l.angle)*3,l.deltaY=Math.sin(l.angle)*3,G(t)}B();function G(t){t.width=N,t.height=x;const e=t.getContext("2d");if(!e)throw new Error("Failed to get 2d context from canvas");k(e,"grey"),requestAnimationFrame(n=>D(n,e))}function D(t,e){C(e),k(e,"grey"),window.addEventListener("keydown",n=>{m[n.key]=!0}),window.addEventListener("keyup",n=>{m[n.key]=!1}),K(),Q(e,0,0),$(e,"#7e3464",w*v+8,160,60*8,x-352),S(e,l),J(e,l),A(e,t,2),requestAnimationFrame(n=>D(n,e))}function K(){m.q&&(l.angle-=.05,l.angle<0&&(l.angle+=2*g),l.deltaX=Math.cos(l.angle)*3,l.deltaY=Math.sin(l.angle)*3),m.d&&(l.angle+=.05,l.angle>2*g&&(l.angle-=2*g),l.deltaX=Math.cos(l.angle)*3,l.deltaY=Math.sin(l.angle)*3),m.z&&(l.y+=l.deltaY,l.x+=l.deltaX),m.s&&(l.y-=l.deltaY,l.x-=l.deltaX)}function $(t,e,n,i,o,r){t.fillStyle=e,t.fillRect(n,i,o,r)}function J(t,e,n="red"){t.fillStyle=n,t.fillRect(e.x-4,e.y-4,8,8),T(t,e.x,e.y,e.x+e.deltaX*5,e.y+e.deltaY*5,2,n)}function Q(t,e,n){for(let i=0;i<v;i++)for(let o=0;o<E;o++)b[o*v+i]===1?t.fillStyle="black":t.fillStyle="white",t.fillRect(e+i*w+1,n+o*w+1,w-1,w-1)}function S(t,e){let n=F(e.angle-I*30);for(let i=0;i<60;i++){const{hx:o,hy:r,distH:s}=W(e,n,w,v,E,b),{vx:f,vy:d,distV:c}=V(e,n,w,v,E,b),y=s<c?o:f,a=s<c?r:d,u=s<c?s:c,M=s<c?"#7d34eb":"#7e34d2";T(t,e.x,e.y,y,a,1,"green");const h=_(e.angle,n,u);j(t,i,h,w,M),n=F(n+I)}}