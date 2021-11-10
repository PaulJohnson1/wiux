import init from "./src/index"; // only way that i know to change the entry point on a repl project

init();

/** Performance test */

// import { benchmark } from "./src/SpatialHashing";

// const times: any = [];
// for (let i = 0; i < 100_000; i += 100) {
//   const time = [i, benchmark(i)];

//   times.push(time);
//   console.log(time);
// }

// let asht = "";
// times.forEach((t: any) => {
//   asht += `${t[0]}\\t${t[1][0] + t[1][1]}\n`
// });

// console.log(asht);
