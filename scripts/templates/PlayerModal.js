
export function lightbox () {
    
    const lightboxWrapper = document.querySelector(".lightbox_modal");
    lightboxWrapper.innerHTML = '';
    const lightboxTemplate = `
           <div class="player">
               <iframe
                   height="600"
                   width="800"
                   src=${this.media.image}
               ></iframe>
               <img src="assets/icons/close.svg" aria-label="close lighbox windows" onclick="closelightbox()"  />
           </div>`


           lightboxWrapper .insertAdjacentHTML('beforeend', lightboxTemplate);

        }