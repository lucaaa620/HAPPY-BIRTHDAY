import * as THREE from "./three.module.js";


/* =====================================================
   SHAHIN — A BIRTHDAY JOURNEY
   SCENE 1
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
   THREE.JS SCENE
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
   Approximate center of India

   Latitude  = 22.5° N
   Longitude = 78.9° E
*/


const INDIA_LATITUDE =
  22.5;


const INDIA_LONGITUDE =
  78.9;


/*
   These values control where India
   stops in front of the camera.

   IMPORTANT:
   The Earth texture orientation can
   require a small longitude offset.
*/


const INDIA_TARGET_X =
  THREE.MathUtils.degToRad(
    -INDIA_LATITUDE
  );


const INDIA_TARGET_Y =
  THREE.MathUtils.degToRad(
    INDIA_LONGITUDE
  );


/* =====================================================
   OPENING TEXT
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


    /*
       Remove opening text
       when Earth appears.
    */

    if (openingText) {

      openingText.classList.remove(
        "show"
      );

      openingText.style.opacity =
        "0";

      openingText.style.visibility =
        "hidden";

    }


    /*
       Show TAP TO BEGIN.
    */

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

  const startTime =
    performance.now();


  function fade(now) {

    const progress =
      Math.min(
        (now - startTime) /
          2200,
        1
      );


    starMaterial.opacity =
      THREE.MathUtils.smoothstep(
        progress,
        0,
        1
      ) * 0.9;


    if (
      progress < 1
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
   TAP TO BEGIN
===================================================== */

if (startButton) {

  startButton.addEventListener(
    "click",
    () => {

      if (started) {

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


    yearDisplay.textContent =
      "2026";

  }


  const startTime =
    performance.now();


  /*
     Total animation time
     = 9 seconds
  */

  const duration =
    9000;


  function travel(now) {

    const elapsed =
      now - startTime;


    const progress =
      Math.min(
        elapsed /
          duration,
        1
      );


    /* =================================================
       YEAR
    ================================================= */

    const yearProgress =
      Math.min(
        progress /
          0.82,
        1
      );


    const yearEased =
      1 -
      Math.pow(
        1 -
          yearProgress,
        3
      );


    let currentYear =
      Math.round(

        2026 -
        20 *
        yearEased

      );


    /*
       Final year must be 2006.
    */

    if (
      progress >=
      0.82
    ) {

      currentYear =
        2006;

    }


    if (yearDisplay) {

      yearDisplay.textContent =
        currentYear;

    }


    /* =================================================
       PHASE 1
       FAST EARTH ROTATION
    ================================================= */

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
         Fast rotation.
      */

      const spinAmount =
        Math.PI *
        5.5 *
        spinEased;


      earth.rotation.y =
        spinAmount;


      /*
         Small cinematic tilt.
      */

      earth.rotation.x =
        Math.sin(
          spinProgress *
          Math.PI
        ) *
        0.06;

    }


    /* =================================================
       PHASE 2
       INDIA LOCK
    ================================================= */

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
         Smoothly bring India
         toward the camera.
      */

      earth.rotation.x =
        THREE.MathUtils.lerp(
          earth.rotation.x,
          INDIA_TARGET_X,
          eased
        );


      earth.rotation.y =
        THREE.MathUtils.lerp(
          earth.rotation.y,
          INDIA_TARGET_Y,
          eased
        );


      /*
         Small camera movement.
      */

      camera.position.z =
        THREE.MathUtils.lerp(
          3.5,
          3.15,
          eased
        );


      camera.lookAt(
        0,
        0,
        0
      );

    }


    /* =================================================
       PHASE 3
       INDIA ZOOM
    ================================================= */

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
         Lock India.
      */

      earth.rotation.x =
        INDIA_TARGET_X;


      earth.rotation.y =
        INDIA_TARGET_Y;


      /*
         Zoom toward India.
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
         Increase atmospheric glow.
      */

      atmosphereMaterial.opacity =
        THREE.MathUtils.lerp(
          0.18,
          0.30,
          eased
        );


      outerAtmosphereMaterial.opacity =
        THREE.MathUtils.lerp(
          0.055,
          0.10,
          eased
        );

    }


    camera.lookAt(
      0,
      0,
      0
    );


    /* =================================================
       CONTINUE
    ================================================= */

    if (
      progress <
      1
    ) {

      requestAnimationFrame(
        travel
      );

    }

    else {

      /*
         Guarantee 2006.
      */

      if (yearDisplay) {

        yearDisplay.textContent =
          "2006";

      }


      finishTravel();

    }

  }


  requestAnimationFrame(
    travel
  );

}


/* =====================================================
   FINISH TRAVEL
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
     TEMPORARY ENDING

     Next stage:

     INDIA
       ↓
     RAJASTHAN
       ↓
     RAJASTHAN MAP
       ↓
     CLOUD DIVE
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


  /*
     Slow Earth rotation
     before TAP.
  */

  if (
    earthReady &&
    !traveling
  ) {

    earth.rotation.y +=
      0.0008;

  }


  /*
     Slowly move stars.
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
