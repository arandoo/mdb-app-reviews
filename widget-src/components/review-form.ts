import { WidgetAPI } from "../api";
import { createStarInput } from "./stars";

export function createReviewForm(
  api: WidgetAPI,
  onSubmitted: () => void
): HTMLElement {
  const section = document.createElement("div");
  section.className = "rw-form-section";

  const title = document.createElement("div");
  title.className = "rw-form-title";
  title.textContent = "Write a Review";
  section.appendChild(title);

  // Error / success messages
  const msgEl = document.createElement("div");
  msgEl.style.display = "none";
  section.appendChild(msgEl);

  function showMsg(text: string, type: "error" | "success") {
    msgEl.className = type === "error" ? "rw-form-error" : "rw-form-success";
    msgEl.textContent = text;
    msgEl.style.display = "block";
  }

  function hideMsg() {
    msgEl.style.display = "none";
  }

  // Rating
  const ratingGroup = document.createElement("div");
  ratingGroup.className = "rw-form-group";
  const ratingLabel = document.createElement("label");
  ratingLabel.className = "rw-form-label";
  ratingLabel.textContent = "Rating *";
  ratingGroup.appendChild(ratingLabel);

  let selectedRating = 0;
  const starInput = createStarInput((r) => {
    selectedRating = r;
  });
  ratingGroup.appendChild(starInput.element);
  section.appendChild(ratingGroup);

  // Name & Email row
  const row = document.createElement("div");
  row.className = "rw-form-row";

  const nameGroup = document.createElement("div");
  nameGroup.className = "rw-form-group";
  const nameLabel = document.createElement("label");
  nameLabel.className = "rw-form-label";
  nameLabel.textContent = "Name *";
  const nameInput = document.createElement("input");
  nameInput.className = "rw-form-input";
  nameInput.type = "text";
  nameInput.placeholder = "Your name";
  nameInput.required = true;
  nameInput.maxLength = 100;
  nameGroup.appendChild(nameLabel);
  nameGroup.appendChild(nameInput);
  row.appendChild(nameGroup);

  const emailGroup = document.createElement("div");
  emailGroup.className = "rw-form-group";
  const emailLabel = document.createElement("label");
  emailLabel.className = "rw-form-label";
  emailLabel.textContent = "Email *";
  const emailInput = document.createElement("input");
  emailInput.className = "rw-form-input";
  emailInput.type = "email";
  emailInput.placeholder = "your@email.com";
  emailInput.required = true;
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);
  row.appendChild(emailGroup);

  section.appendChild(row);

  // Title
  const titleGroup = document.createElement("div");
  titleGroup.className = "rw-form-group";
  const titleLabel = document.createElement("label");
  titleLabel.className = "rw-form-label";
  titleLabel.textContent = "Title *";
  const titleInput = document.createElement("input");
  titleInput.className = "rw-form-input";
  titleInput.type = "text";
  titleInput.placeholder = "Brief summary";
  titleInput.required = true;
  titleInput.maxLength = 200;
  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);
  section.appendChild(titleGroup);

  // Body
  const bodyGroup = document.createElement("div");
  bodyGroup.className = "rw-form-group";
  const bodyLabel = document.createElement("label");
  bodyLabel.className = "rw-form-label";
  bodyLabel.textContent = "Your Review *";
  const bodyInput = document.createElement("textarea");
  bodyInput.className = "rw-form-textarea";
  bodyInput.placeholder = "Share your experience...";
  bodyInput.required = true;
  bodyInput.maxLength = 5000;
  bodyGroup.appendChild(bodyLabel);
  bodyGroup.appendChild(bodyInput);
  section.appendChild(bodyGroup);

  // Media upload area
  const uploadGroup = document.createElement("div");
  uploadGroup.className = "rw-form-group";
  const uploadLabel = document.createElement("label");
  uploadLabel.className = "rw-form-label";
  uploadLabel.textContent = "Photos (optional)";
  uploadGroup.appendChild(uploadLabel);

  const uploadArea = document.createElement("div");
  uploadArea.className = "rw-form-upload-area";
  uploadGroup.appendChild(uploadArea);
  section.appendChild(uploadGroup);

  interface UploadedFile {
    type: "image" | "video";
    url: string;
    publicId: string;
    thumbnailUrl?: string;
  }
  const uploadedFiles: UploadedFile[] = [];

  function renderUploads() {
    uploadArea.innerHTML = "";

    for (let i = 0; i < uploadedFiles.length; i++) {
      const preview = document.createElement("div");
      preview.className = "rw-form-upload-preview";
      const img = document.createElement("img");
      img.src = uploadedFiles[i].thumbnailUrl || uploadedFiles[i].url;
      img.alt = "Upload";
      preview.appendChild(img);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "rw-form-upload-remove";
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => {
        uploadedFiles.splice(i, 1);
        renderUploads();
      });
      preview.appendChild(removeBtn);

      uploadArea.appendChild(preview);
    }

    if (uploadedFiles.length < 5) {
      const addBtn = document.createElement("label");
      addBtn.className = "rw-form-upload-btn";
      addBtn.innerHTML = "<span>+</span><span>Photo</span>";

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";
      fileInput.addEventListener("change", async () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
          showMsg("File too large (max 10MB)", "error");
          return;
        }

        addBtn.innerHTML = "<span>...</span>";

        try {
          const signData = await api.getUploadSignature();
          const formData = new FormData();
          formData.append("file", file);
          formData.append("api_key", signData.apiKey);
          formData.append("timestamp", String(signData.timestamp));
          formData.append("signature", signData.signature);
          formData.append("folder", signData.folder);

          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
            { method: "POST", body: formData }
          );
          const uploadData = await uploadRes.json();

          if (uploadData.secure_url) {
            uploadedFiles.push({
              type: "image",
              url: uploadData.secure_url,
              publicId: uploadData.public_id,
              thumbnailUrl: uploadData.secure_url.replace(
                "/upload/",
                "/upload/w_200,h_200,c_fill/"
              ),
            });
          }
        } catch {
          showMsg("Upload failed", "error");
        }

        renderUploads();
      });

      addBtn.appendChild(fileInput);
      uploadArea.appendChild(addBtn);
    }
  }

  renderUploads();

  // Submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "button";
  submitBtn.className = "rw-btn rw-btn-primary";
  submitBtn.style.width = "100%";
  submitBtn.style.marginTop = "8px";
  submitBtn.textContent = "Submit Review";

  submitBtn.addEventListener("click", async () => {
    hideMsg();

    if (selectedRating === 0) {
      showMsg("Please select a rating.", "error");
      return;
    }
    if (!nameInput.value.trim()) {
      showMsg("Please enter your name.", "error");
      return;
    }
    if (!emailInput.value.trim()) {
      showMsg("Please enter your email.", "error");
      return;
    }
    if (!titleInput.value.trim()) {
      showMsg("Please enter a title.", "error");
      return;
    }
    if (!bodyInput.value.trim()) {
      showMsg("Please write your review.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const result = await api.submitReview({
        customerName: nameInput.value.trim(),
        customerEmail: emailInput.value.trim(),
        rating: selectedRating,
        title: titleInput.value.trim(),
        body: bodyInput.value.trim(),
        media: uploadedFiles,
      });

      if (result.success) {
        showMsg("Thank you! Your review will be published after approval.", "success");
        nameInput.value = "";
        emailInput.value = "";
        titleInput.value = "";
        bodyInput.value = "";
        selectedRating = 0;
        uploadedFiles.length = 0;
        renderUploads();
        // Rebuild star input
        const newStarInput = createStarInput((r) => {
          selectedRating = r;
        });
        ratingGroup.replaceChild(newStarInput.element, ratingGroup.lastElementChild!);
        onSubmitted();
      } else {
        showMsg(result.error || "Error submitting review.", "error");
      }
    } catch {
      showMsg("Network error. Please try again.", "error");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Review";
  });

  section.appendChild(submitBtn);

  return section;
}
