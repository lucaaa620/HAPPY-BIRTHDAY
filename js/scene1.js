import * as THREE from "./three.module.js";


/* =========================================
   CONTAINER
========================================= */

const container =
  document.getElementById("scene-container");

if (!container) {
  throw new Error("SCENE CONTAINER NOT FOUND");
}


/* =========================================
   SCENE
========================================= */

const scene = new THREE.Scene();


/* =========================================
   CAMERA
========================================= */

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
  3.4
);


/* =========================================
   RENDERER
========================================= */

const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
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
   STARS
========================================= */

const starGeometry =
  new THREE.BufferGeometry();

const STAR_COUNT = 3000;

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

    opacity: 0,

    depthWrite: false

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
    0.35
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
  3,
  5
);

scene.add(
  sunLight
);


/* =========================================
   EARTH TEXTURE
========================================= */

const textureLoader =
  new THREE.TextureLoader();

const earthTexture =
  textureLoader.load(

    "../assets/earth/earth-combined.jpg",

    () => {

      console.log(
        "EARTH TEXTURE LOADED SUCCESSFULLY"
      );

    },

    undefined,

    (error) => {

      console.error(
        "EARTH TEXTURE FAILED TO LOAD",
        error
      );

    }

  );

earthTexture.colorSpace =
  THREE.SRGBColorSpace;


/* =========================================
   EARTH GEOMETRY
========================================= */

const earthGeometry =
  new THREE.SphereGeometry(
    1,
    128,
    128
  );


/* =========================================
   EARTH MATERIAL
========================================= */

const earthMaterial =
  new THREE.MeshPhongMaterial({

    map: earthTexture,

    shininess: 12,

    specular:
      new THREE.Color(
        0x222222
      )

  });


/* =========================================
   EARTH
========================================= */

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

    opacity: 0.18,

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
   DOM ELEMENTS
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
   STATE
========================================= */

let started = false;

let timeTravel = false;

let earthVisible = false;


/* =========================================
   OPENING
========================================= */

setTimeout(() => {

  if (openingText) {

    openingText.classList.add(
      "show"
    );

  }

  fadeStarsIn();

}, 600);


/* =========================================
   OPENING TEXT FADE OUT
========================================= */

setTimeout(() => {

  if (openingText) {

    openingText.classList.remove(
      "show"
    );

  }

}, 2800);


/* =========================================
   EARTH APPEARS
========================================= */

setTimeout(() => {

  earth.visible = true;

  atmosphere.visible = true;

  earthVisible = true;

  if (startButton) {

    startButton.classList.add(
      "show"
    );

  }

}, 3500);


/* =========================================
   STAR FADE
========================================= */

function fadeStarsIn() {

  const startTime =
    performance.now();


  function fade(now) {

    const progress =
      Math.min(
        (now - startTime) / 1800,
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
   TAP TO BEGIN
========================================= */

if (startButton) {

  startButton.addEventListener(
    "click",

    () => {

      if (started) {
        return;
      }

      started = true;

      startButton.classList.remove(
        "show"
      );

      startTimeTravel();

    }
  );

}


/* =========================================
   TIME TRAVEL
========================================= */

function startTimeTravel() {

  timeTravel = true;

  if (yearDisplay) {

    yearDisplay.classList.add(
      "show"
    );

  }


  const startTime =
    performance.now();

  const duration =
    7000;


  function travel(now) {

    const elapsed =
      now - startTime;


    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    /* Smooth easing */

    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    /* 2026 → 2006 */

    const currentYear =
      Math.round(
        2026 -
        (2026 - 2006) *
        eased
      );


    if (yearDisplay) {

      yearDisplay.textContent =
        currentYear;

    }


    /* Earth gets faster */

    earth.rotation.y +=
      0.015 +
      progress * 0.09;


    /* Camera zoom */

    camera.position.z =
      3.4 -
      progress * 1.55;


    /* Cinematic camera movement */

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

      finishTimeTravel();

    }

  }


  requestAnimationFrame(
    travel
  );

}


/* =========================================
   FINISH TIME TRAVEL
========================================= */

function finishTimeTravel() {

  timeTravel = false;


  if (yearDisplay) {

    yearDisplay.classList.remove(
      "show"
    );

  }


  /*
    Temporary location reveal.

    Later:

    EARTH
      ↓
    ASIA
      ↓
    INDIA
      ↓
    RAJASTHAN
  */


  setTimeout(() => {

    if (locationScreen) {

      locationScreen.classList.remove(
        "hidden"
      );

    }

  }, 700);


  setTimeout(() => {

    if (locationScreen) {

      locationScreen.classList.add(
        "hidden"
      );

    }

  }, 4000);


  setTimeout(() => {

    if (finalScreen) {

      finalScreen.classList.remove(
        "hidden"
      );

    }

  }, 5200);

}


/* =========================================
   ANIMATION LOOP
========================================= */

function animate() {

  requestAnimationFrame(
    animate
  );


  /* Slow Earth rotation */

  if (
    earthVisible &&
    !timeTravel
  ) {

    earth.rotation.y +=
      0.0015;

  }


  /* Slow star movement */

  stars.rotation.y +=
    0.00003;


  /* Render */

  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================
   RESIZE
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
