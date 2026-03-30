"use strict";var ReviewsWidget=(()=>{var B=class{constructor(n,t){this.baseUrl=n,this.apiKey=t}async fetchReviews(n=1,t){let a=new URLSearchParams({apiKey:this.apiKey,page:String(n)});t&&a.set("limit",String(t));let r=await fetch(`${this.baseUrl}/api/widget/reviews?${a}`);if(!r.ok)throw new Error("Failed to load reviews");return r.json()}async fetchConfig(){let n=await fetch(`${this.baseUrl}/api/widget/config?apiKey=${this.apiKey}`);if(!n.ok)throw new Error("Failed to load config");return n.json()}async submitReview(n){return(await fetch(`${this.baseUrl}/api/reviews`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()}async getUploadSignature(){return(await fetch(`${this.baseUrl}/api/upload/sign`,{method:"POST"})).json()}};var j='<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>';function D(o,n=""){let t=document.createElement("div");t.className=`rw-stars ${n}`;for(let a=1;a<=5;a++){let r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("viewBox","0 0 20 20"),r.setAttribute("class",`rw-star ${a<=o?"rw-star-filled":""}`),r.innerHTML=j,t.appendChild(r)}return t}function I(o,n=0){let t=n,a=0,r=document.createElement("div");r.className="rw-stars rw-stars-input";let c=[];for(let d=1;d<=5;d++){let p=document.createElement("button");p.type="button",p.style.cssText="background:none;border:none;padding:0;margin:0;cursor:pointer;outline:none;";let i=document.createElementNS("http://www.w3.org/2000/svg","svg");i.setAttribute("viewBox","0 0 20 20"),i.setAttribute("class","rw-star"),i.innerHTML=j,i.style.pointerEvents="none",p.appendChild(i),p.addEventListener("mouseenter",()=>{a=d,m()}),p.addEventListener("click",e=>{e.preventDefault(),t=d,a=0,o(d),m()}),c.push(p),r.appendChild(p)}r.addEventListener("mouseleave",()=>{a=0,m()});function m(){let d=a||t;c.forEach((p,i)=>{let e=p.querySelector("svg");i+1<=d?e.setAttribute("class","rw-star rw-star-filled"):e.setAttribute("class","rw-star")})}return m(),{element:r,getValue:()=>t}}function F(o){let n=document.createElement("div");n.className="rw-summary";let t=document.createElement("div");t.className="rw-summary-avg";let a=document.createElement("div");a.className="rw-summary-number",a.textContent=o.averageRating>0?o.averageRating.toFixed(1):"\u2014",t.appendChild(a),t.appendChild(D(Math.round(o.averageRating),"rw-stars-lg"));let r=document.createElement("div");r.className="rw-summary-count",r.textContent=`${o.totalReviews} Review${o.totalReviews!==1?"s":""}`,t.appendChild(r),n.appendChild(t);let c=document.createElement("div");c.className="rw-summary-bars";for(let m=5;m>=1;m--){let d=o.distribution[m]||0,p=o.totalReviews>0?d/o.totalReviews*100:0,i=document.createElement("div");i.className="rw-bar-row";let e=document.createElement("span");e.className="rw-bar-label",e.textContent=`${m} \u2605`;let s=document.createElement("div");s.className="rw-bar-track";let b=document.createElement("div");b.className="rw-bar-fill",b.style.width=`${p}%`,s.appendChild(b);let u=document.createElement("span");u.className="rw-bar-count",u.textContent=String(d),i.appendChild(e),i.appendChild(s),i.appendChild(u),c.appendChild(i)}return n.appendChild(c),n}function _(o,n,t){let a=document.createElement("div");a.className="rw-card";let r=document.createElement("div");r.className="rw-card-header";let c=document.createElement("div");c.appendChild(D(o.rating));let m=document.createElement("span");m.className="rw-card-author",m.textContent=` ${o.customerName}`,c.appendChild(m),r.appendChild(c),a.appendChild(r);let d=document.createElement("div");d.className="rw-card-title",d.textContent=o.title,a.appendChild(d);let p=document.createElement("div");if(p.className="rw-card-body",p.textContent=o.body,a.appendChild(p),n&&o.media&&o.media.length>0){let i=document.createElement("div");i.className="rw-card-media";for(let e of o.media)if(e.type==="image"){let s=document.createElement("img");s.src=e.thumbnailUrl||e.url,s.alt="Review photo",s.addEventListener("click",()=>t(e.url,"image")),i.appendChild(s)}else{let s=document.createElement("video");s.src=e.url,s.setAttribute("preload","metadata"),s.addEventListener("click",()=>t(e.url,"video")),i.appendChild(s)}a.appendChild(i)}if(o.adminReply){let i=document.createElement("div");i.className="rw-card-reply";let e=document.createElement("div");e.className="rw-card-reply-label",e.textContent="Response from the team";let s=document.createElement("div");s.className="rw-card-reply-text",s.textContent=o.adminReply,i.appendChild(e),i.appendChild(s),a.appendChild(i)}return a}function K(o,n){let t=document.createElement("div");t.className="rw-form-section";let a=document.createElement("div");a.className="rw-form-title",a.textContent="Write a Review",t.appendChild(a);let r=document.createElement("div");r.style.display="none",t.appendChild(r);function c(f,v){r.className=v==="error"?"rw-form-error":"rw-form-success",r.textContent=f,r.style.display="block"}function m(){r.style.display="none"}let d=document.createElement("div");d.className="rw-form-group";let p=document.createElement("label");p.className="rw-form-label",p.textContent="Rating *",d.appendChild(p);let i=0,e=I(f=>{i=f});d.appendChild(e.element),t.appendChild(d);let s=document.createElement("div");s.className="rw-form-row";let b=document.createElement("div");b.className="rw-form-group";let u=document.createElement("label");u.className="rw-form-label",u.textContent="Name *";let l=document.createElement("input");l.className="rw-form-input",l.type="text",l.placeholder="Your name",l.required=!0,l.maxLength=100,b.appendChild(u),b.appendChild(l),s.appendChild(b);let w=document.createElement("div");w.className="rw-form-group";let h=document.createElement("label");h.className="rw-form-label",h.textContent="Email *";let g=document.createElement("input");g.className="rw-form-input",g.type="email",g.placeholder="your@email.com",g.required=!0,w.appendChild(h),w.appendChild(g),s.appendChild(w),t.appendChild(s);let y=document.createElement("div");y.className="rw-form-group";let C=document.createElement("label");C.className="rw-form-label",C.textContent="Title *";let x=document.createElement("input");x.className="rw-form-input",x.type="text",x.placeholder="Brief summary",x.required=!0,x.maxLength=200,y.appendChild(C),y.appendChild(x),t.appendChild(y);let T=document.createElement("div");T.className="rw-form-group";let $=document.createElement("label");$.className="rw-form-label",$.textContent="Your Review *";let R=document.createElement("textarea");R.className="rw-form-textarea",R.placeholder="Share your experience...",R.required=!0,R.maxLength=5e3,T.appendChild($),T.appendChild(R),t.appendChild(T);let z=document.createElement("div");z.className="rw-form-group";let A=document.createElement("label");A.className="rw-form-label",A.textContent="Photos (optional)",z.appendChild(A);let M=document.createElement("div");M.className="rw-form-upload-area",z.appendChild(M),t.appendChild(z);let L=[];function U(){M.innerHTML="";for(let f=0;f<L.length;f++){let v=document.createElement("div");v.className="rw-form-upload-preview";let N=document.createElement("img");N.src=L[f].thumbnailUrl||L[f].url,N.alt="Upload",v.appendChild(N);let P=document.createElement("button");P.type="button",P.className="rw-form-upload-remove",P.textContent="\xD7",P.addEventListener("click",()=>{L.splice(f,1),U()}),v.appendChild(P),M.appendChild(v)}if(L.length<5){let f=document.createElement("label");f.className="rw-form-upload-btn",f.innerHTML="<span>+</span><span>Photo</span>";let v=document.createElement("input");v.type="file",v.accept="image/*",v.style.display="none",v.addEventListener("change",async()=>{var P;let N=(P=v.files)==null?void 0:P[0];if(N){if(N.size>10*1024*1024){c("File too large (max 10MB)","error");return}f.innerHTML="<span>...</span>";try{let S=await o.getUploadSignature(),k=new FormData;k.append("file",N),k.append("api_key",S.apiKey),k.append("timestamp",String(S.timestamp)),k.append("signature",S.signature),k.append("folder",S.folder);let H=await(await fetch(`https://api.cloudinary.com/v1_1/${S.cloudName}/image/upload`,{method:"POST",body:k})).json();H.secure_url&&L.push({type:"image",url:H.secure_url,publicId:H.public_id,thumbnailUrl:H.secure_url.replace("/upload/","/upload/w_200,h_200,c_fill/")})}catch(S){c("Upload failed","error")}U()}}),f.appendChild(v),M.appendChild(f)}}U();let E=document.createElement("button");return E.type="button",E.className="rw-btn rw-btn-primary",E.style.width="100%",E.style.marginTop="8px",E.textContent="Submit Review",E.addEventListener("click",async()=>{if(m(),i===0){c("Please select a rating.","error");return}if(!l.value.trim()){c("Please enter your name.","error");return}if(!g.value.trim()){c("Please enter your email.","error");return}if(!x.value.trim()){c("Please enter a title.","error");return}if(!R.value.trim()){c("Please write your review.","error");return}E.disabled=!0,E.textContent="Submitting...";try{let f=await o.submitReview({customerName:l.value.trim(),customerEmail:g.value.trim(),rating:i,title:x.value.trim(),body:R.value.trim(),media:L});if(f.success){c("Thank you! Your review will be published after approval.","success"),l.value="",g.value="",x.value="",R.value="",i=0,L.length=0,U();let v=I(N=>{i=N});d.replaceChild(v.element,d.lastElementChild),n()}else c(f.error||"Error submitting review.","error")}catch(f){c("Network error. Please try again.","error")}E.disabled=!1,E.textContent="Submit Review"}),t.appendChild(E),t}function W(o,n){let t=document.createElement("div");t.className="rw-lightbox";let a=document.createElement("button");if(a.className="rw-lightbox-close",a.textContent="\u2715",a.addEventListener("click",()=>t.remove()),t.appendChild(a),n==="video"){let r=document.createElement("video");r.src=o,r.controls=!0,r.autoplay=!0,t.appendChild(r)}else{let r=document.createElement("img");r.src=o,r.alt="Review media",t.appendChild(r)}t.addEventListener("click",r=>{r.target===t&&t.remove()}),document.body.appendChild(t)}var q=`/* MDB Reviews Widget \u2014 all classes prefixed with rw- */
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
`;(function(){let o=document.querySelectorAll("script[data-api-key]"),n=null;for(let e of o)if(e.src.includes("reviews-widget")){n=e;break}if(n||(n=document.currentScript),!n){console.error("[MDB Reviews] Script tag not found");return}let t=n.getAttribute("data-api-key"),a=n.getAttribute("data-target")||"#reviews-widget";if(!t){console.error("[MDB Reviews] data-api-key attribute is required");return}let r=n.src,c=r?new URL(r).origin:window.location.origin,m=new B(c,t);function d(){let e=document.querySelector(a);if(!e){console.error(`[MDB Reviews] Container "${a}" not found`);return}let s=document.createElement("style");s.textContent=q,e.appendChild(s);let b=document.createElement("div");b.className="rw-loading",b.textContent="Loading reviews...",e.appendChild(b),Promise.all([m.fetchConfig(),m.fetchReviews(1)]).then(([u,l])=>{b.remove();let w=u.widget;e.style.setProperty("--rw-primary",w.primaryColor),e.style.setProperty("--rw-bg",w.backgroundColor),e.style.setProperty("--rw-text",w.textColor);let h=document.createElement("div");h.className="rw-container";let g={currentPage:l.page,totalPages:l.totalPages,reviews:l.reviews};l.stats.totalReviews>0&&h.appendChild(F(l.stats));let y=document.createElement("div");if(y.className="rw-list",p(y,g.reviews,w.showMedia),h.appendChild(y),l.stats.totalReviews===0){let C=document.createElement("div");C.className="rw-empty",C.textContent="No reviews yet. Be the first!",h.appendChild(C)}if(g.totalPages>1){let C=i(g,y,w.showMedia);h.appendChild(C)}if(w.showReviewForm){let C=K(m,()=>{m.fetchReviews(1).then(x=>{g.currentPage=1,g.totalPages=x.totalPages,g.reviews=x.reviews,p(y,g.reviews,w.showMedia)})});h.appendChild(C)}e.appendChild(h)},u=>{b.textContent="Could not load reviews.",console.error("[MDB Reviews]",u)})}function p(e,s,b){e.innerHTML="";for(let u of s)e.appendChild(_(u,b,(l,w)=>W(l,w)))}function i(e,s,b){let u=document.createElement("div");u.className="rw-pagination";let l=document.createElement("button");l.className="rw-btn",l.textContent="\u2190 Previous";let w=document.createElement("span");w.className="rw-page-info";let h=document.createElement("button");h.className="rw-btn",h.textContent="Next \u2192";function g(){w.textContent=`Page ${e.currentPage} of ${e.totalPages}`,l.disabled=e.currentPage<=1,h.disabled=e.currentPage>=e.totalPages}async function y(C){l.disabled=!0,h.disabled=!0,w.textContent="Loading...";try{let x=await m.fetchReviews(C);e.currentPage=x.page,e.totalPages=x.totalPages,e.reviews=x.reviews,p(s,e.reviews,b),s.scrollIntoView({behavior:"smooth",block:"start"})}catch(x){console.error("[MDB Reviews]",x)}g()}return l.addEventListener("click",()=>{e.currentPage>1&&y(e.currentPage-1)}),h.addEventListener("click",()=>{e.currentPage<e.totalPages&&y(e.currentPage+1)}),u.appendChild(l),u.appendChild(w),u.appendChild(h),g(),u}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d()})();})();
