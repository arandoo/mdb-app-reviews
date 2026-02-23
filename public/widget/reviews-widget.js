"use strict";var ReviewsWidget=(()=>{var B=class{constructor(n,e){this.baseUrl=n,this.apiKey=e}async fetchReviews(n=1,e){let a=new URLSearchParams({apiKey:this.apiKey,page:String(n)});e&&a.set("limit",String(e));let r=await fetch(`${this.baseUrl}/api/widget/reviews?${a}`);if(!r.ok)throw new Error("Failed to load reviews");return r.json()}async fetchConfig(){let n=await fetch(`${this.baseUrl}/api/widget/config?apiKey=${this.apiKey}`);if(!n.ok)throw new Error("Failed to load config");return n.json()}async submitReview(n){return(await fetch(`${this.baseUrl}/api/reviews`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()}async getUploadSignature(){return(await fetch(`${this.baseUrl}/api/upload/sign`,{method:"POST"})).json()}};var A='<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>';function $(o,n=""){let e=document.createElement("div");e.className=`rw-stars ${n}`;for(let a=1;a<=5;a++){let r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("viewBox","0 0 20 20"),r.setAttribute("class",`rw-star ${a<=o?"rw-star-filled":""}`),r.innerHTML=A,e.appendChild(r)}return e}function j(o,n=0){let e=n,a=document.createElement("div");a.className="rw-stars rw-stars-input";function r(p=0){a.innerHTML="";for(let d=1;d<=5;d++){let s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 20 20"),s.setAttribute("class",`rw-star ${d<=(p||e)?"rw-star-filled":""}`),s.innerHTML=A,s.style.cursor="pointer",s.addEventListener("mouseenter",()=>r(d)),s.addEventListener("click",()=>{e=d,o(d),r()}),a.appendChild(s)}}return a.addEventListener("mouseleave",()=>r()),r(),{element:a,getValue:()=>e}}function F(o){let n=document.createElement("div");n.className="rw-summary";let e=document.createElement("div");e.className="rw-summary-avg";let a=document.createElement("div");a.className="rw-summary-number",a.textContent=o.averageRating>0?o.averageRating.toFixed(1):"\u2014",e.appendChild(a),e.appendChild($(Math.round(o.averageRating),"rw-stars-lg"));let r=document.createElement("div");r.className="rw-summary-count",r.textContent=`${o.totalReviews} Review${o.totalReviews!==1?"s":""}`,e.appendChild(r),n.appendChild(e);let p=document.createElement("div");p.className="rw-summary-bars";for(let d=5;d>=1;d--){let s=o.distribution[d]||0,v=o.totalReviews>0?s/o.totalReviews*100:0,c=document.createElement("div");c.className="rw-bar-row";let t=document.createElement("span");t.className="rw-bar-label",t.textContent=`${d} \u2605`;let i=document.createElement("div");i.className="rw-bar-track";let f=document.createElement("div");f.className="rw-bar-fill",f.style.width=`${v}%`,i.appendChild(f);let m=document.createElement("span");m.className="rw-bar-count",m.textContent=String(s),c.appendChild(t),c.appendChild(i),c.appendChild(m),p.appendChild(c)}return n.appendChild(p),n}function _(o,n,e){let a=document.createElement("div");a.className="rw-card";let r=document.createElement("div");r.className="rw-card-header";let p=document.createElement("div");p.appendChild($(o.rating));let d=document.createElement("span");d.className="rw-card-author",d.textContent=` ${o.customerName}`,p.appendChild(d),r.appendChild(p),a.appendChild(r);let s=document.createElement("div");s.className="rw-card-title",s.textContent=o.title,a.appendChild(s);let v=document.createElement("div");if(v.className="rw-card-body",v.textContent=o.body,a.appendChild(v),n&&o.media&&o.media.length>0){let c=document.createElement("div");c.className="rw-card-media";for(let t of o.media)if(t.type==="image"){let i=document.createElement("img");i.src=t.thumbnailUrl||t.url,i.alt="Review photo",i.addEventListener("click",()=>e(t.url,"image")),c.appendChild(i)}else{let i=document.createElement("video");i.src=t.url,i.setAttribute("preload","metadata"),i.addEventListener("click",()=>e(t.url,"video")),c.appendChild(i)}a.appendChild(c)}if(o.adminReply){let c=document.createElement("div");c.className="rw-card-reply";let t=document.createElement("div");t.className="rw-card-reply-label",t.textContent="Response from the team";let i=document.createElement("div");i.className="rw-card-reply-text",i.textContent=o.adminReply,c.appendChild(t),c.appendChild(i),a.appendChild(c)}return a}function K(o,n){let e=document.createElement("div");e.className="rw-form-section";let a=document.createElement("div");a.className="rw-form-title",a.textContent="Write a Review",e.appendChild(a);let r=document.createElement("div");r.style.display="none",e.appendChild(r);function p(g,h){r.className=h==="error"?"rw-form-error":"rw-form-success",r.textContent=g,r.style.display="block"}function d(){r.style.display="none"}let s=document.createElement("div");s.className="rw-form-group";let v=document.createElement("label");v.className="rw-form-label",v.textContent="Rating *",s.appendChild(v);let c=0,t=j(g=>{c=g});s.appendChild(t.element),e.appendChild(s);let i=document.createElement("div");i.className="rw-form-row";let f=document.createElement("div");f.className="rw-form-group";let m=document.createElement("label");m.className="rw-form-label",m.textContent="Name *";let l=document.createElement("input");l.className="rw-form-input",l.type="text",l.placeholder="Your name",l.required=!0,l.maxLength=100,f.appendChild(m),f.appendChild(l),i.appendChild(f);let u=document.createElement("div");u.className="rw-form-group";let b=document.createElement("label");b.className="rw-form-label",b.textContent="Email *";let w=document.createElement("input");w.className="rw-form-input",w.type="email",w.placeholder="your@email.com",w.required=!0,u.appendChild(b),u.appendChild(w),i.appendChild(u),e.appendChild(i);let y=document.createElement("div");y.className="rw-form-group";let C=document.createElement("label");C.className="rw-form-label",C.textContent="Title *";let x=document.createElement("input");x.className="rw-form-input",x.type="text",x.placeholder="Brief summary",x.required=!0,x.maxLength=200,y.appendChild(C),y.appendChild(x),e.appendChild(y);let T=document.createElement("div");T.className="rw-form-group";let D=document.createElement("label");D.className="rw-form-label",D.textContent="Your Review *";let R=document.createElement("textarea");R.className="rw-form-textarea",R.placeholder="Share your experience...",R.required=!0,R.maxLength=5e3,T.appendChild(D),T.appendChild(R),e.appendChild(T);let z=document.createElement("div");z.className="rw-form-group";let I=document.createElement("label");I.className="rw-form-label",I.textContent="Photos (optional)",z.appendChild(I);let M=document.createElement("div");M.className="rw-form-upload-area",z.appendChild(M),e.appendChild(z);let L=[];function U(){M.innerHTML="";for(let g=0;g<L.length;g++){let h=document.createElement("div");h.className="rw-form-upload-preview";let N=document.createElement("img");N.src=L[g].thumbnailUrl||L[g].url,N.alt="Upload",h.appendChild(N);let P=document.createElement("button");P.type="button",P.className="rw-form-upload-remove",P.textContent="\xD7",P.addEventListener("click",()=>{L.splice(g,1),U()}),h.appendChild(P),M.appendChild(h)}if(L.length<5){let g=document.createElement("label");g.className="rw-form-upload-btn",g.innerHTML="<span>+</span><span>Photo</span>";let h=document.createElement("input");h.type="file",h.accept="image/*",h.style.display="none",h.addEventListener("change",async()=>{var P;let N=(P=h.files)==null?void 0:P[0];if(N){if(N.size>10*1024*1024){p("File too large (max 10MB)","error");return}g.innerHTML="<span>...</span>";try{let S=await o.getUploadSignature(),k=new FormData;k.append("file",N),k.append("api_key",S.apiKey),k.append("timestamp",String(S.timestamp)),k.append("signature",S.signature),k.append("folder",S.folder);let H=await(await fetch(`https://api.cloudinary.com/v1_1/${S.cloudName}/image/upload`,{method:"POST",body:k})).json();H.secure_url&&L.push({type:"image",url:H.secure_url,publicId:H.public_id,thumbnailUrl:H.secure_url.replace("/upload/","/upload/w_200,h_200,c_fill/")})}catch(S){p("Upload failed","error")}U()}}),g.appendChild(h),M.appendChild(g)}}U();let E=document.createElement("button");return E.type="button",E.className="rw-btn rw-btn-primary",E.style.width="100%",E.style.marginTop="8px",E.textContent="Submit Review",E.addEventListener("click",async()=>{if(d(),c===0){p("Please select a rating.","error");return}if(!l.value.trim()){p("Please enter your name.","error");return}if(!w.value.trim()){p("Please enter your email.","error");return}if(!x.value.trim()){p("Please enter a title.","error");return}if(!R.value.trim()){p("Please write your review.","error");return}E.disabled=!0,E.textContent="Submitting...";try{let g=await o.submitReview({customerName:l.value.trim(),customerEmail:w.value.trim(),rating:c,title:x.value.trim(),body:R.value.trim(),media:L});if(g.success){p("Thank you! Your review will be published after approval.","success"),l.value="",w.value="",x.value="",R.value="",c=0,L.length=0,U();let h=j(N=>{c=N});s.replaceChild(h.element,s.lastElementChild),n()}else p(g.error||"Error submitting review.","error")}catch(g){p("Network error. Please try again.","error")}E.disabled=!1,E.textContent="Submit Review"}),e.appendChild(E),e}function W(o,n){let e=document.createElement("div");e.className="rw-lightbox";let a=document.createElement("button");if(a.className="rw-lightbox-close",a.textContent="\u2715",a.addEventListener("click",()=>e.remove()),e.appendChild(a),n==="video"){let r=document.createElement("video");r.src=o,r.controls=!0,r.autoplay=!0,e.appendChild(r)}else{let r=document.createElement("img");r.src=o,r.alt="Review media",e.appendChild(r)}e.addEventListener("click",r=>{r.target===e&&e.remove()}),document.body.appendChild(e)}var q=`/* MDB Reviews Widget \u2014 all classes prefixed with rw- */
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
`;(function(){let o=document.querySelectorAll("script[data-api-key]"),n=null;for(let t of o)if(t.src.includes("reviews-widget")){n=t;break}if(n||(n=document.currentScript),!n){console.error("[MDB Reviews] Script tag not found");return}let e=n.getAttribute("data-api-key"),a=n.getAttribute("data-target")||"#reviews-widget";if(!e){console.error("[MDB Reviews] data-api-key attribute is required");return}let r=n.src,p=r?new URL(r).origin:window.location.origin,d=new B(p,e);function s(){let t=document.querySelector(a);if(!t){console.error(`[MDB Reviews] Container "${a}" not found`);return}let i=document.createElement("style");i.textContent=q,t.appendChild(i);let f=document.createElement("div");f.className="rw-loading",f.textContent="Loading reviews...",t.appendChild(f),Promise.all([d.fetchConfig(),d.fetchReviews(1)]).then(([m,l])=>{f.remove();let u=m.widget;t.style.setProperty("--rw-primary",u.primaryColor),t.style.setProperty("--rw-bg",u.backgroundColor),t.style.setProperty("--rw-text",u.textColor);let b=document.createElement("div");b.className="rw-container";let w={currentPage:l.page,totalPages:l.totalPages,reviews:l.reviews};l.stats.totalReviews>0&&b.appendChild(F(l.stats));let y=document.createElement("div");if(y.className="rw-list",v(y,w.reviews,u.showMedia),b.appendChild(y),l.stats.totalReviews===0){let C=document.createElement("div");C.className="rw-empty",C.textContent="No reviews yet. Be the first!",b.appendChild(C)}if(w.totalPages>1){let C=c(w,y,u.showMedia);b.appendChild(C)}if(u.showReviewForm){let C=K(d,()=>{d.fetchReviews(1).then(x=>{w.currentPage=1,w.totalPages=x.totalPages,w.reviews=x.reviews,v(y,w.reviews,u.showMedia)})});b.appendChild(C)}t.appendChild(b)},m=>{f.textContent="Could not load reviews.",console.error("[MDB Reviews]",m)})}function v(t,i,f){t.innerHTML="";for(let m of i)t.appendChild(_(m,f,(l,u)=>W(l,u)))}function c(t,i,f){let m=document.createElement("div");m.className="rw-pagination";let l=document.createElement("button");l.className="rw-btn",l.textContent="\u2190 Previous";let u=document.createElement("span");u.className="rw-page-info";let b=document.createElement("button");b.className="rw-btn",b.textContent="Next \u2192";function w(){u.textContent=`Page ${t.currentPage} of ${t.totalPages}`,l.disabled=t.currentPage<=1,b.disabled=t.currentPage>=t.totalPages}async function y(C){l.disabled=!0,b.disabled=!0,u.textContent="Loading...";try{let x=await d.fetchReviews(C);t.currentPage=x.page,t.totalPages=x.totalPages,t.reviews=x.reviews,v(i,t.reviews,f),i.scrollIntoView({behavior:"smooth",block:"start"})}catch(x){console.error("[MDB Reviews]",x)}w()}return l.addEventListener("click",()=>{t.currentPage>1&&y(t.currentPage-1)}),b.addEventListener("click",()=>{t.currentPage<t.totalPages&&y(t.currentPage+1)}),m.appendChild(l),m.appendChild(u),m.appendChild(b),w(),m}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",s):s()})();})();
