const setting = localStorage.getItem("darkMode")
if (setting === "true") {
    // document.getElementById('darkLightModeCheckbox')
    console.log("DarkMode")
    
} else if (setting === "false") {
    console.log("LightMode")
    document.getElementById('darkLightModeCheckbox').checked = true
}