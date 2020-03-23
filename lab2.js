'use strict';
const grafinfo = {};
const neorgrafinfo = {};
const loops = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

 ctx.font = '17px Times new Roman';
 ctx.textBaseline = 'middle';
 ctx.textAlign = 'center';

 const A = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1 ,1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
];

const r = 15;
const rloops = 3 * r / 4;
const arrr = 5;

const buildVertex = (n, P, x0, y0, obj) => {
  let step = P / n;
  const side = P / 4;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  for (vert; vert <=  Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY += step;
  }

  for (vert; vert <=  2 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step;
  }

  for (vert; vert <=  3 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY -= step;
  }
  for (vert; vert <=  n; vert++) {
    step = side / (n - 3 * Math.ceil(n / 4));
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX -= step;
  }
};
buildVertex(11, 1600, 75, 100, grafinfo);
buildVertex(11, 1600, 675, 100, neorgrafinfo);

const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simplecon = [];
    obj[key].doublecon = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) { 
        const names = [`vert${i+1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simplecon.push(`vert${j + 1}`);
        }
        else {
          obj[names[0]].doublecon.push(`vert${j + 1}`);
        }
      }
    }
  }
}
const center = (x0, y0, p) =>{ 
  let x = x0 + p/8;
  let y = y0 + p/8;
  return {
    x : x,
    y : y
  }
}

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (let i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc)**2 + (obj[arr[i]].coords[1] - yc)**2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

function drawArrowhead(x0, y0, x1,y1, radius, fillStyle = 'black', strokestyle = 'black') {
  const xcenter = x1;
  const ycenter = y1;
  let angle;
  let x;
  let y;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  angle = Math.atan2(y1 - y0, x1 - x0);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;

  ctx.moveTo(x, y);
  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;
  ctx.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xcenter;
  y = radius * Math.sin(angle) + ycenter;
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

const readyCons = (x0, y0, x1, y1) => {
  const step = 1;
  const alpha = Math.atan2(y1 - y0, x1 - x0);
    const dx = step * Math.cos(alpha);
    const dy = step * Math.sin(alpha);
    let x = x0;
    let y = y0;
    while(true) {
      x += dx;
      y += dy;
      if(Math.sqrt((x1 - x)**2 + (y1 - y)**2) < r + arrr) break;
    }
    const res = {
      x : x,
      y : y
    };
    return res;
  }

  function simpleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r * 3.5) * Math.cos(Math.PI / 2 - alpha),
      dy : (r * 3.2) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  function doubleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r * 1.15) * Math.cos(Math.PI / 2 - alpha),
      dy : (r * 0.65) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  const drawOrSimpleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].simplecon.length; i++) {
        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].simplecon[i]}`].coords[0];
        const toY = obj[`${obj[key].simplecon[i]}`].coords[1];
  
        
        if (Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
          const coordinates = readyCons(fromX, fromY, toX, toY);
          drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);
        } 
        else {
        const { dx, dy } = simpleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);  
        }
      }
    }
  }

  const drawSimpleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].simplecon.length; i++) {
        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].simplecon[i]}`].coords[0];
        const toY = obj[`${obj[key].simplecon[i]}`].coords[1];
  
        
        if (Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simplecon[i]}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
          const coordinates = readyCons(fromX, fromY, toX, toY);
        } 
        else {
        const { dx, dy } = simpleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY); 
        }
      }
    }
  }

  const drawOrDoubleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].doublecon.length; i++) {

        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].doublecon[i]}`].coords[0];
        const toY = obj[`${obj[key].doublecon[i]}`].coords[1];
  
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
  
        const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
        } 
      }
    }

    const drawDoubleCons = obj => {
      for (const key in obj) {
        for (let i = 0; i < obj[key].doublecon.length; i++) {
    
          const fromX = obj[key].coords[0];
          const fromY = obj[key].coords[1];
          const toX = obj[`${obj[key].doublecon[i]}`].coords[0];
          const toY = obj[`${obj[key].doublecon[i]}`].coords[1];
    
    
          if (fromX + fromY > toX + toY) {
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
    
            const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
            let newX = (fromX + toX) / 2;
            let newY = (fromY + toY) / 2;
            newX += dx;
            newY -= dy;
            ctx.lineTo(newX, newY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
          }
        }
      }
    };

const drawVertex = obj => {
  for (let key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = "grey";
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.stroke();
  }
}

const pdeg = (obj, loops) => {
  ctx.font = '24px Times new Roman';
    ctx.fillStyle = "black";
    ctx.fillText('Deg+ (outside)', 150, 600);
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].pdeg = 0;
    if (loops.includes(`vert${obj[key].num}`)) obj[key].pdeg++;
    const cons = obj[key].simplecon.length + obj[key].doublecon.length;
    obj[key].pdeg += cons;
    ctx.fillText(`${name} : ${obj[key].pdeg}`, 150, 600 + obj[key].num * 25);
    ctx.stroke();
  }
};

const mdeg = (obj, loops) =>{
  ctx.font = '24px Times new Roman';
    ctx.fillStyle = "black";
    ctx.fillText('Deg- (inside)', 450, 600);
  for (const i in obj) {
    const name = `vert${obj[i].num}`;
    obj[i].mdeg = 0;
    if (loops.includes(`vert${obj[i].num}`)) obj[i].mdeg++;
    for (const j in obj) {
    if (obj[j].simplecon.includes(`vert${obj[i].num}`)) obj[i].mdeg++;
    if (obj[j].doublecon.includes(`vert${obj[i].num}`)) obj[i].mdeg++;
    }
    ctx.fillText(`${name} : ${obj[i].mdeg}`, 450, 600 + obj[i].num * 25);
    ctx.stroke();
  }  
}

const deg = (obj, loops) => {
    ctx.font = '24px Times new Roman';
    ctx.fillStyle = "black";
    ctx.fillText('Degrees', 900, 600);
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].deg = obj[key].simplecon.length;
    if (loops.includes(name)) obj[key].deg += 2;
    for (const j in obj) {
      if (obj[j].simplecon.includes(name)) obj[key].deg++;
      if (obj[j].doublecon.includes(name)) obj[key].deg++;
    }
    ctx.fillText(`${name} : ${obj[key].deg}`, 900, 600 + obj[key].num * 25);
    ctx.stroke();
  }
}

const regular = obj => {
  const comparable = obj.vert1.deg;
  let st = `Graph is regular (deg = ${obj.vert1.deg})`; 
  for (const key in obj) {
    if (obj[key].degree !== comparable) st = "Graph isn't regular";
  }
  ctx.fillText(st, 600, 950);
  ctx.stroke();
};

const isolated = obj => {
  let res = [];
  for (const key in obj) {
    if (obj[key].deg === 0) {
      obj[key].isolated = true;
      res.push(`vert${obj[key].num}`);
    }
  }
  if (res.length === 0) {
    ctx.fillText(`There are no isolated vertices`, 600, 975);
    ctx.stroke();
  }
  else {
    ctx.fillText('Isolated vertices: ' + `${res}`, 600, 975);
    ctx.stroke();
  }
}

const hanging = obj => {
  let res = [];
  for (const key in obj) {
    if (obj[key].deg === 1) {
      obj[key].hanging = true;
      res.push(`vert${obj[key].num}`);
    }
  }
  if (res.length === 0) {
    ctx.fillText(`There are no hanging vertices`, 600, 1000);
    ctx.stroke();
  }
  else {
    ctx.fillText('Hanging vertices: ' + `${res}`, 600, 1000);
    ctx.stroke();
  }
}

makeCons(A, grafinfo);
makeCons(A,neorgrafinfo);
drawLoops(loops, grafinfo,75, 100);
drawLoops(loops, neorgrafinfo, 675, 100);
drawOrSimpleCons(grafinfo);
drawSimpleCons(neorgrafinfo);
drawOrDoubleCons(grafinfo);
drawDoubleCons(neorgrafinfo);
drawVertex(grafinfo);
drawVertex(neorgrafinfo);
pdeg(grafinfo, loops);
mdeg(grafinfo, loops);
deg(neorgrafinfo, loops);
regular(neorgrafinfo);
isolated(neorgrafinfo);
hanging(neorgrafinfo);
