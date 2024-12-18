const cards = document.querySelector(".features-heading");
const featureSection = document.querySelector(".features-container");
const feature1 = document.querySelector(".feature1-card");
const feature2 = document.querySelector(".feature2-card");
const feature3 = document.querySelector(".feature3-card");

const observerCards = new IntersectionObserver(entry => {
    cards.classList.toggle("show", entry.isIntersecting);
}, {
    threshold: 0.2
});

const observerFeatures = new IntersectionObserver(entry => {
    feature1.classList.toggle("show", entry.isIntersecting);
    feature2.classList.toggle("show", entry.isIntersecting);
    feature3.classList.toggle("show", entry.isIntersecting);
}, {
    threshold: 0.7
});


observerCards.observe(featureSection);
observerFeatures.observe(featureSection);