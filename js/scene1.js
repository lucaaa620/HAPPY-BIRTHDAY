import * as THREE from "./three.module.js";


/* =====================================================
   SCENE 1
   SHAHIN — A BIRTHDAY JOURNEY

   PHASE 1:
   SPACE
      ↓
   EARTH
      ↓
   TAP TO BEGIN
      ↓
   FAST ROTATION
      ↓
   INDIA TARGET
      ↓
   CINEMATIC ZOOM
===================================================== */


/* =====================================================
   DOM
===================================================== */

const container =
  document.getElementById("scene-container");

const openingText =
  document.getElementById("opening-text");

const startButton =
  document.getElementById("start-button");

const yearDisplay =
  document.getElementById("year-display");

const locationScreen =
  document.getElementById("location-screen");

const finalScreen =
  document.getElementById("final-screen");


/* =====================================================
   SCENE
===================================================== */

const scene =
  new THREE.Scene();


/* =====================================================
   CAMERA
===================================================== */

const camera =
  new THREE.PerspectiveCamera(
    42,
    window.innerWidth /
      window.innerHeight,
    0.1,
    1000
  );

camera.position.set(
  0,
  0,
  3.5
);


/* =====================================================
   RENDERER
===================================================== */

const renderer =
  new THREE.WebGLRenderer({

    antialias: true,

    alpha: true,

    powerPreference:
      "high-performance"

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


/* =====================================================
   STAR FIELD
===================================================== */

const starGeometry =
  new THREE.BufferGeometry();


const STAR_COUNT =
  3500;


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
    (Math.random() - 0.5) * 220;

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

    size: 0.035,

    transparent: true,

    opacity: 0,

    depthWrite: false

  });


const stars =
  new THREE.Points(
    starGeometry,
    starMaterial
  );


scene.add(
  stars
);


/* =====================================================
   LIGHTING
===================================================== */

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.12
  );


scene.add(
  ambientLight
);


/* Sun */

const sunLight =
  new THREE.DirectionalLight(
    0xffffff,
    3.5
  );


sunLight.position.set(
  5,
  2,
  5
);


scene.add(
  sunLight
);


/* Slight fill light */

const fillLight =
  new THREE.DirectionalLight(
    0x6688ff,
    0.35
  );


fillLight.position.set(
  -4,
  1,
  -3
);


scene.add(
  fillLight
);


/* =====================================================
   TEXTURE LOADER
===================================================== */

const textureLoader =
  new THREE.TextureLoader();


/* =====================================================
   EARTH TEXTURE
===================================================== */

const earthTexture =
  textureLoader.load(

    "assets/earth/earth-combined.jpg",

    () => {

      console.log(
        "EARTH TEXTURE LOADED"
      );

    },

    undefined,

    (error) => {

      console.error(
        "EARTH TEXTURE FAILED",
        error
      );

    }

  );


earthTexture.colorSpace =
  THREE.SRGBColorSpace;


/* =====================================================
   EARTH
===================================================== */

const earthGeometry =
  new THREE.SphereGeometry(
    1,
    160,
    160
  );


const earthMaterial =
  new THREE.MeshPhongMaterial({

    map:
      earthTexture,

    shininess:
      10,

    specular:
      new THREE.Color(
        0x333333
      )

  });


const earth =
  new THREE.Mesh(
    earthGeometry,
    earthMaterial
  );


earth.scale.set(
  1,
  1,
  1
);


earth.visible =
  false;


scene.add(
  earth
);


/* =====================================================
   ATMOSPHERE
===================================================== */

const atmosphereGeometry =
  new THREE.SphereGeometry(
    1.075,
    160,
    160
  );


const atmosphereMaterial =
  new THREE.MeshBasicMaterial({

    color:
      0x3da9ff,

    transparent:
      true,

    opacity:
      0.18,

    side:
      THREE.BackSide,

    blending:
      THREE.AdditiveBlending,

    depthWrite:
      false

  });


const atmosphere =
  new THREE.Mesh(
    atmosphereGeometry,
    atmosphereMaterial
  );


atmosphere.visible =
  false;


scene.add(
  atmosphere
);


/* =====================================================
   OUTER ATMOSPHERE
===================================================== */

const outerAtmosphereGeometry =
  new THREE.SphereGeometry(
    1.13,
    160,
    160
  );


const outerAtmosphereMaterial =
  new THREE.MeshBasicMaterial({

    color:
      0x1976ff,

    transparent:
      true,

    opacity:
      0.055,

    side:
      THREE.BackSide,

    blending:
      THREE.AdditiveBlending,

    depthWrite:
      false

  });


const outerAtmosphere =
  new THREE.Mesh(
    outerAtmosphereGeometry,
    outerAtmosphereMaterial
  );


outerAtmosphere.visible =
  false;


scene.add(
  outerAtmosphere
);


/* =====================================================
   STATE
===================================================== */

let started =
  false;

let traveling =
  false;

let earthReady =
  false;


/* =====================================================
   INDIA TARGET
===================================================== */

/*
   Approximate geographic center of India.

   Latitude:
   ~22.5° N

   Longitude:
   ~78.9° E
*/

const INDIA_LAT =
  THREE.MathUtils.degToRad(
    22.5
  );


const INDIA_LON =
  THREE.MathUtils.degToRad(
    78.9
  );


/*
   This offset compensates for the
   standard equirectangular texture
   orientation on SphereGeometry.

   If the downloaded Earth texture
   is oriented differently, this value
   can be adjusted later.
*/

const EARTH_TEXTURE_OFFSET =
  Math.PI;


/* =====================================================
   INDIA TARGET QUATERNION
===================================================== */

function createIndiaTargetQuaternion() {

  /*
     Geographic point on unit sphere.
  */

  const x =
    Math.cos(INDIA_LAT) *
    Math.cos(
      INDIA_LON
    );

  const y =
    Math.sin(
      INDIA_LAT
    );

  const z =
    Math.cos(INDIA_LAT) *
    Math.sin(
      INDIA_LON
    );


  const target =
    new THREE.Vector3(
      x,
      y,
      z
    );


  /*
     Camera looks toward
     negative Z.

     We rotate the Earth so
     India's geographic point
     moves toward the camera.
  */

  const direction =
    new THREE.Vector3(
      0,
      0,
      1
    );


  const quaternion =
    new THREE.Quaternion();


  quaternion.setFromUnitVectors(
    target.normalize(),
    direction
  );


  /*
     Texture orientation correction.
  */

  const textureRotation =
    new THREE.Quaternion();


  textureRotation.setFromAxisAngle(

    new THREE.Vector3(
      0,
      1,
      0
    ),

    EARTH_TEXTURE_OFFSET

  );


  quaternion.multiply(
    textureRotation
  );


  return quaternion;

}


const INDIA_TARGET =
  createIndiaTargetQuaternion();


/* =====================================================
   OPENING
===================================================== */

setTimeout(
  () => {

    if (openingText) {

      openingText.classList.add(
        "show"
      );

    }

    fadeStarsIn();

  },

  600
);


/* =====================================================
   OPENING TEXT DISAPPEARS
===================================================== */

setTimeout(
  () => {

    if (openingText) {

      openingText.classList.remove(
        "show"
      );

    }

  },

  3000
);


/* =====================================================
   EARTH APPEARS
===================================================== */

setTimeout(
  () => {

    earth.visible =
      true;

    atmosphere.visible =
      true;

    outerAtmosphere.visible =
      true;

    earthReady =
      true;


    if (startButton) {

      startButton.classList.add(
        "show"
      );

    }

  },

  3500
);


/* =====================================================
   STAR FADE
===================================================== */

function fadeStarsIn() {

  const start =
    performance.now();


  function fade(now) {

    const progress =
      Math.min(
        (now - start) /
          2200,
        1
      );


    /*
       Smooth cinematic fade.
    */

    starMaterial.opacity =
      THREE.MathUtils.smoothstep(
        progress,
        0,
        1
      ) * 0.9;


    if (
      progress <
      1
    ) {

      requestAnimationFrame(
        fade
      );

    }

  }


  requestAnimationFrame(
    fade
  );

}


/* =====================================================
   TAP
===================================================== */

if (startButton) {

  startButton.addEventListener(

    "click",

    () => {

      if (
        started
      ) {

        return;

      }


      started =
        true;


      startButton.classList.remove(
        "show"
      );


      startTimeTravel();

    }

  );

}


/* =====================================================
   TIME TRAVEL
===================================================== */

function startTimeTravel() {

  traveling =
    true;


  if (yearDisplay) {

    yearDisplay.classList.add(
      "show"
    );

  }


  const start =
    performance.now();


  /*
     Total duration.

     First part:
     FAST EARTH ROTATION

     Second part:
     INDIA TARGET

     Third part:
     CINEMATIC ZOOM
  */

  const duration =
    9000;


  function travel(now) {

    const elapsed =
      now - start;


    const progress =
      Math.min(
        elapsed /
          duration,
        1
      );


    /* =====================================
       YEAR
    ===================================== */

    const yearProgress =
      Math.min(
        progress /
          0.78,
        1
      );


    const yearEased =
      1 -
      Math.pow(
        1 -
          yearProgress,
        3
      );


    const currentYear =
      Math.round(

        2026 -
        (
          2026 -
          2006
        ) *
        yearEased

      );


    if (yearDisplay) {

      yearDisplay.textContent =
        currentYear;

    }


    /* =====================================
       PHASE 1
       FAST ROTATION
    ===================================== */

    if (
      progress <
      0.48
    ) {

      const spinProgress =
        progress /
        0.48;


      const spinEased =
        THREE.MathUtils.smoothstep(
          spinProgress,
          0,
          1
        );


      /*
         Multiple rotations.

         This makes the Earth feel
         like it is genuinely traveling
         around the globe.
      */

      const spinAmount =
        Math.PI *
        5.5 *
        spinEased;


      earth.rotation.y =
        spinAmount;


      /*
         Slight vertical movement.
      */

      earth.rotation.x =
        Math.sin(
          spinProgress *
          Math.PI
        ) *
        0.08;

    }


    /* =====================================
       PHASE 2
       INDIA TARGET
    ===================================== */

    else if (
      progress <
      0.72
    ) {

      const targetProgress =
        (
          progress -
          0.48
        ) /
        0.24;


      const eased =
        THREE.MathUtils.smootherstep(
          targetProgress,
          0,
          1
        );


      /*
         Smoothly rotate Earth
         toward India.
      */

      const currentQuaternion =
        earth.quaternion.clone();


      earth.quaternion =
        currentQuaternion.slerp(
          INDIA_TARGET,
          eased
        );


      /*
         Slow down rotation
         while targeting India.
      */

      camera.position.z =
        THREE.MathUtils.lerp(
          3.5,
          3.15,
          eased
        );

    }


    /* =====================================
       PHASE 3
       INDIA ZOOM
    ===================================== */

    else {

      const zoomProgress =
        (
          progress -
          0.72
        ) /
        0.28;


      const eased =
        THREE.MathUtils.smootherstep(
          zoomProgress,
          0,
          1
        );


      /*
         Earth stops spinning.

         Now the camera dives
         toward India.
      */

      camera.position.z =
        THREE.MathUtils.lerp(
          3.15,
          1.75,
          eased
        );


      camera.position.y =
        THREE.MathUtils.lerp(
          0,
          0.04,
          eased
        );


      /*
         Atmosphere becomes
         stronger during the dive.
      */

      atmosphereMaterial.opacity =
        THREE.MathUtils.lerp(
          0.18,
          0.28,
          eased
        );


      outerAtmosphereMaterial.opacity =
        THREE.MathUtils.lerp(
          0.055,
          0.09,
          eased
        );

    }


    camera.lookAt(
      0,
      0,
      0
    );


    /* =====================================
       FINISH
    ===================================== */

    if (
      progress <
      1
    ) {

      requestAnimationFrame(
        travel
      );

    }

    else {

      finishTravel();

    }

  }


  requestAnimationFrame(
    travel
  );

}


/* =====================================================
   FINISH
===================================================== */

function finishTravel() {

  traveling =
    false;


  if (yearDisplay) {

    yearDisplay.classList.remove(
      "show"
    );

  }


  /*
     Temporary Phase 1 ending.

     Rajasthan map dive will replace
     this section in Phase 2.
  */


  setTimeout(
    () => {

      if (locationScreen) {

        locationScreen.classList.remove(
          "hidden"
        );

      }

    },

    700
  );


  setTimeout(
    () => {

      if (locationScreen) {

        locationScreen.classList.add(
          "hidden"
        );

      }

    },

    4000
  );


  setTimeout(
    () => {

      if (finalScreen) {

        finalScreen.classList.remove(
          "hidden"
        );

      }

    },

    5200
  );

}


/* =====================================================
   ANIMATION LOOP
===================================================== */

function animate() {

  requestAnimationFrame(
    animate
  );


  /* =====================================
     NORMAL EARTH ROTATION
  ===================================== */

  if (
    earthReady &&
    !traveling
  ) {

    earth.rotation.y +=
      0.0008;

  }


  /*
     Stars slowly move.
  */

  stars.rotation.y +=
    0.00002;


  /*
     Render.
  */

  renderer.render(
    scene,
    camera
  );

}


/* Start */

animate();


/* =====================================================
   RESPONSIVE
===================================================== */

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
