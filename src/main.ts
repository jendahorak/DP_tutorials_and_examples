import * as THREE from 'three';
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import './style.css';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });

  const fov = 40;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 120;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // # first tutorial

  // const boxWidth = 1;
  // const boxHeight = 1;
  // const boxDepth = 1;
  // const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

  // function makeInstance(geometry, color, x) {
  //   const material = new THREE.MeshPhongMaterial({ color });

  //   const cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);

  //   cube.position.x = x;

  //   return cube;
  // }
  // //
  // const newCubes = [
  //   makeInstance(geometry, 0x44aa88, 0), // prettier-ignore
  //   makeInstance(geometry, 0x8844aa, -2),
  //   makeInstance(geometry, 0xaa8844, 2),
  // ];

  const objects = [];
  const spread = 15;

  function addObject(x, y, obj) {
    obj.position.x = x * spread;
    obj.position.y = y * spread;

    scene.add(obj);
    objects.push(obj);
  }

  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);
  }

  function addLineGeometry(x, y, geometry) {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.LineSegments(geometry, material);
    addObject(x, y, mesh);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }

    return needResize;
  }

  // cube
  {
    const width = 8;
    const height = 8;
    const depth = 8;
    addSolidGeometry(-2, -2, new THREE.BoxGeometry(width, height, depth));
  }

  // CircleGeometry
  {
    const radius = 7;
    const segments = 24;
    const geometry = new THREE.CircleGeometry(radius, segments);
    addSolidGeometry(0, -2, geometry);
  }
  // ConeGeometry
  {
    const radius = 6;
    const height = 7;
    const radialSegments = 8;
    addSolidGeometry(-1, -2, new THREE.ConeGeometry(radius, height, radialSegments));
  }

  // DodecaHedron
  {
    const radius = 7; // ui: radius
    const geometry = new THREE.DodecahedronGeometry(radius);
    addSolidGeometry(1, -2, geometry);
  }

  // ExtrudeGeometry
  {
    const shape = new THREE.Shape();
    const x = -2.5;
    const y = -5;
    shape.moveTo(x + 2.5, y + 2.5);
    shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      steps: 2, // ui: steps
      depth: 2, // ui: depth
      bevelEnabled: true, // ui: bevelEnabled
      bevelThickness: 1, // ui: bevelThickness
      bevelSize: 1, // ui: bevelSize
      bevelSegments: 2, // ui: bevelSegments
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    addSolidGeometry(2, -2, geometry);
  }

  // PlaneGeometry
  {
    const width = 9; // ui: width
    const height = 9; // ui: height
    const geometry = new THREE.PlaneGeometry(width, height);
    addSolidGeometry(-2, -1, geometry);
  }

  // Ring geometry

  {
    const innerRadius = 2; // ui: innerRadius
    const outerRadius = 7; // ui: outerRadius
    const thetaSegments = 18; // ui: thetaSegments
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    addSolidGeometry(-1, -1, geometry);
  }

  // sphere geometry
  {
    const radisu = 7;
    const widthSegments = 50;
    const heightSegments = 50;
    const geom = new THREE.SphereGeometry(radisu, widthSegments, heightSegments);
    addSolidGeometry(0, -1, geom);
  }

  // TorusGeom

  {
    const radius = 5; // ui: radius
    const tubeRadius = 2; // ui: tubeRadius
    const radialSegments = 8; // ui: radialSegments
    const tubularSegments = 24; // ui: tubularSegments
    const geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    addSolidGeometry(1, -1, geometry);
  }

  // TUBE
  {
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super();
        this.scale = scale;
      }
      getPoint(t) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
      }
    }

    const path = new CustomSinCurve(4);
    const tubularSegments = 20; // ui: tubularSegments
    const radius = 1; // ui: radius
    const radialSegments = 8; // ui: radialSegments
    const closed = false; // ui: closed
    const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed);
    addSolidGeometry(2, -1, geometry);
  }

  // text geom
  {
    // const loader = new FontLoader();
    const loader = new FontLoader();
    const font = loader.load(
      '../node_modules/three/examples/fonts/helvetiker_bold.typeface.json',
      // onLoad callback
      function (font) {
        // do something with the font
        console.log(font);
        const geometry = new TextGeometry('three.js', {
          font: font,
          size: 3.0,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.15,
          bevelSize: 0.3,
          bevelSegments: 5,
        });
        const mesh = new THREE.Mesh(geometry, createMaterial());
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);
        const parent = new THREE.Object3D();
        parent.add(mesh);

        addObject(0, 0, parent);

        console.log(mesh);
      },

      // onProgress callback
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },

      // onError callback
      function (err) {
        console.log('An error happened');
      },
    );
  }

  // edgeGeom

  {
    const size = 8;
    const widthSegments = 2;
    const heightSegments = 2;
    const depthSegments = 2;
    const boxGeometry = new THREE.BoxGeometry(size, size, size, widthSegments, heightSegments, depthSegments);
    const geometry = new THREE.EdgesGeometry(boxGeometry);
    addLineGeometry(1, 0, geometry);
  }

  // wireframe

  {
    const size = 8;
    const widthSegments = 2; // ui: widthSegments
    const heightSegments = 2; // ui: heightSegments
    const depthSegments = 2; // ui: depthSegments
    const geometry = new THREE.WireframeGeometry(new THREE.BoxGeometry(size, size, size, widthSegments, heightSegments, depthSegments));
    addLineGeometry(-1, 0, geometry);
  }

  // buffer geom
  {
    const radius = 3;
    const widthSegments = 12;
    const heightSegments = 8;
    const geom = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const pMaterial = new THREE.PointsMaterial({
      color: 'red',
      size: 1,
    });
    const points = new THREE.Points(geom, pMaterial);
    addObject(-1, 0, points);
    console.log(points);
  }

  function render(time) {
    time *= 0.001; // time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas1 = renderer.domElement;
      camera.aspect = canvas1.clientWidth / canvas1.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((object, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      object.rotation.x = rot;
      object.rotation.y = rot;
    });
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
