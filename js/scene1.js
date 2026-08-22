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
   STARS
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
   INNER ATMOSPHERE
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


let earthLocked =
  false;


/* =====================================================
   INDIA TARGET
===================================================== */

/*
   Existing calibrated India position.
*/

const INDIA_TARGET_X =
  THREE.MathUtils.degToRad(
    20
  );


const INDIA_TARGET_Y =
  THREE.MathUtils.degToRad(
    -168.9
  );


/* =====================================================
   RAJASTHAN TARGET
===================================================== */

/*
   Rajasthan focus target.

   This is intentionally kept separate
   so we can fine-tune the visual position
   without changing the India animation.
*/

const RAJASTHAN_TARGET_X =
  THREE.MathUtils.degToRad(
    27
  );


const RAJASTHAN_TARGET_Y =
  THREE.MathUtils.degToRad(
    -174.2
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
       Hide opening text.
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


  earthLocked =
    false;


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
     TOTAL TIME:

     0.00 - 4.30
     FAST EARTH ROTATION

     4.30 - 6.50
     INDIA FOCUS

     6.50 - 8.50
     INDIA ZOOM

     8.50 - 11.50
     RAJASTHAN FOCUS

     11.50 - 12.50
     FINAL LOCK
  */

  const duration =
    12500;


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


    let currentYear =
      Math.round(

        2026 -
          20 *
          yearEased

      );


    if (
      progress >= 0.78
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
      progress < 0.345
    ) {

      const spinProgress =
        progress /
        0.345;


      const spinEased =
        THREE.MathUtils.smoothstep(

          spinProgress,

          0,

          1

        );


      /*
         Fast cinematic rotation.
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


      /*
         Slight camera push.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          3.5,

          3.25,

          spinEased

        );

    }


    /* =================================================
       PHASE 2
       INDIA FOCUS
    ================================================= */

    else if (
      progress < 0.52
    ) {

      const indiaProgress =
        (

          progress -
            0.345

        ) /
        0.175;


      const eased =
        THREE.MathUtils.smootherstep(

          indiaProgress,

          0,

          1

        );


      /*
         Rotate Earth toward India.
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
         Camera moves closer.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          3.25,

          3.0,

          eased

        );


      camera.position.y =
        THREE.MathUtils.lerp(

          0,

          0.02,

          eased

        );

    }


    /* =================================================
       PHASE 3
       INDIA LOCK + ZOOM
    ================================================= */

    else if (
      progress < 0.68
    ) {

      const indiaZoomProgress =
        (

          progress -
            0.52

        ) /
        0.16;


      const eased =
        THREE.MathUtils.smootherstep(

          indiaZoomProgress,

          0,

          1

        );


      /*
         India remains centered.
      */

      earth.rotation.x =
        INDIA_TARGET_X;


      earth.rotation.y =
        INDIA_TARGET_Y;


      /*
         Camera zoom.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          3.0,

          2.05,

          eased

        );


      camera.position.y =
        THREE.MathUtils.lerp(

          0.02,

          0.04,

          eased

        );


      /*
         Atmosphere becomes stronger.
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


    /* =================================================
       PHASE 4
       INDIA → RAJASTHAN
    ================================================= */

    else if (
      progress < 0.92
    ) {

      const rajasthanProgress =
        (

          progress -
            0.68

        ) /
        0.24;


      const eased =
        THREE.MathUtils.smootherstep(

          rajasthanProgress,

          0,

          1

        );


      /*
         Move from India
         toward Rajasthan.
      */

      earth.rotation.x =
        THREE.MathUtils.lerp(

          INDIA_TARGET_X,

          RAJASTHAN_TARGET_X,

          eased

        );


      earth.rotation.y =
        THREE.MathUtils.lerp(

          INDIA_TARGET_Y,

          RAJASTHAN_TARGET_Y,

          eased

        );


      /*
         Deep cinematic zoom.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          2.05,

          1.48,

          eased

        );


      /*
         Slight downward movement.
      */

      camera.position.y =
        THREE.MathUtils.lerp(

          0.04,

          0.06,

          eased

        );


      /*
         Atmosphere gets stronger.
      */

      atmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.30,

          0.38,

          eased

        );


      outerAtmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.10,

          0.13,

          eased

        );

    }


    /* =================================================
       PHASE 5
       RAJASTHAN FINAL APPROACH
    ================================================= */

    else {

      const finalProgress =
        (

          progress -
            0.92

        ) /
        0.08;


      const eased =
        THREE.MathUtils.smootherstep(

          finalProgress,

          0,

          1

        );


      /*
         Rajasthan stays centered.
      */

      earth.rotation.x =
        RAJASTHAN_TARGET_X;


      earth.rotation.y =
        RAJASTHAN_TARGET_Y;


      /*
         Final slow push.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          1.48,

          1.36,

          eased

        );


      camera.position.y =
        THREE.MathUtils.lerp(

          0.06,

          0.07,

          eased

        );


      /*
         Strong cinematic atmosphere.
      */

      atmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.38,

          0.42,

          eased

        );


      outerAtmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.13,

          0.15,

          eased

        );

    }


    /* =================================================
       CAMERA LOOK
    ================================================= */

    camera.lookAt(

      0,
      0,
      0

    );


    /* =================================================
       CONTINUE
    ================================================= */

    if (
      progress < 1
    ) {

      requestAnimationFrame(
        travel
      );

    }


    else {

      /*
         Final year.
      */

      if (yearDisplay) {

        yearDisplay.textContent =
          "2006";

      }


      /*
         Lock Rajasthan.
      */

      earth.rotation.x =
        RAJASTHAN_TARGET_X;


      earth.rotation.y =
        RAJASTHAN_TARGET_Y;


      earthLocked =
        true;


      traveling =
        false;


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

  earthLocked =
    true;


  traveling =
    false;


  /*
     Remove year.
  */

  if (yearDisplay) {

    yearDisplay.classList.remove(
      "show"
    );

  }


  /*
     Show location.
  */

  setTimeout(

    () => {

      if (locationScreen) {

        locationScreen.classList.remove(
          "hidden"
        );

      }

    },

    500

  );


  /*
     Hide location.
  */

  setTimeout(

    () => {

      if (locationScreen) {

        locationScreen.classList.add(
          "hidden"
        );

      }

    },

    4500

  );


  /*
     Final reveal.
  */

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
   MAIN ANIMATION LOOP
===================================================== */

function animate() {

  requestAnimationFrame(
    animate
  );


  /* ===================================================
     IDLE EARTH ROTATION
  =================================================== */

  /*
     Earth rotates ONLY before
     the user presses TAP TO BEGIN.
  */

  if (

    earthReady &&

    !started &&

    !traveling &&

    !earthLocked

  ) {

    earth.rotation.y +=
      0.0008;

  }


  /* ===================================================
     STARS
  =================================================== */

  stars.rotation.y +=
    0.00002;


  /* ===================================================
     RENDER
  =================================================== */

  renderer.render(

    scene,

    camera

  );

}


/* =====================================================
   START ANIMATION
===================================================== */

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
