"use strict";var ReviewsWidget=(()=>{var U=class{constructor(i,e){this.baseUrl=i,this.apiKey=e}async fetchReviews(i=1,e){let n=new URLSearchParams({apiKey:this.apiKey,page:String(i)});e&&n.set("limit",String(e));let r=await fetch(`${this.baseUrl}/api/widget/reviews?${n}`);if(!r.ok)throw new Error("Failed to load reviews");return r.json()}async fetchConfig(){let i=await fetch(`${this.baseUrl}/api/widget/config?apiKey=${this.apiKey}`);if(!i.ok)throw new Error("Failed to load config");return i.json()}async submitReview(i){return(await fetch(`${this.baseUrl}/api/reviews`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json()}async getUploadSignature(){return(await fetch(`${this.baseUrl}/api/upload/sign`,{method:"POST"})).json()}};var I='<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>';function H(a,i=""){let e=document.createElement("div");e.className=`rw-stars ${i}`;for(let n=1;n<=5;n++){let r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("viewBox","0 0 20 20"),r.setAttribute("class",`rw-star ${n<=a?"rw-star-filled":""}`),r.innerHTML=I,e.appendChild(r)}return e}function F(a,i=0){let e=i,n=document.createElement("div");n.className="rw-stars rw-stars-input";function r(p=0){n.innerHTML="";for(let c=1;c<=5;c++){let d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("viewBox","0 0 20 20"),d.setAttribute("class",`rw-star ${c<=(p||e)?"rw-star-filled":""}`),d.innerHTML=I,d.style.cursor="pointer",d.addEventListener("mouseenter",()=>r(c)),d.addEventListener("click",()=>{e=c,a(c),r()}),n.appendChild(d)}}return n.addEventListener("mouseleave",()=>r()),r(),{element:n,getValue:()=>e}}function j(a){let i=document.createElement("div");i.className="rw-summary";let e=document.createElement("div");e.className="rw-summary-avg";let n=document.createElement("div");n.className="rw-summary-number",n.textContent=a.averageRating>0?a.averageRating.toFixed(1):"\u2014",e.appendChild(n),e.appendChild(H(Math.round(a.averageRating),"rw-stars-lg"));let r=document.createElement("div");r.className="rw-summary-count",r.textContent=`${a.totalReviews} Review${a.totalReviews!==1?"s":""}`,e.appendChild(r),i.appendChild(e);let p=document.createElement("div");p.className="rw-summary-bars";for(let c=5;c>=1;c--){let d=a.distribution[c]||0,v=a.totalReviews>0?d/a.totalReviews*100:0,h=document.createElement("div");h.className="rw-bar-row";let t=document.createElement("span");t.className="rw-bar-label",t.textContent=`${c} \u2605`;let s=document.createElement("div");s.className="rw-bar-track";let o=document.createElement("div");o.className="rw-bar-fill",o.style.width=`${v}%`,s.appendChild(o);let m=document.createElement("span");m.className="rw-bar-count",m.textContent=String(d),h.appendChild(t),h.appendChild(s),h.appendChild(m),p.appendChild(h)}return i.appendChild(p),i}function _(a,i,e){let n=document.createElement("div");n.className="rw-card";let r=document.createElement("div");r.className="rw-card-header";let p=document.createElement("div");p.appendChild(H(a.rating));let c=document.createElement("span");c.className="rw-card-author",c.textContent=` ${a.customerName}`,p.appendChild(c),r.appendChild(p);let d=document.createElement("span");d.className="rw-card-date",d.textContent=new Date(a.createdAt).toLocaleDateString("de-DE"),r.appendChild(d),n.appendChild(r);let v=document.createElement("div");v.className="rw-card-title",v.textContent=a.title,n.appendChild(v);let h=document.createElement("div");if(h.className="rw-card-body",h.textContent=a.body,n.appendChild(h),i&&a.media&&a.media.length>0){let t=document.createElement("div");t.className="rw-card-media";for(let s of a.media)if(s.type==="image"){let o=document.createElement("img");o.src=s.thumbnailUrl||s.url,o.alt="Review photo",o.addEventListener("click",()=>e(s.url,"image")),t.appendChild(o)}else{let o=document.createElement("video");o.src=s.url,o.setAttribute("preload","metadata"),o.addEventListener("click",()=>e(s.url,"video")),t.appendChild(o)}n.appendChild(t)}if(a.adminReply){let t=document.createElement("div");t.className="rw-card-reply";let s=document.createElement("div");s.className="rw-card-reply-label",s.textContent="Antwort vom Team";let o=document.createElement("div");o.className="rw-card-reply-text",o.textContent=a.adminReply,t.appendChild(s),t.appendChild(o),n.appendChild(t)}return n}function K(a,i){let e=document.createElement("div");e.className="rw-form-section";let n=document.createElement("div");n.className="rw-form-title",n.textContent="Schreibe ein Review",e.appendChild(n);let r=document.createElement("div");r.style.display="none",e.appendChild(r);function p(g,x){r.className=x==="error"?"rw-form-error":"rw-form-success",r.textContent=g,r.style.display="block"}function c(){r.style.display="none"}let d=document.createElement("div");d.className="rw-form-group";let v=document.createElement("label");v.className="rw-form-label",v.textContent="Bewertung *",d.appendChild(v);let h=0,t=F(g=>{h=g});d.appendChild(t.element),e.appendChild(d);let s=document.createElement("div");s.className="rw-form-row";let o=document.createElement("div");o.className="rw-form-group";let m=document.createElement("label");m.className="rw-form-label",m.textContent="Name *";let l=document.createElement("input");l.className="rw-form-input",l.type="text",l.placeholder="Dein Name",l.required=!0,l.maxLength=100,o.appendChild(m),o.appendChild(l),s.appendChild(o);let u=document.createElement("div");u.className="rw-form-group";let f=document.createElement("label");f.className="rw-form-label",f.textContent="E-Mail *";let w=document.createElement("input");w.className="rw-form-input",w.type="email",w.placeholder="deine@email.de",w.required=!0,u.appendChild(f),u.appendChild(w),s.appendChild(u),e.appendChild(s);let y=document.createElement("div");y.className="rw-form-group";let C=document.createElement("label");C.className="rw-form-label",C.textContent="Titel *";let b=document.createElement("input");b.className="rw-form-input",b.type="text",b.placeholder="Kurze Zusammenfassung",b.required=!0,b.maxLength=200,y.appendChild(C),y.appendChild(b),e.appendChild(y);let z=document.createElement("div");z.className="rw-form-group";let $=document.createElement("label");$.className="rw-form-label",$.textContent="Dein Review *";let R=document.createElement("textarea");R.className="rw-form-textarea",R.placeholder="Erz\xE4hle von deiner Erfahrung...",R.required=!0,R.maxLength=5e3,z.appendChild($),z.appendChild(R),e.appendChild(z);let T=document.createElement("div");T.className="rw-form-group";let A=document.createElement("label");A.className="rw-form-label",A.textContent="Fotos (optional)",T.appendChild(A);let M=document.createElement("div");M.className="rw-form-upload-area",T.appendChild(M),e.appendChild(T);let L=[];function D(){M.innerHTML="";for(let g=0;g<L.length;g++){let x=document.createElement("div");x.className="rw-form-upload-preview";let N=document.createElement("img");N.src=L[g].thumbnailUrl||L[g].url,N.alt="Upload",x.appendChild(N);let S=document.createElement("button");S.type="button",S.className="rw-form-upload-remove",S.textContent="\xD7",S.addEventListener("click",()=>{L.splice(g,1),D()}),x.appendChild(S),M.appendChild(x)}if(L.length<5){let g=document.createElement("label");g.className="rw-form-upload-btn",g.innerHTML="<span>+</span><span>Foto</span>";let x=document.createElement("input");x.type="file",x.accept="image/*",x.style.display="none",x.addEventListener("change",async()=>{var S;let N=(S=x.files)==null?void 0:S[0];if(N){if(N.size>10*1024*1024){p("Datei zu gro\xDF (max 10MB)","error");return}g.innerHTML="<span>...</span>";try{let k=await a.getUploadSignature(),P=new FormData;P.append("file",N),P.append("api_key",k.apiKey),P.append("timestamp",String(k.timestamp)),P.append("signature",k.signature),P.append("folder",k.folder);let B=await(await fetch(`https://api.cloudinary.com/v1_1/${k.cloudName}/image/upload`,{method:"POST",body:P})).json();B.secure_url&&L.push({type:"image",url:B.secure_url,publicId:B.public_id,thumbnailUrl:B.secure_url.replace("/upload/","/upload/w_200,h_200,c_fill/")})}catch(k){p("Upload fehlgeschlagen","error")}D()}}),g.appendChild(x),M.appendChild(g)}}D();let E=document.createElement("button");return E.type="button",E.className="rw-btn rw-btn-primary",E.style.width="100%",E.style.marginTop="8px",E.textContent="Review absenden",E.addEventListener("click",async()=>{if(c(),h===0){p("Bitte w\xE4hle eine Bewertung.","error");return}if(!l.value.trim()){p("Bitte gib deinen Namen ein.","error");return}if(!w.value.trim()){p("Bitte gib deine E-Mail ein.","error");return}if(!b.value.trim()){p("Bitte gib einen Titel ein.","error");return}if(!R.value.trim()){p("Bitte schreibe dein Review.","error");return}E.disabled=!0,E.textContent="Wird gesendet...";try{let g=await a.submitReview({customerName:l.value.trim(),customerEmail:w.value.trim(),rating:h,title:b.value.trim(),body:R.value.trim(),media:L});if(g.success){p("Vielen Dank! Dein Review wird nach Pr\xFCfung ver\xF6ffentlicht.","success"),l.value="",w.value="",b.value="",R.value="",h=0,L.length=0,D();let x=F(N=>{h=N});d.replaceChild(x.element,d.lastElementChild),i()}else p(g.error||"Fehler beim Absenden.","error")}catch(g){p("Netzwerkfehler. Bitte versuche es erneut.","error")}E.disabled=!1,E.textContent="Review absenden"}),e.appendChild(E),e}function W(a,i){let e=document.createElement("div");e.className="rw-lightbox";let n=document.createElement("button");if(n.className="rw-lightbox-close",n.textContent="\u2715",n.addEventListener("click",()=>e.remove()),e.appendChild(n),i==="video"){let r=document.createElement("video");r.src=a,r.controls=!0,r.autoplay=!0,e.appendChild(r)}else{let r=document.createElement("img");r.src=a,r.alt="Review media",e.appendChild(r)}e.addEventListener("click",r=>{r.target===e&&e.remove()}),document.body.appendChild(e)}var q=`/* MDB Reviews Widget \u2014 all classes prefixed with rw- */
#reviews-widget {
  all: initial;
  contain: content;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--rw-text);
  background: var(--rw-bg);
  box-sizing: border-box;
  display: block;
}
#reviews-widget *, #reviews-widget *::before, #reviews-widget *::after {
  box-sizing: border-box;
}

.rw-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 0;
}

/* Summary */
.rw-summary {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 24px;
  background: #fff;
}
.rw-summary-avg {
  text-align: center;
  min-width: 100px;
}
.rw-summary-number {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  color: var(--rw-text);
}
.rw-summary-count {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}
.rw-summary-bars {
  flex: 1;
}
.rw-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.rw-bar-label {
  font-size: 13px;
  color: #6b7280;
  width: 50px;
  text-align: right;
}
.rw-bar-track {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}
.rw-bar-fill {
  height: 100%;
  border-radius: 4px;
  background: var(--rw-primary);
  transition: width 0.3s ease;
}
.rw-bar-count {
  font-size: 13px;
  color: #6b7280;
  width: 30px;
}

/* Stars */
.rw-stars {
  display: inline-flex;
  gap: 2px;
}
.rw-star {
  width: 20px;
  height: 20px;
  fill: #d1d5db;
}
.rw-star.rw-star-filled {
  fill: var(--rw-primary);
}
.rw-stars-lg .rw-star {
  width: 24px;
  height: 24px;
}
.rw-stars-input {
  cursor: pointer;
}
.rw-stars-input .rw-star {
  width: 32px;
  height: 32px;
  transition: fill 0.15s;
}
.rw-stars-input .rw-star:hover {
  transform: scale(1.1);
}

/* Review List */
.rw-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.rw-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
}
.rw-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.rw-card-author {
  font-weight: 600;
  font-size: 15px;
  color: var(--rw-text);
}
.rw-card-date {
  font-size: 13px;
  color: #9ca3af;
}
.rw-card-title {
  font-weight: 600;
  font-size: 16px;
  margin: 8px 0 4px;
  color: var(--rw-text);
}
.rw-card-body {
  font-size: 15px;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
}
.rw-card-media {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.rw-card-media img, .rw-card-media video {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}
.rw-card-media img:hover, .rw-card-media video:hover {
  opacity: 0.8;
}
.rw-card-reply {
  margin-top: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid var(--rw-primary);
}
.rw-card-reply-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.rw-card-reply-text {
  font-size: 14px;
  color: #374151;
}

/* Pagination */
.rw-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}
.rw-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: var(--rw-text);
  cursor: pointer;
  transition: all 0.15s;
}
.rw-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
.rw-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.rw-btn-primary {
  background: var(--rw-primary);
  color: #fff;
  border-color: var(--rw-primary);
}
.rw-btn-primary:hover {
  opacity: 0.9;
  background: var(--rw-primary);
}
.rw-page-info {
  font-size: 14px;
  color: #6b7280;
}

/* Review Form */
.rw-form-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  background: #fff;
}
.rw-form-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--rw-text);
}
.rw-form-group {
  margin-bottom: 16px;
}
.rw-form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}
.rw-form-input, .rw-form-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: var(--rw-text);
  font-family: inherit;
  transition: border-color 0.15s;
}
.rw-form-input:focus, .rw-form-textarea:focus {
  outline: none;
  border-color: var(--rw-primary);
  box-shadow: 0 0 0 3px rgba(255, 184, 0, 0.1);
}
.rw-form-textarea {
  resize: vertical;
  min-height: 100px;
}
.rw-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.rw-form-error {
  color: #dc2626;
  font-size: 14px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 16px;
}
.rw-form-success {
  color: #16a34a;
  font-size: 14px;
  padding: 10px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  text-align: center;
}
.rw-form-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.rw-form-upload-btn {
  width: 72px;
  height: 72px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  color: #9ca3af;
  background: #fff;
  transition: border-color 0.15s;
}
.rw-form-upload-btn:hover {
  border-color: var(--rw-primary);
}
.rw-form-upload-preview {
  position: relative;
  width: 72px;
  height: 72px;
}
.rw-form-upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.rw-form-upload-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Lightbox */
.rw-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.rw-lightbox img, .rw-lightbox video {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
}
.rw-lightbox-close {
  position: absolute;
  top: 16px;
  right: 24px;
  background: none;
  border: none;
  color: #fff;
  font-size: 32px;
  cursor: pointer;
}

/* Loading */
.rw-loading {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 14px;
}
.rw-empty {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 15px;
}

/* Responsive */
@media (max-width: 600px) {
  .rw-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .rw-summary-avg {
    text-align: left;
  }
  .rw-form-row {
    grid-template-columns: 1fr;
  }
}
`;(function(){let a=document.querySelectorAll("script[data-api-key]"),i=null;for(let t of a)if(t.src.includes("reviews-widget")){i=t;break}if(i||(i=document.currentScript),!i){console.error("[MDB Reviews] Script tag not found");return}let e=i.getAttribute("data-api-key"),n=i.getAttribute("data-target")||"#reviews-widget";if(!e){console.error("[MDB Reviews] data-api-key attribute is required");return}let r=i.src,p=r?new URL(r).origin:window.location.origin,c=new U(p,e);function d(){let t=document.querySelector(n);if(!t){console.error(`[MDB Reviews] Container "${n}" not found`);return}let s=document.createElement("style");s.textContent=q,t.appendChild(s);let o=document.createElement("div");o.className="rw-loading",o.textContent="Reviews werden geladen...",t.appendChild(o),Promise.all([c.fetchConfig(),c.fetchReviews(1)]).then(([m,l])=>{o.remove();let u=m.widget;t.style.setProperty("--rw-primary",u.primaryColor),t.style.setProperty("--rw-bg",u.backgroundColor),t.style.setProperty("--rw-text",u.textColor);let f=document.createElement("div");f.className="rw-container";let w={currentPage:l.page,totalPages:l.totalPages,reviews:l.reviews};l.stats.totalReviews>0&&f.appendChild(j(l.stats));let y=document.createElement("div");if(y.className="rw-list",v(y,w.reviews,u.showMedia),f.appendChild(y),l.stats.totalReviews===0){let C=document.createElement("div");C.className="rw-empty",C.textContent="Noch keine Reviews vorhanden. Sei der Erste!",f.appendChild(C)}if(w.totalPages>1){let C=h(w,y,u.showMedia);f.appendChild(C)}if(u.showReviewForm){let C=K(c,()=>{c.fetchReviews(1).then(b=>{w.currentPage=1,w.totalPages=b.totalPages,w.reviews=b.reviews,v(y,w.reviews,u.showMedia)})});f.appendChild(C)}t.appendChild(f)},m=>{o.textContent="Reviews konnten nicht geladen werden.",console.error("[MDB Reviews]",m)})}function v(t,s,o){t.innerHTML="";for(let m of s)t.appendChild(_(m,o,(l,u)=>W(l,u)))}function h(t,s,o){let m=document.createElement("div");m.className="rw-pagination";let l=document.createElement("button");l.className="rw-btn",l.textContent="\u2190 Zur\xFCck";let u=document.createElement("span");u.className="rw-page-info";let f=document.createElement("button");f.className="rw-btn",f.textContent="Weiter \u2192";function w(){u.textContent=`Seite ${t.currentPage} von ${t.totalPages}`,l.disabled=t.currentPage<=1,f.disabled=t.currentPage>=t.totalPages}async function y(C){l.disabled=!0,f.disabled=!0,u.textContent="Laden...";try{let b=await c.fetchReviews(C);t.currentPage=b.page,t.totalPages=b.totalPages,t.reviews=b.reviews,v(s,t.reviews,o),s.scrollIntoView({behavior:"smooth",block:"start"})}catch(b){console.error("[MDB Reviews]",b)}w()}return l.addEventListener("click",()=>{t.currentPage>1&&y(t.currentPage-1)}),f.addEventListener("click",()=>{t.currentPage<t.totalPages&&y(t.currentPage+1)}),m.appendChild(l),m.appendChild(u),m.appendChild(f),w(),m}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d()})();})();
