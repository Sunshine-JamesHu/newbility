const JSON5 = require('json5');
const fs = require('fs');
const { series } = require('gulp');
const child_process = require('child_process');

const pubedModules = new Set();

function getPkgJson(pkgPath) {
  const json = fs.readFileSync(pkgPath);
  const pkg = JSON5.parse(json.toString());
  return pkg;
}

function getVersion() {
  return getPkgJson('package.json').version;
}

function getModuleDependencies(pkgPath) {
  const pkg = getPkgJson(pkgPath);
  const dependencies = [];
  if (pkg.dependencies) {
    for (const key in pkg.dependencies) {
      if (Object.hasOwnProperty.call(pkg.dependencies, key)) {
        if (key.indexOf('@newbility') > -1) {
          dependencies.push(key.split('/')[1]);
        }
      }
    }
  }
  return dependencies;
}

function changeModuleVersion(pkgPath, version) {
  const pkg = getPkgJson(pkgPath);
  pkg.version = version;
  if (pkg.dependencies) {
    for (const key in pkg.dependencies) {
      if (Object.hasOwnProperty.call(pkg.dependencies, key)) {
        if (key.indexOf('@newbility') > -1) {
          pkg.dependencies[key] = `^${version}`;
        }
      }
    }
  }

  const newJson = JSON.stringify(pkg, null, 2);
  fs.writeFileSync(pkgPath, newJson, 'utf-8');
}

async function buildAndPubModule(moduleName, version) {
  if (pubedModules.has(moduleName)) return; // 已编译不再重新编译
  const modulePath = `src/${moduleName}/package.json`;
  changeModuleVersion(modulePath, version);
  const moduleDependencies = getModuleDependencies(modulePath);
  if (moduleDependencies && moduleDependencies.length) {
    for (let index = 0; index < moduleDependencies.length; index++) {
      const element = moduleDependencies[index];
      await buildAndPubModule(element, version);
    }
  }

  const task = new Promise((resovle, reject) => {
    console.log(`Start Publish Module [${moduleName}]`);
    child_process.exec(`cd src/${moduleName} && yarn --registry https://registry.npmjs.org && yarn pub`, (error) => {
      if (!error) {
        resovle();
        console.log(`Published Module [${moduleName}]`);
        pubedModules.add(moduleName);
      } else {
        reject(error);
      }
    });
  });
  return task;
}

async function buildAndPubAllModule() {
  const version = getVersion();
  if (!version) throw new Error('Version is not null or empty.');
  const modules = fs.readdirSync('src');
  for (let index = 0; index < modules.length; index++) {
    const moudle = modules[index];
    await buildAndPubModule(moudle, version);
  }
}

function buildAndPubModules(cb) {
  buildAndPubAllModule().then(() => {
    cb();
  });
}

function buildTestModule(cb) {
  const version = getVersion();
  console.log(`Build Module [test]`);
  changeModuleVersion('./test/package.json', version);
  child_process.exec(`cd test && yarn --registry https://registry.npmjs.org`, (error) => {
    if (!error) cb();
  });
}

exports.default = series([buildAndPubModules, buildTestModule]);
