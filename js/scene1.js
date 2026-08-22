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
   CLOUD TRANSITION SYSTEM
===================================================== */

/*
   We create the cloud texture ourselves using
   a small canvas. No external cloud asset needed.
*/

function createCloudTexture() {

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    256;

  canvas.height =
    256;


  const ctx =
    canvas.getContext(
      "2d"
    );


  const gradient =
    ctx.createRadialGradient(
      128,
      128,
      5,
      128,
      128,
      125
    );


  gradient.addColorStop(
    0,
    "rgba(255,255,255,0.95)"
  );

  gradient.addColorStop(
    0.35,
    "rgba(255,255,255,0.75)"
  );

  gradient.addColorStop(
    0.65,
    "rgba(255,255,255,0.35)"
  );

  gradient.addColorStop(
    1,
    "rgba(255,255,255,0)"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    256,
    256
  );


  const texture =
    new THREE.CanvasTexture(
      canvas
    );


  texture.colorSpace =
    THREE.SRGBColorSpace;


  return texture;

}


const cloudTexture =
  createCloudTexture();


const cloudGroup =
  new THREE.Group();


scene.add(
  cloudGroup
);


/* =====================================================
   CLOUD PARTICLES
===================================================== */

const CLOUD_COUNT =
  42;


const clouds =
  [];


for (
  let i = 0;
  i < CLOUD_COUNT;
  i++
) {

  const material =
    new THREE.SpriteMaterial({

      map:
        cloudTexture,

      transparent:
        true,

      opacity:
        0,

      depthWrite:
        false,

      blending:
        THREE.NormalBlending

    });


  const cloud =
    new THREE.Sprite(
      material
    );


  /*
     Start clouds far from
     the camera.
  */

  cloud.position.set(

    (Math.random() - 0.5) * 5,

    (Math.random() - 0.5) * 4,

    -2 -
      Math.random() * 7

  );


  const scale =
    0.8 +
    Math.random() * 1.8;


  cloud.scale.set(

    scale,

    scale *
      (0.55 +
        Math.random() * 0.4),

    1

  );


  cloud.userData = {

    baseX:
      cloud.position.x,

    baseY:
      cloud.position.y,

    startZ:
      cloud.position.z,

    speed:
      0.018 +
      Math.random() * 0.035,

    drift:
      Math.random() * Math.PI * 2,

    scale:
      scale

  };


  cloudGroup.add(
    cloud
  );


  clouds.push(
    cloud
  );

}


/* =====================================================
   CLOUD STATE
===================================================== */

let cloudTransitionActive =
  false;


let cloudTransitionProgress =
  0;


let cloudFade =
  0;


/* =====================================================
   CLOUD ANIMATION
===================================================== */

function updateClouds() {

  if (
    !cloudTransitionActive
  ) {

    return;

  }


  /*
     Cloud fade-in.
  */

  cloudFade =
    THREE.MathUtils.lerp(

      cloudFade,

      1,

      0.035

    );


  for (
    let i = 0;
    i < clouds.length;
    i++
  ) {

    const cloud =
      clouds[i];


    const data =
      cloud.userData;


    /*
       Clouds move toward
       the camera.

       The closer they get,
       the larger they become.
    */

    cloud.position.z +=
      data.speed *
      (
        1 +
        cloudTransitionProgress *
        7
      );


    /*
       Slight sideways movement.
    */

    cloud.position.x =
      data.baseX +
      Math.sin(
        performance.now() *
          0.0004 +
          data.drift
      ) *
      0.08;


    cloud.position.y =
      data.baseY +
      Math.cos(
        performance.now() *
          0.00035 +
          data.drift
      ) *
      0.06;


    /*
       Cloud gets larger as
       it approaches camera.
    */

    const distance =
      Math.max(
        0.5,
        5 +
        cloud.position.z
      );


    const size =
      data.scale *
      (
        1 +
        cloudTransitionProgress *
        5
      ) /
      distance;


    cloud.scale.set(

      size * 2.0,

      size * 1.15,

      1

    );


    /*
       Opacity increases.
    */

    cloud.material.opacity =
      Math.min(

        0.9,

        cloudFade *
        (
          0.35 +
          cloudTransitionProgress *
          0.8
        )

      );


    /*
       Reset cloud when it
       passes the camera.
    */

    if (
      cloud.position.z >
      2.5
    ) {

      cloud.position.z =
        -5 -
        Math.random() * 5;


      cloud.position.x =
        (Math.random() - 0.5) * 5;


      cloud.position.y =
        (Math.random() - 0.5) * 4;

    }

  }

}


/* =====================================================
   CLOUD TRANSITION START
===================================================== */

function startCloudTransition() {

  cloudTransitionActive =
    true;


  cloudTransitionProgress =
    0;


  cloudFade =
    0;

}


/* =====================================================
   CLOUD TRANSITION END
===================================================== */

function stopCloudTransition() {

  cloudTransitionActive =
    false;


  cloudTransitionProgress =
    0;


  cloudFade =
    0;


  for (
    let i = 0;
    i < clouds.length;
    i++
  ) {

    const cloud =
      clouds[i];


    cloud.material.opacity =
      0;


    cloud.position.z =
      -5 -
      Math.random() * 5;

  }

}


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
   This is the working India
   calibration from your current scene.
*/

const INDIA_TARGET_X =
  THREE.MathUtils.degToRad(
    24
  );


const INDIA_TARGET_Y =
  THREE.MathUtils.degToRad(
    -164.5
  );


/* =====================================================
   RAJASTHAN TARGET
===================================================== */

/*
   IMPORTANT:

   These are the values that are
   currently working correctly.

   DO NOT CHANGE THEM.
*/

const RAJASTHAN_TARGET_X =
  THREE.MathUtils.degToRad(
    21.8
  );


const RAJASTHAN_TARGET_Y =
  THREE.MathUtils.degToRad(
    -170.8
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


  stopCloudTransition();


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
     TIMELINE

     0.00 - 4.30
     FAST EARTH ROTATION

     4.30 - 6.50
     INDIA FOCUS

     6.50 - 8.50
     INDIA ZOOM

     8.50 - 10.80
     RAJASTHAN FOCUS

     10.80 - 12.50
     RAJASTHAN DESCENT
     + CLOUD TRANSITION
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
          0.62,

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
      progress >= 0.62
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


      const spinAmount =
        Math.PI *
        5.5 *
        spinEased;


      earth.rotation.y =
        spinAmount;


      earth.rotation.x =
        Math.sin(

          spinProgress *
            Math.PI

        ) *
        0.06;


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


      earth.rotation.x =
        INDIA_TARGET_X;


      earth.rotation.y =
        INDIA_TARGET_Y;


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
      progress < 0.865
    ) {

      const rajasthanProgress =
        (

          progress -
            0.68

        ) /
        0.185;


      const eased =
        THREE.MathUtils.smootherstep(

          rajasthanProgress,

          0,

          1

        );


      /*
         KEEPING YOUR WORKING
         RAJASTHAN POSITION.
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
         Moderate zoom.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          2.05,

          1.72,

          eased

        );


      camera.position.y =
        THREE.MathUtils.lerp(

          0.04,

          0.055,

          eased

        );


      atmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.30,

          0.37,

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
       RAJASTHAN LOCK
    ================================================= */

    else if (
      progress < 0.90
    ) {

      const lockProgress =
        (

          progress -
            0.865

        ) /
        0.035;


      const eased =
        THREE.MathUtils.smootherstep(

          lockProgress,

          0,

          1

        );


      /*
         LOCK RAJASTHAN.
      */

      earth.rotation.x =
        RAJASTHAN_TARGET_X;


      earth.rotation.y =
        RAJASTHAN_TARGET_Y;


      /*
         Very small push.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          1.72,

          1.65,

          eased

        );


      camera.position.y =
        THREE.MathUtils.lerp(

          0.055,

          0.06,

          eased

        );


      atmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.37,

          0.40,

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
       PHASE 6
       ENTER RAJASTHAN
       CLOUD TRANSITION
    ================================================= */

    else {

      const descentProgress =
        (

          progress -
            0.90

        ) /
        0.10;


      const eased =
        THREE.MathUtils.smootherstep(

          descentProgress,

          0,

          1

        );


      /*
         Rajasthan remains locked.
      */

      earth.rotation.x =
        RAJASTHAN_TARGET_X;


      earth.rotation.y =
        RAJASTHAN_TARGET_Y;


      /*
         Start clouds.
      */

      if (
        !cloudTransitionActive
      ) {

        startCloudTransition();

      }


      cloudTransitionProgress =
        eased;


      /*
         Camera moves forward.

         We are NOT showing
         Rajasthan land.

         This only creates the
         feeling of entering it.
      */

      camera.position.z =
        THREE.MathUtils.lerp(

          1.65,

          0.82,

          eased

        );


      camera.position.y =
        THREE.MathUtils.lerp(

          0.06,

          0.075,

          eased

        );


      /*
         Atmosphere becomes intense.
      */

      atmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.40,

          0.65,

          eased

        );


      outerAtmosphereMaterial.opacity =
        THREE.MathUtils.lerp(

          0.15,

          0.23,

          eased

        );


      /*
         Slight brightness increase.
      */

      sunLight.intensity =
        THREE.MathUtils.lerp(

          3.5,

          4.4,

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

      if (yearDisplay) {

        yearDisplay.textContent =
          "2006";

      }


      /*
         Final Rajasthan lock.
      */

      earth.rotation.x =
        RAJASTHAN_TARGET_X;


      earth.rotation.y =
        RAJASTHAN_TARGET_Y;


      earthLocked =
        true;


      traveling =
        false;


      /*
         Clouds reach maximum
         coverage for a moment.
      */

      cloudTransitionProgress =
        1;


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
     Keep clouds for a short
     cinematic transition.
  */

  setTimeout(

    () => {

      if (yearDisplay) {

        yearDisplay.classList.remove(
          "show"
        );

      }

    },

    250

  );


  /*
     Show location while clouds
     are still fading.
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


  /*
     Fade clouds away.
  */

  setTimeout(

    () => {

      stopCloudTransition();

    },

    1150

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
     CLOUDS
  =================================================== */

  updateClouds();


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
