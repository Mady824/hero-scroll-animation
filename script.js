gsap.registerPlugin(ScrollTrigger);

const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
introTl
  .from(".headline-char", {
    y: 32,
    opacity: 0,
    duration: 0.75,
    stagger: 0.035
  })
  .from(
    ".reveal",
    {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12
    },
    "-=0.4"
  )
  .from(
    ".metric-card",
    {
      y: 18,
      opacity: 0,
      duration: 0.52,
      stagger: 0.12
    },
    "-=0.32"
  );

const slides = gsap.utils.toArray(".hero-slide");
const heroName = document.querySelector(".hero-name");
const heroDetail = document.querySelector("#hero-detail");
const heroTags = document.querySelector("#hero-tags");
const heroContext = document.querySelector("#hero-context");
const powerStat = document.querySelector("#power-stat");
const modeStat = document.querySelector("#mode-stat");
const rankStat = document.querySelector("#rank-stat");
const progressFill = document.querySelector(".progress-fill");

const heroData = [
  {
    name: "IRON MAN",
    power: "95%",
    mode: "TECH",
    rank: "01",
    context: "Avengers systems architect and frontline tech striker.",
    detail: "Genius inventor in an adaptive armor suit built for precision combat.",
    tags: ["Arc Reactor", "Flight", "AI Targeting"]
  },
  {
    name: "SPIDER-MAN",
    power: "93%",
    mode: "AGILE",
    rank: "02",
    context: "Rapid-response urban defender with unmatched mobility.",
    detail: "Fast-reacting street-level hero with acrobatic control and web-based mobility.",
    tags: ["Spider-Sense", "Web Swing", "Acrobatics"]
  },
  {
    name: "THOR",
    power: "99%",
    mode: "THUNDER",
    rank: "03",
    context: "High-impact battlefield breaker for large-scale threats.",
    detail: "Asgardian warrior channeling lightning with unmatched strength and battlefield presence.",
    tags: ["Mjolnir", "Lightning", "God Strength"]
  },
  {
    name: "CAPTAIN AMERICA",
    power: "92%",
    mode: "TACTICAL",
    rank: "04",
    context: "Squad commander focused on strategy and coordinated execution.",
    detail: "A battlefield leader whose discipline, strategy, and resilience unify the team under pressure.",
    tags: ["Vibranium Shield", "Leadership", "Combat Mastery"]
  },
  {
    name: "HULK",
    power: "98%",
    mode: "SMASH",
    rank: "05",
    context: "Extreme-force asset used to break fortified opposition.",
    detail: "Raw strength and durability at extreme levels, capable of shifting the momentum of any fight.",
    tags: ["Gamma Power", "Durability", "Shockwave Strikes"]
  },
  {
    name: "BLACK WIDOW",
    power: "90%",
    mode: "STEALTH",
    rank: "06",
    context: "Covert operations specialist for infiltration and extraction.",
    detail: "Elite spy and close-combat specialist, trusted for precision execution in high-risk missions.",
    tags: ["Espionage", "Widow's Bite", "Agile Combat"]
  },
  {
    name: "BLACK PANTHER",
    power: "96%",
    mode: "VIBRANIUM",
    rank: "07",
    context: "Wakandan guardian balancing advanced tech with elite combat.",
    detail: "Wakanda's king and protector, blending advanced tech with speed, strategy, and precision strikes.",
    tags: ["Vibranium Suit", "Panther Agility", "Wakandan Tech"]
  }
];

function setHeroInfo(index) {
  const item = heroData[index];
  if (!item) return;
  if (heroName) heroName.textContent = item.name;
  if (heroContext) heroContext.textContent = item.context;
  if (heroDetail) heroDetail.textContent = item.detail;
  if (heroTags) {
    heroTags.innerHTML = item.tags.map((tag) => `<span class="hero-tag">${tag}</span>`).join("");
  }
  if (powerStat) powerStat.textContent = item.power;
  if (modeStat) modeStat.textContent = item.mode;
  if (rankStat) rankStat.textContent = item.rank;
}

let activeHeroIndex = -1;
function syncUiFromProgress(progress) {
  const segmentCount = Math.max(1, slides.length - 1);
  const scaled = progress * segmentCount;
  const baseIndex = Math.floor(scaled);
  const blend = scaled - baseIndex;
  const nextIndex = Math.min(heroData.length - 1, Math.round(scaled));

  slides.forEach((slide, index) => {
    let alpha = 0;
    if (index === baseIndex) alpha = 1 - blend;
    if (index === baseIndex + 1) alpha = blend;
    if (segmentCount === 1 && index === 0) alpha = 1 - blend;
    if (segmentCount === 1 && index === 1) alpha = blend;
    gsap.set(slide, {
      autoAlpha: Math.max(0, Math.min(1, alpha)),
      scale: alpha > 0.01 ? 1 : 1.08
    });
  });

  if (nextIndex !== activeHeroIndex) {
    activeHeroIndex = nextIndex;
    setHeroInfo(nextIndex);
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === nextIndex);
    });
  }

  if (progressFill) {
    progressFill.style.width = `${(progress * 100).toFixed(2)}%`;
  }
}

setHeroInfo(0);
if (progressFill) progressFill.style.width = "0%";
syncUiFromProgress(0);

slides.forEach((slide, index) => gsap.set(slide, { autoAlpha: index === 0 ? 1 : 0, scale: index === 0 ? 1 : 1.08 }));

const masterTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-stage",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.6,
    invalidateOnRefresh: true,
    onUpdate: (self) => syncUiFromProgress(self.progress)
  }
});

const transitionCount = Math.max(1, slides.length - 1);
const timelineSpan = transitionCount + 1;

masterTl
  .to(".hero-content", { yPercent: -16, duration: timelineSpan, ease: "none" }, 0)
  .to(".headline", { yPercent: -18, opacity: 0.58, duration: timelineSpan, ease: "none" }, 0)
  .to(".metrics", { yPercent: -10, duration: timelineSpan, ease: "none" }, 0);
