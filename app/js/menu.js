// This file is part of ThinkChat which is released under the MIT license.
// See file LICENSE or go to https://github.com/RobinBoers/thinkchat/blob/main/LICENSE 
// for full license details.

let root = document.documentElement;

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("chatform").style.left = "250px";
    root.style.setProperty('--page-width', "95%");
}
  
/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("chatform").style.left = "0";
    root.style.setProperty('--page-width', "80%");
} 

window.addEventListener("resize", () => {reload()}); 