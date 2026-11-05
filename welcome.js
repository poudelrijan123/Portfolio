'use strict';
const yearNode = document.getElementById('welcomeYear');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());
