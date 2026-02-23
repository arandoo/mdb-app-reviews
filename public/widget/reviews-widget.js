"use strict";var ReviewsWidget=(()=>{var D=class{constructor(o,e){this.baseUrl=o,this.apiKey=e}async fetchReviews(o=1,e){let a=new URLSearchParams({apiKey:this.apiKey,page:String(o)});e&&a.set("limit",String(e));let r=await fetch(`${this.baseUrl}/api/widget/reviews?${a}`);if(!r.ok)throw new Error("Failed to load reviews");return r.json()}async fetchConfig(){let o=await fetch(`${this.baseUrl}/api/widget/config?apiKey=${this.apiKey}`);if(!o.ok)throw new Error("Failed to load config");return o.json()}async submitReview(o){return(await fetch(`${this.baseUrl}/api/reviews`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json()}async getUploadSignature(){return(await fetch(`${this.baseUrl}/api/upload/sign`,{method:"POST"})).json()}};var j='<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>';function B(n,o=""){let e=document.createElement("div");e.className=`rw-stars ${o}`;for(let a=1;a<=5;a++){let r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("viewBox","0 0 20 20"),r.setAttribute("class",`rw-star ${a<=n?"rw-star-filled":""}`),r.innerHTML=j,e.appendChild(r)}return e}function A(n,o=0){let e=o,a=document.createElement("div");a.className="rw-stars rw-stars-input";function r(p=0){a.innerHTML="";for(let c=1;c<=5;c++){let d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("viewBox","0 0 20 20"),d.setAttribute("class",`rw-star ${c<=(p||e)?"rw-star-filled":""}`),d.innerHTML=j,d.style.cursor="pointer",d.addEventListener("mouseenter",()=>r(c)),d.addEventListener("click",()=>{e=c,n(c),r()}),a.appendChild(d)}}return a.addEventListener("mouseleave",()=>r()),r(),{element:a,getValue:()=>e}}function F(n){let o=document.createElement("div");o.className="rw-summary";let e=document.createElement("div");e.className="rw-summary-avg";let a=document.createElement("div");a.className="rw-summary-number",a.textContent=n.averageRating>0?n.averageRating.toFixed(1):"\u2014",e.appendChild(a),e.appendChild(B(Math.round(n.averageRating),"rw-stars-lg"));let r=document.createElement("div");r.className="rw-summary-count",r.textContent=`${n.totalReviews} Review${n.totalReviews!==1?"s":""}`,e.appendChild(r),o.appendChild(e);let p=document.createElement("div");p.className="rw-summary-bars";for(let c=5;c>=1;c--){let d=n.distribution[c]||0,v=n.totalReviews>0?d/n.totalReviews*100:0,x=document.createElement("div");x.className="rw-bar-row";let t=document.createElement("span");t.className="rw-bar-label",t.textContent=`${c} \u2605`;let l=document.createElement("div");l.className="rw-bar-track";let i=document.createElement("div");i.className="rw-bar-fill",i.style.width=`${v}%`,l.appendChild(i);let m=document.createElement("span");m.className="rw-bar-count",m.textContent=String(d),x.appendChild(t),x.appendChild(l),x.appendChild(m),p.appendChild(x)}return o.appendChild(p),o}function _(n,o,e){let a=document.createElement("div");a.className="rw-card";let r=document.createElement("div");r.className="rw-card-header";let p=document.createElement("div");p.appendChild(B(n.rating));let c=document.createElement("span");c.className="rw-card-author",c.textContent=` ${n.customerName}`,p.appendChild(c),r.appendChild(p);let d=document.createElement("span");d.className="rw-card-date",d.textContent=new Date(n.createdAt).toLocaleDateString("en-US"),r.appendChild(d),a.appendChild(r);let v=document.createElement("div");v.className="rw-card-title",v.textContent=n.title,a.appendChild(v);let x=document.createElement("div");if(x.className="rw-card-body",x.textContent=n.body,a.appendChild(x),o&&n.media&&n.media.length>0){let t=document.createElement("div");t.className="rw-card-media";for(let l of n.media)if(l.type==="image"){let i=document.createElement("img");i.src=l.thumbnailUrl||l.url,i.alt="Review photo",i.addEventListener("click",()=>e(l.url,"image")),t.appendChild(i)}else{let i=document.createElement("video");i.src=l.url,i.setAttribute("preload","metadata"),i.addEventListener("click",()=>e(l.url,"video")),t.appendChild(i)}a.appendChild(t)}if(n.adminReply){let t=document.createElement("div");t.className="rw-card-reply";let l=document.createElement("div");l.className="rw-card-reply-label",l.textContent="Response from the team";let i=document.createElement("div");i.className="rw-card-reply-text",i.textContent=n.adminReply,t.appendChild(l),t.appendChild(i),a.appendChild(t)}return a}function K(n,o){let e=document.createElement("div");e.className="rw-form-section";let a=document.createElement("div");a.className="rw-form-title",a.textContent="Write a Review",e.appendChild(a);let r=document.createElement("div");r.style.display="none",e.appendChild(r);function p(g,h){r.className=h==="error"?"rw-form-error":"rw-form-success",r.textContent=g,r.style.display="block"}function c(){r.style.display="none"}let d=document.createElement("div");d.className="rw-form-group";let v=document.createElement("label");v.className="rw-form-label",v.textContent="Rating *",d.appendChild(v);let x=0,t=A(g=>{x=g});d.appendChild(t.element),e.appendChild(d);let l=document.createElement("div");l.className="rw-form-row";let i=document.createElement("div");i.className="rw-form-group";let m=document.createElement("label");m.className="rw-form-label",m.textContent="Name *";let s=document.createElement("input");s.className="rw-form-input",s.type="text",s.placeholder="Your name",s.required=!0,s.maxLength=100,i.appendChild(m),i.appendChild(s),l.appendChild(i);let u=document.createElement("div");u.className="rw-form-group";let f=document.createElement("label");f.className="rw-form-label",f.textContent="Email *";let w=document.createElement("input");w.className="rw-form-input",w.type="email",w.placeholder="your@email.com",w.required=!0,u.appendChild(f),u.appendChild(w),l.appendChild(u),e.appendChild(l);let y=document.createElement("div");y.className="rw-form-group";let C=document.createElement("label");C.className="rw-form-label",C.textContent="Title *";let b=document.createElement("input");b.className="rw-form-input",b.type="text",b.placeholder="Brief summary",b.required=!0,b.maxLength=200,y.appendChild(C),y.appendChild(b),e.appendChild(y);let T=document.createElement("div");T.className="rw-form-group";let $=document.createElement("label");$.className="rw-form-label",$.textContent="Your Review *";let R=document.createElement("textarea");R.className="rw-form-textarea",R.placeholder="Share your experience...",R.required=!0,R.maxLength=5e3,T.appendChild($),T.appendChild(R),e.appendChild(T);let z=document.createElement("div");z.className="rw-form-group";let I=document.createElement("label");I.className="rw-form-label",I.textContent="Photos (optional)",z.appendChild(I);let M=document.createElement("div");M.className="rw-form-upload-area",z.appendChild(M),e.appendChild(z);let L=[];function U(){M.innerHTML="";for(let g=0;g<L.length;g++){let h=document.createElement("div");h.className="rw-form-upload-preview";let N=document.createElement("img");N.src=L[g].thumbnailUrl||L[g].url,N.alt="Upload",h.appendChild(N);let P=document.createElement("button");P.type="button",P.className="rw-form-upload-remove",P.textContent="\xD7",P.addEventListener("click",()=>{L.splice(g,1),U()}),h.appendChild(P),M.appendChild(h)}if(L.length<5){let g=document.createElement("label");g.className="rw-form-upload-btn",g.innerHTML="<span>+</span><span>Photo</span>";let h=document.createElement("input");h.type="file",h.accept="image/*",h.style.display="none",h.addEventListener("change",async()=>{var P;let N=(P=h.files)==null?void 0:P[0];if(N){if(N.size>10*1024*1024){p("File too large (max 10MB)","error");return}g.innerHTML="<span>...</span>";try{let S=await n.getUploadSignature(),k=new FormData;k.append("file",N),k.append("api_key",S.apiKey),k.append("timestamp",String(S.timestamp)),k.append("signature",S.signature),k.append("folder",S.folder);let H=await(await fetch(`https://api.cloudinary.com/v1_1/${S.cloudName}/image/upload`,{method:"POST",body:k})).json();H.secure_url&&L.push({type:"image",url:H.secure_url,publicId:H.public_id,thumbnailUrl:H.secure_url.replace("/upload/","/upload/w_200,h_200,c_fill/")})}catch(S){p("Upload failed","error")}U()}}),g.appendChild(h),M.appendChild(g)}}U();let E=document.createElement("button");return E.type="button",E.className="rw-btn rw-btn-primary",E.style.width="100%",E.style.marginTop="8px",E.textContent="Submit Review",E.addEventListener("click",async()=>{if(c(),x===0){p("Please select a rating.","error");return}if(!s.value.trim()){p("Please enter your name.","error");return}if(!w.value.trim()){p("Please enter your email.","error");return}if(!b.value.trim()){p("Please enter a title.","error");return}if(!R.value.trim()){p("Please write your review.","error");return}E.disabled=!0,E.textContent="Submitting...";try{let g=await n.submitReview({customerName:s.value.trim(),customerEmail:w.value.trim(),rating:x,title:b.value.trim(),body:R.value.trim(),media:L});if(g.success){p("Thank you! Your review will be published after approval.","success"),s.value="",w.value="",b.value="",R.value="",x=0,L.length=0,U();let h=A(N=>{x=N});d.replaceChild(h.element,d.lastElementChild),o()}else p(g.error||"Error submitting review.","error")}catch(g){p("Network error. Please try again.","error")}E.disabled=!1,E.textContent="Submit Review"}),e.appendChild(E),e}function W(n,o){let e=document.createElement("div");e.className="rw-lightbox";let a=document.createElement("button");if(a.className="rw-lightbox-close",a.textContent="\u2715",a.addEventListener("click",()=>e.remove()),e.appendChild(a),o==="video"){let r=document.createElement("video");r.src=n,r.controls=!0,r.autoplay=!0,e.appendChild(r)}else{let r=document.createElement("img");r.src=n,r.alt="Review media",e.appendChild(r)}e.addEventListener("click",r=>{r.target===e&&e.remove()}),document.body.appendChild(e)}var q=`/* MDB Reviews Widget \u2014 all classes prefixed with rw- */
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
`;(function(){let n=document.querySelectorAll("script[data-api-key]"),o=null;for(let t of n)if(t.src.includes("reviews-widget")){o=t;break}if(o||(o=document.currentScript),!o){console.error("[MDB Reviews] Script tag not found");return}let e=o.getAttribute("data-api-key"),a=o.getAttribute("data-target")||"#reviews-widget";if(!e){console.error("[MDB Reviews] data-api-key attribute is required");return}let r=o.src,p=r?new URL(r).origin:window.location.origin,c=new D(p,e);function d(){let t=document.querySelector(a);if(!t){console.error(`[MDB Reviews] Container "${a}" not found`);return}let l=document.createElement("style");l.textContent=q,t.appendChild(l);let i=document.createElement("div");i.className="rw-loading",i.textContent="Loading reviews...",t.appendChild(i),Promise.all([c.fetchConfig(),c.fetchReviews(1)]).then(([m,s])=>{i.remove();let u=m.widget;t.style.setProperty("--rw-primary",u.primaryColor),t.style.setProperty("--rw-bg",u.backgroundColor),t.style.setProperty("--rw-text",u.textColor);let f=document.createElement("div");f.className="rw-container";let w={currentPage:s.page,totalPages:s.totalPages,reviews:s.reviews};s.stats.totalReviews>0&&f.appendChild(F(s.stats));let y=document.createElement("div");if(y.className="rw-list",v(y,w.reviews,u.showMedia),f.appendChild(y),s.stats.totalReviews===0){let C=document.createElement("div");C.className="rw-empty",C.textContent="No reviews yet. Be the first!",f.appendChild(C)}if(w.totalPages>1){let C=x(w,y,u.showMedia);f.appendChild(C)}if(u.showReviewForm){let C=K(c,()=>{c.fetchReviews(1).then(b=>{w.currentPage=1,w.totalPages=b.totalPages,w.reviews=b.reviews,v(y,w.reviews,u.showMedia)})});f.appendChild(C)}t.appendChild(f)},m=>{i.textContent="Could not load reviews.",console.error("[MDB Reviews]",m)})}function v(t,l,i){t.innerHTML="";for(let m of l)t.appendChild(_(m,i,(s,u)=>W(s,u)))}function x(t,l,i){let m=document.createElement("div");m.className="rw-pagination";let s=document.createElement("button");s.className="rw-btn",s.textContent="\u2190 Previous";let u=document.createElement("span");u.className="rw-page-info";let f=document.createElement("button");f.className="rw-btn",f.textContent="Next \u2192";function w(){u.textContent=`Page ${t.currentPage} of ${t.totalPages}`,s.disabled=t.currentPage<=1,f.disabled=t.currentPage>=t.totalPages}async function y(C){s.disabled=!0,f.disabled=!0,u.textContent="Loading...";try{let b=await c.fetchReviews(C);t.currentPage=b.page,t.totalPages=b.totalPages,t.reviews=b.reviews,v(l,t.reviews,i),l.scrollIntoView({behavior:"smooth",block:"start"})}catch(b){console.error("[MDB Reviews]",b)}w()}return s.addEventListener("click",()=>{t.currentPage>1&&y(t.currentPage-1)}),f.addEventListener("click",()=>{t.currentPage<t.totalPages&&y(t.currentPage+1)}),m.appendChild(s),m.appendChild(u),m.appendChild(f),w(),m}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d()})();})();
