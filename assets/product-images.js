document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('variant:changed', (event) => {
    const productImagesContainer = document.querySelector('[id^="product-images-"][data-section-id]');
    if (!productImagesContainer) {
      console.error('Product images container not found.');
      return;
    }

    const sectionId = productImagesContainer.getAttribute('data-section-id');
    const url = new URL(window.location);

    // Set the correct section ID
    url.searchParams.set('section_id', sectionId);

    const urlString = url.toString();

    // Debugging info
    console.log('Fetching section with URL:', urlString);

    fetchProductImages(urlString, sectionId);
  });

  async function fetchProductImages(urlString, sectionId) {
    try {
      let response = await fetch(urlString);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      // Parse the response to extract the section HTML
      let text = await response.text();
      let newHtml = new DOMParser()
        .parseFromString(text, 'text/html')
        .querySelector(`#product-images-${sectionId}-container`); // Adjust the selector as needed

      // Update the section with the new HTML
      let productImageBlock = document.querySelector(`#product-images-${sectionId}-container`); // Target the container you want to update

      if (productImageBlock && newHtml) {
        productImageBlock.innerHTML = newHtml.innerHTML; // Only replace the inner content
      } else {
        console.error('Product image section not found or new HTML is missing');
      }
    } catch (error) {
      console.error('Error fetching product images:', error);
    }
  }
});