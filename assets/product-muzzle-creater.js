document.addEventListener("DOMContentLoaded", () => {
  const muzzleStartBtn = document.querySelector('[data-muzzle-start-btn]');
  const muzzleCategories = document.querySelectorAll('[data-muzzle-category]');
  const muzzleTemplates = document.querySelectorAll('[data-muzzle-templates]');
  const productFormInputs = document.querySelector('[data-type="add-to-cart-form-inputs"]');
  const dataForm = document.querySelector('[data-info-form]');
  const productForm = document.querySelector('product-form');
  const submitForm = document.querySelector('[data-submit-form]');

  if (!dataForm) {
    console.warn("Data form not found");
    return;
  }

  // Ensure variantId exists before using it
  const variantInput = document.querySelector('input.product-variant-id');
  const variantId = variantInput ? variantInput.value : null;

  if (!variantId) {
    console.warn("Variant ID not found");
    return;
  }

  // Helper function to create or update a hidden input
  const createHiddenInput = (type, value) => {
    if (!productFormInputs) return;

    const existingInput = productFormInputs.querySelector(`input[name="properties[${type}]"]`);
    if (existingInput) {
      existingInput.value = value;
    } else {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `properties[${type}]`;
      input.value = value;
      productFormInputs.appendChild(input);
    }
  };

  // Function to handle user input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    createHiddenInput(name, value);
  };

  // Step 1: Show categories when the start button is clicked
  muzzleStartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    muzzleCategories.forEach(muzzleCategory => muzzleCategory.removeAttribute('hidden'));
    muzzleStartBtn.setAttribute('hidden', true);
  });

  // Step 2: Handle category selection to show templates
  muzzleCategories.forEach(muzzleCategory => {
    const muzzleCategorySelector = muzzleCategory.querySelector('[data-muzzle-templates-selector]');

    if (muzzleCategorySelector) {
      muzzleCategorySelector.addEventListener('click', () => {
        const selectedCategory = muzzleCategorySelector.getAttribute('data-muzzle-templates-selector');

        // Step 3: Create or update the hidden input for selected category
        createHiddenInput(`muzzle-category`, selectedCategory);

        // Hide only unselected categories
        muzzleCategories.forEach(category => {
          category.hidden = true;
        });

        // Hide all templates before showing the correct one
        muzzleTemplates.forEach(muzzleTemplate => muzzleTemplate.hidden = true);

        // Show the matching template
        const matchingTemplate = document.querySelector(`[data-muzzle-templates="${selectedCategory}"]`);
        if (matchingTemplate) {
          matchingTemplate.removeAttribute('hidden');

          const matchingTemplateInputs = matchingTemplate.querySelectorAll('[data-muzzle-template-selector]');

          matchingTemplateInputs.forEach(matchingTemplateInput => {
            matchingTemplateInput.removeEventListener('click', handleTemplateSelection);
            matchingTemplateInput.addEventListener('click', handleTemplateSelection);
          });

          function handleTemplateSelection(event) {
            const selectedTemplate = event.target.getAttribute('data-muzzle-template-selector');
            createHiddenInput(`muzzle-template`, selectedTemplate);
            event.target.closest('[data-muzzle-templates]').setAttribute('hidden', true);
            dataForm.removeAttribute('hidden');
          }
        }
      });
    }
  });

  // Step 4: Handle input fields and create hidden inputs dynamically
  const inputFields = dataForm.querySelectorAll('input[name=first-name], input[name=last-name], input[name=recipient-first-name], input[name=recipient-last-name]');

  inputFields.forEach(inputField => {
    inputField.addEventListener('input', handleInputChange);
  });

  submitForm.addEventListener('click', () => {
    dataForm.setAttribute('hidden', true);
    productForm.style.display = 'block';
  })
});
