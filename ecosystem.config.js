module.exports = {
  apps : [{
    name: "back",
    script: "npm",
    args : "start",
    instances : "max",
    exec_mode: "cluster"
  }]
}
