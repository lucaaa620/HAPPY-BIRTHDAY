const container =
  document.getElementById("scene-container");


/* =========================================
   THREE.JS SETUP
========================================= */

const scene = new THREE.Scene();

const camera =
  new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

camera.position.set(
  0,
  0,
  3.2
);


const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });


renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.outputColorSpace =
  THREE.SRGBColorSpace;


container.appendChild(
  renderer.domElement
);


/* =========================================
   STAR FIELD
========================================= */

const starGeometry =
  new THREE.BufferGeometry();

const STAR_COUNT = 2500;

const starPositions =
  new Float32Array(
    STAR_COUNT * 3
  );


for (
  let i = 0;
  i < STAR_COUNT * 3;
  i++
) {

  starPositions[i] =
    (Math.random() - 0.5) * 180;

}


starGeometry.setAttribute(
  "position",

  new THREE.BufferAttribute(
    starPositions,
    3
  )
);


const starMaterial =
  new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.045,

    transparent: true,

    opacity: 0

  });


const stars =
  new THREE.Points(
    starGeometry,
    starMaterial
  );


scene.add(stars);


/* =========================================
   LIGHTING
========================================= */

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.18
  );

scene.add(
  ambientLight
);


const sunLight =
  new THREE.DirectionalLight(
    0xffffff,
    2.8
  );

sunLight.position.set(
  5,
  2,
  5
);

scene.add(
  sunLight
);


/* =========================================
   EARTH
========================================= */

const EARTH_RADIUS = 1;


const earthGeometry =
  new THREE.SphereGeometry(
    EARTH_RADIUS,
    128,
    128
  );


/*
  FINAL FILE WILL LIVE IN:

  assets/earth/earth-day.jpg
*/

const textureLoader =
  new THREE.TextureLoader();


const earthTexture =
  textureLoader.load(
    "assets/earth/earth-day.jpg"
  );


earthTexture.colorSpace =
  THREE.SRGBColorSpace;


const earthMaterial =
  new THREE.MeshPhongMaterial({

    map: earthTexture,

    shininess: 18,

    specular: new THREE.Color(
      0x222222
    )

  });


const earth =
  new THREE.Mesh(
    earthGeometry,
    earthMaterial
  );


earth.visible = false;

scene.add(
  earth
);


/* =========================================
   CLOUD LAYER
========================================= */

const cloudGeometry =
  new THREE.SphereGeometry(
    1.012,
    128,
    128
  );


const cloudTexture =
  textureLoader.load(
    "assets/earth/earth-clouds.png"
  );


const cloudMaterial =
  new THREE.MeshPhongMaterial({

    map: cloudTexture,

    transparent: true,

    opacity: 0.75,

    depthWrite: false

  });


const clouds =
  new THREE.Mesh(
    cloudGeometry,
    cloudMaterial
  );


clouds.visible = false;

scene.add(
  clouds
);


/* =========================================
   ATMOSPHERE
========================================= */

const atmosphereGeometry =
  new THREE.SphereGeometry(
    1.06,
    128,
    128
  );


const atmosphereMaterial =
  new THREE.MeshBasicMaterial({

    color: 0x4aa8ff,

    transparent: true,

    opacity: 0.16,

    side: THREE.BackSide,

    blending:
      THREE.AdditiveBlending,

    depthWrite: false

  });


const atmosphere =
  new THREE.Mesh(
    atmosphereGeometry,
    atmosphereMaterial
  );


atmosphere.visible = false;

scene.add(
  atmosphere
);


/* =========================================
   STATE
========================================= */

let started = false;

let timeTravel = false;

let earthIntro = false;

let animationStart = 0;


/* =========================================
   DOM
========================================= */

const openingText =
  document.getElementById(
    "opening-text"
  );

const startButton =
  document.getElementById(
    "start-button"
  );

const yearDisplay =
  document.getElementById(
    "year-display"
  );

const locationScreen =
  document.getElementById(
    "location-screen"
  );

const finalScreen =
  document.getElementById(
    "final-screen"
  );


/* =========================================
   OPENING
========================================= */

setTimeout(() => {

  openingText.classList.add(
    "show"
  );

  fadeStarsIn();

}, 600);


setTimeout(() => {

  openingText.classList.remove(
    "show"
  );

}, 2800);


/* =========================================
   EARTH APPEARS
========================================= */

setTimeout(() => {

  earth.visible = true;

  clouds.visible = true;

  atmosphere.visible = true;

  earthIntro = true;

  startButton.classList.add(
    "show"
  );

}, 3500);


/* =========================================
   STAR FADE
========================================= */

function fadeStarsIn() {

  const start =
    performance.now();

  function fade(now) {

    const progress =
      Math.min(
        (now - start) / 1800,
        1
      );

    starMaterial.opacity =
      progress * 0.9;

    if (progress < 1) {

      requestAnimationFrame(
        fade
      );

    }

  }

  requestAnimationFrame(
    fade
  );

}


/* =========================================
   START EXPERIENCE
========================================= */

startButton.addEventListener(
  "click",
  () => {

    if (started) return;

    started = true;

    startButton.classList.remove(
      "show"
    );

    startTimeTravel();

  }
);


/* =========================================
   TIME TRAVEL
========================================= */

function startTimeTravel() {

  timeTravel = true;

  yearDisplay.classList.add(
    "show"
  );

  animationStart =
    performance.now();

  const duration =
    7000;


  function travel(now) {

    const elapsed =
      now - animationStart;

    let progress =
      Math.min(
        elapsed / duration,
        1
      );


    /*
      Fast beginning,
      smooth slow ending.
    */

    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    const year =
      Math.round(
        2026 -
        (2026 - 2006) *
        eased
      );


    yearDisplay.textContent =
      year;


    /*
      Earth rotation
    */

    earth.rotation.y +=
      0.015 +
      progress * 0.09;


    /*
      Clouds move independently
    */

    clouds.rotation.y +=
      0.018 +
      progress * 0.04;


    /*
      Camera moves toward Earth
    */

    camera.position.z =
      3.2 -
      progress * 1.55;


    /*
      Slight cinematic tilt
    */

    camera.position.y =
      Math.sin(
        progress * Math.PI
      ) * 0.12;


    camera.lookAt(
      0,
      0,
      0
    );


    if (progress < 1) {

      requestAnimationFrame(
        travel
      );

    } else {

      finishTravel();

    }

  }


  requestAnimationFrame(
    travel
  );

}


/* =========================================
   FINISH TRAVEL
========================================= */

function finishTravel() {

  timeTravel = false;

  yearDisplay.classList.remove(
    "show"
  );


  /*
    IMPORTANT:

    This is currently the placeholder
    for the real geographic transition.

    Next version:

    EARTH
      ↓
    ASIA
      ↓
    INDIA
      ↓
    RAJASTHAN
  */


  setTimeout(() => {

    locationScreen.classList.remove(
      "hidden"
    );

  }, 700);


  setTimeout(() => {

    locationScreen.classList.add(
      "hidden"
    );

  }, 4000);


  setTimeout(() => {

    finalScreen.classList.remove(
      "hidden"
    );

  }, 5200);

}


/* =========================================
   ANIMATION LOOP
========================================= */

function animate() {

  requestAnimationFrame(
    animate
  );


  /*
    Normal Earth rotation
  */

  if (
    earthIntro &&
    !timeTravel
  ) {

    earth.rotation.y +=
      0.0014;

    clouds.rotation.y +=
      0.0019;

  }


  stars.rotation.y +=
    0.00003;


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================
   RESPONSIVE
========================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);
