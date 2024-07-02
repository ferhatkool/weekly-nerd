document.getElementById('darkLightModeCheckbox').addEventListener('click', function() {
    const checkbox = this;
    checkbox.disabled = true;  
    if (checkbox.checked) {
        console.log("Checked!")
        localStorage.setItem("darkMode", "false")
    } else if (!checkbox.checked) {
        console.log("Not checked!")
        localStorage.setItem("darkMode", "true")
    }
    setTimeout(() => {
      checkbox.disabled = false;  
    }, 500);  
  });