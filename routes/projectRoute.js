const express = require('express');
const Project = require('../models/projectModel');
const createReactApp = require('../utils/createReactApp');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { spawn } = require('child_process');

// Build project
router.post('/:id/build', async (req, res) => {
  const projectId = req.params.id;

  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Create a React app in the ecom folder
    createReactApp(project.name, async (err, projectPath) => {
      if (err) return res.status(500).json({ error: 'Failed to create React app' });

      // Apply customizations to the new React app (e.g., templates, styling, etc.)
      fs.writeFileSync(
        path.join(projectPath, 'src', 'App.js'),
        `import React from 'react';

        const App = () => (
          <div style={{ backgroundColor: '${project.customizationData.bgColor || 'white'}' }}>
            <h1>Welcome to ${project.name}</h1>
            {/* Add more components and customizations here */}
          </div>
        );

        export default App;
        `
      );

      // Build the project
      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: path.resolve(__dirname, '../../ecom'), // Path to ecom folder
        shell: true,
      });

      buildProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      buildProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      buildProcess.on('close', async (code) => {
        if (code === 0) {
          // Start the development server
          const startProcess = spawn('npm', ['run', 'start'], {
            cwd: path.resolve(__dirname, '../../ecom'), // Path to ecom folder
            shell: true,
          });

          startProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
          });

          startProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
          });

          startProcess.on('close', (code) => {
            if (code === 0) {
              console.log(`E-commerce site started successfully`);
              res.json({ message: 'E-commerce site created, built, and started successfully' });
            } else {
              res.status(500).json({ error: 'Failed to start the project' });
            }
          });
        } else {
          res.status(500).json({ error: 'Failed to build the project' });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const project = new Project({ name : req.body.name});
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Server Error'+ error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Add a new route for updating background color customization
router.put('/customize/bgcolor', async (req, res) => {
  try {
    const { projectName, bgColor } = req.body;
    const project = await Project.findOne({ name: projectName });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.customizationData.bgColor = bgColor;
    await project.save();

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Add a new route to get customization data
router.get('/:id/customize', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project.customizationData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;


