const { exec } = require('child_process');
const path = require('path');

const createReactApp = (projectName, callback) => {
  const projectPath = path.join(__dirname, '..', 'ecommerce_sites', projectName);

  exec(`npx create-react-app ${projectPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return callback(error);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    exec(`cd ${projectPath} && netlify deploy --prod --dir=build`, (deployError, deployStdout, deployStderr) => {
      if (deployError) {
        console.error(`deploy error: ${deployError}`);
        return callback(deployError);
      }
      console.log(`deploy stdout: ${deployStdout}`);
      console.log(`deploy stderr: ${deployStderr}`);
      callback(null, projectPath);
    });
  });
};

module.exports = createReactApp;